import type { Transform } from '../components/Transform';
import { GameObject } from '../game-objects/GameObject';
import type { Terrain } from '../game-objects/Terrain';
import { Layer } from './enums/Layer';
import { AssetPool } from './helpers/AssetPool';
import { ComponentAnalyzer } from './helpers/ComponentAnalyzer';
import { Input } from './helpers/Input';
import { SceneManager } from './helpers/SceneManager';
import { TerrainBuilder } from './helpers/TerrainBuilder';
import type { Vector2 } from './helpers/Vector2';
import { ImpulseCollisionResolver } from './physics/ImpulseCollisionResolver';
import { Physics } from './physics/Physics';
import { SpatialHashCollisionDetector } from './physics/SpatialHashCollisionDetector';
import { PhysicsEngine } from './PhysicsEngine';
import { RenderingEngine } from './RenderingEngine';
import { Time } from './Time';
import type { IScene } from './types';
import type { IGameObjectConstructionParams } from './types';
import type { IGameEngineConfiguration } from './types';

const DEFAULT_FPS_CAP = 60;
const DEFAULT_FIXED_TIME_STEP = 1 / 60;
const MS_PER_SECOND = 1000;

export class GameEngine {
  public developmentMode: boolean = true;

  public readonly layerCollisionMatrix: Map<Layer, Set<Layer>>;

  private loadedScene: IScene | null = null;

  private gameLoopId: number | null = null;

  private gameInitialized: boolean = false;

  private prevFrameTime: number = 0;

  private fpsIntervalInMS: number = 0;

  private fpsCap: number = DEFAULT_FPS_CAP;

  private physicsAccumulator: number = 0;

  private readonly gameObjectMap: Map<string, GameObject> = new Map<string, GameObject>();

  private readonly tagMap: Map<string, GameObject[]> = new Map<string, GameObject[]>();

  private readonly scenes: Map<number | string, IScene> = new Map<number | string, IScene>();

  private readonly invokeTimeouts: Set<number> = new Set<number>();

  private readonly gameObjectsMarkedForDelete: GameObject[] = [];

  private readonly configuration: IGameEngineConfiguration;

  #physicsEngine: PhysicsEngine | null = null;

  #renderingEngine: RenderingEngine | null = null;

  #paused: boolean = false;

  #gameObjects: GameObject[] = [];

  #input: Input | null = null;

  #physics: Physics | null = null;

  #assetPool: AssetPool | null = null;

  #time: Time | null = null;

  #sceneManager: SceneManager | null = null;

  #terrain: Terrain | null = null;

  #componentAnalyzer: ComponentAnalyzer | null = null;

  #fixedTimeStep: number = DEFAULT_FIXED_TIME_STEP;

  readonly #gameCanvas: HTMLCanvasElement;

  public constructor(configuration: IGameEngineConfiguration) {
    this.#gameCanvas = configuration.gameCanvas;
    this.configuration = configuration;

    this.layerCollisionMatrix = new Map<Layer, Set<Layer>>();

    const layers = Object.values(Layer).filter((value): value is Layer => typeof value === 'number');

    for (const layer of layers) {
      this.layerCollisionMatrix.set(layer, new Set(layers));
    }

    const collidingLayers = this.layerCollisionMatrix.get(Layer.Terrain);

    if (collidingLayers === undefined) {
      throw new Error('Error with layers');
    }

    collidingLayers.delete(Layer.Terrain);
    this.fpsLimit = configuration.fpsLimit ?? DEFAULT_FPS_CAP;
    this.fixedTimeStep = configuration.fixedTimeStep ?? DEFAULT_FIXED_TIME_STEP;
  }

  public get canvasContext(): CanvasRenderingContext2D {
    return this.assertInitialized(this.gameCanvas.getContext('2d'), 'Canvas context');
  }

  public get input(): Input {
    return this.assertInitialized(this.#input, 'Input');
  }

  public get physics(): Physics {
    return this.assertInitialized(this.#physics, 'Physics');
  }

  public get time(): Time {
    return this.assertInitialized(this.#time, 'Time');
  }

  public get paused(): boolean {
    return this.#paused;
  }

  public set paused(value: boolean) {
    this.#paused = value;

    if (!value && this.#time !== null) {
      this.physicsAccumulator = 0;
      this.time.resetTime();
    }
  }

  public get componentAnalyzer(): ComponentAnalyzer {
    return this.assertInitialized(this.#componentAnalyzer, 'Component Analyzer');
  }

  public get sceneManager(): SceneManager {
    return this.assertInitialized(this.#sceneManager, 'Scene Manager');
  }

  public get terrain(): Terrain {
    return this.assertInitialized(this.#terrain, 'Terrain');
  }

  public get assetPool(): AssetPool {
    return this.assertInitialized(this.#assetPool, 'Asset Pool');
  }

  public get gameCanvas(): HTMLCanvasElement {
    return this.#gameCanvas;
  }

  public get gameObjects(): readonly GameObject[] {
    return [...this.#gameObjects];
  }

  public get currentScene(): IScene | null {
    return this.loadedScene;
  }

  public get gravity(): number {
    return this.physicsEngine.gravity;
  }

  public set gravity(value: number) {
    this.physicsEngine.gravity = value;
  }

  public get loadedSceneId(): number {
    return this.getScenePrimaryId(this.assertInitialized(this.loadedScene, 'Loaded scene'));
  }

  public get fpsLimit(): number {
    return this.fpsCap;
  }

  public set fpsLimit(value: number) {
    this.fpsCap = value;
    this.fpsIntervalInMS = Math.floor(MS_PER_SECOND / value);
  }

  public get fixedTimeStep(): number {
    return this.#fixedTimeStep;
  }

  public set fixedTimeStep(value: number) {
    if (!Number.isFinite(value) || value <= 0) {
      throw new Error('fixedTimeStep must be a positive number');
    }

    this.#fixedTimeStep = value;
    this.physicsAccumulator = 0;
  }

  private get physicsEngine(): PhysicsEngine {
    return this.assertInitialized(this.#physicsEngine, 'Physics Engine');
  }

  private get renderingEngine(): RenderingEngine {
    return this.assertInitialized(this.#renderingEngine, 'Rendering Engine');
  }

  public instantiate<T extends GameObject>(
    type: new (constructionParams: IGameObjectConstructionParams) => T,
    position?: Vector2,
    rotation?: number,
    parent?: Transform
  ): GameObject {
    const newGameObject = new type({ gameEngine: this });

    if (position !== undefined) {
      newGameObject.transform.setPosition(position.x, position.y);
    }

    if (rotation !== undefined) {
      newGameObject.transform.rotation = rotation;
    }

    if (parent !== undefined) {
      newGameObject.transform.parent = parent;
    }

    this.registerGameObject(newGameObject);

    return newGameObject;
  }

  public destroy(object: GameObject, time: number = 0): void {
    if (time === 0) {
      this.gameObjectsMarkedForDelete.push(object);

      const {
        transform: { children }
      } = object;

      while (children.length > 0) {
        const child = children.pop();

        if (child === undefined) {
          throw new Error('Error getting child');
        }

        this.gameObjectsMarkedForDelete.push(child.gameObject);

        for (const childsChild of child.children) {
          children.push(childsChild);
        }
      }
    } else {
      this.invoke(() => {
        this.gameObjectsMarkedForDelete.push(object);

        const {
          transform: { children }
        } = object;

        while (children.length > 0) {
          const child = children.pop();

          if (child === undefined) {
            throw new Error('Error getting child');
          }

          this.gameObjectsMarkedForDelete.push(child.gameObject);

          for (const childsChild of child.children) {
            children.push(childsChild);
          }
        }
      }, time);
    }
  }

  public invoke(funcToInvoke: () => void, time: number): void {
    const timeout = window.setTimeout(() => {
      funcToInvoke();
      this.invokeTimeouts.delete(timeout);
    }, MS_PER_SECOND * time);

    this.invokeTimeouts.add(timeout);
  }

  public invokeRepeating(funcToInvoke: () => void, repeatRate: number, cancelToken?: { cancel: boolean }): void {
    this.invoke(() => {
      if (cancelToken !== undefined && cancelToken.cancel) {
        return;
      }

      funcToInvoke();

      this.invokeRepeating(funcToInvoke, repeatRate, cancelToken);
    }, repeatRate);
  }

  public findGameObjectById(id: string): GameObject | null {
    const gameObject = this.gameObjectMap.get(id);

    if (gameObject === undefined) {
      return null;
    }

    return gameObject;
  }

  public findGameObjectWithTag(tag: string): GameObject | null {
    const gameObjects = this.tagMap.get(tag);

    if (gameObjects === undefined || gameObjects.length === 0) {
      return null;
    }

    return gameObjects[0];
  }

  public findGameObjectsWithTag(tag: string): GameObject[] {
    const gameObjects = this.tagMap.get(tag);

    if (gameObjects === undefined) {
      return [];
    }

    return [...gameObjects];
  }

  public syncGameObjectRegistration(gameObject: GameObject, previousId: string, previousTag: string): void {
    const isRegistered = this.gameObjectMap.get(previousId) === gameObject || this.#gameObjects.includes(gameObject);

    if (!isRegistered) {
      return;
    }

    if (previousId !== gameObject.id) {
      const conflictingObject = this.gameObjectMap.get(gameObject.id);
      if (conflictingObject !== undefined && conflictingObject !== gameObject) {
        throw new Error(`Game object with id ${gameObject.id} is already registered.`);
      }

      if (this.gameObjectMap.get(previousId) === gameObject) {
        this.gameObjectMap.delete(previousId);
      }

      this.gameObjectMap.set(gameObject.id, gameObject);
    }

    if (previousTag === gameObject.tag) {
      return;
    }

    const previousTagObjects = this.tagMap.get(previousTag);
    if (previousTagObjects !== undefined) {
      const previousTagIndex = previousTagObjects.indexOf(gameObject);
      if (previousTagIndex !== -1) {
        previousTagObjects.splice(previousTagIndex, 1);
      }

      if (previousTagObjects.length === 0) {
        this.tagMap.delete(previousTag);
      }
    }

    const nextTagObjects = this.tagMap.get(gameObject.tag);
    if (nextTagObjects !== undefined) {
      if (!nextTagObjects.includes(gameObject)) {
        nextTagObjects.push(gameObject);
      }
    } else {
      this.tagMap.set(gameObject.tag, [gameObject]);
    }
  }

  public printGameData(): void {
    console.log(this);
    console.log(`Time since game start ${this.time.totalTime}s`);
    console.log(this.renderingEngine);
    console.log(this.physicsEngine);
    this.#gameObjects.forEach(go => console.log(go));
  }

  public togglePause(): void {
    this.paused = !this.paused;
  }

  public setScenes(scenes: IScene[]): void {
    for (const scene of scenes) {
      for (const key of this.getSceneRegistrationKeys(scene)) {
        const existingScene = this.scenes.get(key);

        if (existingScene !== undefined && existingScene !== scene) {
          console.error(`Duplicate scene identifier detected ${String(key)} ${scene.name}`);
        }

        this.scenes.set(key, scene);
      }
    }
  }

  public async loadScene(loadOrderOrName: number | string): Promise<void> {
    const scene = this.scenes.get(loadOrderOrName);

    if (scene === undefined) {
      throw new Error(`IScene ${loadOrderOrName} not found.`);
    }

    this.endCurrentScene();

    this.createEnginesAndAPIs();

    await this.initializeScene(scene);

    this.loadedScene = scene;
    this.startGame();
  }

  private getScenePrimaryId(scene: IScene): number {
    if (scene.sceneId !== undefined) {
      return scene.sceneId;
    }

    if (scene.loadOrder !== undefined) {
      return scene.loadOrder;
    }

    throw new Error(`IScene ${scene.name} must define sceneId or loadOrder.`);
  }

  private getSceneRegistrationKeys(scene: IScene): Array<number | string> {
    const keys = new Set<number | string>([scene.name]);

    if (scene.sceneId !== undefined) {
      keys.add(scene.sceneId);
    }

    if (scene.loadOrder !== undefined) {
      keys.add(scene.loadOrder);
    }

    if (keys.size === 1) {
      throw new Error(`IScene ${scene.name} must define sceneId or loadOrder.`);
    }

    return [...keys];
  }

  private assertInitialized<T>(value: T | null, name: string): T {
    if (value === null) {
      throw new Error(`${name} is not initialized. Ensure the game engine has been started.`);
    }

    return value;
  }

  private removeReferencesToGameObject(object: GameObject): void {
    if (this.gameObjectMap.has(object.id)) {
      this.gameObjectMap.delete(object.id);
    }

    const index = this.#gameObjects.indexOf(object);

    if (index !== -1) {
      this.#gameObjects.splice(index, 1);
    }

    const gameObjectsWithTag = this.tagMap.get(object.tag);

    if (gameObjectsWithTag !== undefined) {
      const tagIndex = gameObjectsWithTag.indexOf(object);

      if (tagIndex !== -1) {
        gameObjectsWithTag.splice(tagIndex, 1);
      }
    }

    object.onDestroy();
  }

  private registerGameObject(newGameObject: GameObject): void {
    const gameObjectsToRegister = this.collectGameObjects(newGameObject);

    for (const gameObject of gameObjectsToRegister) {
      this.addGameObjectToCollections(gameObject);
      gameObject.start();
    }
  }

  private endCurrentScene(): void {
    if (this.loadedScene === null) {
      return;
    }

    if (this.gameLoopId !== null) {
      cancelAnimationFrame(this.gameLoopId);
      this.gameLoopId = null;
    }

    for (const timeout of this.invokeTimeouts) {
      window.clearTimeout(timeout);
    }

    this.invokeTimeouts.clear();
    this.physicsAccumulator = 0;

    this.input.clearListeners();
    this.tagMap.clear();
    this.gameObjectMap.clear();
    this.#gameObjects.length = 0;
    this.gameObjectsMarkedForDelete.length = 0;

    this.loadedScene = null;
    this.#assetPool = null;
    this.#componentAnalyzer = null;

    if (this.#renderingEngine !== null) {
      this.#renderingEngine.mainCamera = null;
    }
    this.#input = null;
    this.#physics = null;
    this.#sceneManager = null;
    this.#terrain = null;
    this.#time = null;
  }

  private async initializeScene(scene: IScene): Promise<void> {
    this.#assetPool =
      scene.getAssetPool !== undefined ? await scene.getAssetPool() : new AssetPool(new Map<string, unknown>());

    if (scene.gravity !== undefined) {
      this.gravity = scene.gravity;
    }

    const terrainSpec = scene.terrainSpec ?? null;
    let gameObjects: GameObject[] = [];

    if (terrainSpec !== null) {
      const terrianBuilder = new TerrainBuilder(this.#gameCanvas.width, this.#gameCanvas.height);
      const terrain = await terrianBuilder.buildTerrain(this, terrainSpec);

      gameObjects.push(terrain);

      this.renderingEngine.terrain = terrain;
      this.#terrain = terrain;
    }

    gameObjects = [...gameObjects, ...scene.getStartingGameObjects(this)];
    const skyBox = scene.getSkybox !== undefined ? scene.getSkybox(this) : null;

    if (skyBox !== null) {
      this.renderingEngine.background = skyBox;
    }

    if (skyBox instanceof GameObject) {
      gameObjects.push(skyBox);
    }

    this.setGameObjects(gameObjects);

    this.gameInitialized = true;
  }

  private createEnginesAndAPIs(): void {
    const time = new Time();

    const collisionDetector = this.configuration.collisionDetectorGenerator
      ? this.configuration.collisionDetectorGenerator(this)
      : new SpatialHashCollisionDetector(
          this.#gameCanvas.width,
          this.#gameCanvas.height,
          this.layerCollisionMatrix,
          100
        );

    const collisionResolver = this.configuration.collisionResolverGenerator
      ? this.configuration.collisionResolverGenerator(this)
      : new ImpulseCollisionResolver();

    this.#physicsEngine = new PhysicsEngine(collisionDetector, collisionResolver);

    this.#renderingEngine = new RenderingEngine(this.canvasContext);
    this.renderingEngine.renderGizmos = this.developmentMode;

    this.#input = new Input(this.#gameCanvas);
    this.#componentAnalyzer = new ComponentAnalyzer(this.physicsEngine, this.renderingEngine);
    this.#sceneManager = new SceneManager(this);
    this.#time = time;
    this.#physics = new Physics(this.physicsEngine);
  }

  private setGameObjects(gameObjects: GameObject[]): void {
    this.#gameObjects = [];

    for (const gameObject of gameObjects) {
      const gameObjectsToRegister = this.collectGameObjects(gameObject);

      for (const currentGameObject of gameObjectsToRegister) {
        this.addGameObjectToCollections(currentGameObject);
      }
    }
  }

  private addGameObjectToCollections(gameObject: GameObject): void {
    if (this.gameObjectMap.has(gameObject.id)) {
      throw new Error(`Game object with id ${gameObject.id} is already registered.`);
    }

    const gameObjectsWithTag = this.tagMap.get(gameObject.tag);
    if (gameObjectsWithTag !== undefined) {
      gameObjectsWithTag.push(gameObject);
    } else {
      this.tagMap.set(gameObject.tag, [gameObject]);
    }

    this.gameObjectMap.set(gameObject.id, gameObject);
    this.#gameObjects.push(gameObject);
  }

  private collectGameObjects(rootGameObject: GameObject): GameObject[] {
    const gameObjects = [rootGameObject];

    for (let i = 0; i < gameObjects.length; i++) {
      gameObjects.push(...gameObjects[i].transform.children.map(child => child.gameObject));
    }

    return gameObjects;
  }

  private startGame(): void {
    if (!this.gameInitialized) {
      throw new Error('The game is not initialized yet!');
    }

    this.physicsAccumulator = 0;
    this.paused = false;

    this.#gameObjects.forEach(go => go.start());

    this.gameLoopId = requestAnimationFrame(() => this.gameLoop());
  }

  private update(timeStamp: number): void {
    if (this.paused) {
      return;
    }

    while (this.gameObjectsMarkedForDelete.length > 0) {
      const gameObject = this.gameObjectsMarkedForDelete.pop();

      if (gameObject === undefined) {
        throw new Error('Error deleting game object');
      }

      this.removeReferencesToGameObject(gameObject);
    }

    this.time.updateTime(timeStamp);
    this.physicsAccumulator += this.time.deltaTime;

    while (this.physicsAccumulator >= this.fixedTimeStep) {
      this.physicsEngine.updatePhysics(this.fixedTimeStep);
      this.physicsAccumulator -= this.fixedTimeStep;
    }

    for (const gameObject of this.#gameObjects) {
      if (gameObject.enabled) {
        gameObject.update();
      }
    }

    this.renderingEngine.renderScene();
  }

  private gameLoop(): void {
    const now = performance.now();
    const diff = now - this.prevFrameTime;

    if (diff >= this.fpsIntervalInMS) {
      this.prevFrameTime = now;
      this.update(now);
    }

    this.gameLoopId = requestAnimationFrame(() => this.gameLoop());
  }
}
