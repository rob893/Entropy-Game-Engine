import { PhysicsEngine } from './PhysicsEngine';
import { GameObject } from '../game-objects/GameObject';
import { Time } from './Time';
import { RenderingEngine } from './RenderingEngine';
import { TerrainBuilder } from './helpers/TerrainBuilder';
import type { IScene } from './types';
import { Input } from './helpers/Input';
import { ComponentAnalyzer } from './helpers/ComponentAnalyzer';
import { SceneManager } from './helpers/SceneManager';
import { Layer } from './enums/Layer';
import { SpatialHashCollisionDetector } from './physics/SpatialHashCollisionDetector';
import { ImpulseCollisionResolver } from './physics/ImpulseCollisionResolver';
import { Physics } from './physics/Physics';
import type { Vector2 } from './helpers/Vector2';
import type { Transform } from '../components/Transform';
import { AssetPool } from './helpers/AssetPool';
import type { Terrain } from '../game-objects/Terrain';
import type { IGameObjectConstructionParams } from './types';
import type { IGameEngineConfiguration } from './types';

export class GameEngine {
  public developmentMode: boolean = true;
  public readonly layerCollisionMatrix: Map<Layer, Set<Layer>>;

  private _physicsEngine: PhysicsEngine | null = null;
  private _renderingEngine: RenderingEngine | null = null;
  private loadedScene: IScene | null = null;
  private gameLoopId: number | null = null;
  private gameInitialized: boolean = false;
  private _paused: boolean = false;
  private _gameObjects: GameObject[] = [];
  private _input: Input | null = null;
  private _physics: Physics | null = null;
  private _assetPool: AssetPool | null = null;
  private _time: Time | null = null;
  private _sceneManager: SceneManager | null = null;
  private _terrain: Terrain | null = null;
  private _componentAnalyzer: ComponentAnalyzer | null = null;
  private prevFrameTime: number = 0;
  private fpsIntervalInMS: number = 0;
  private fpsCap: number = 60;
  private _fixedTimeStep: number = 1 / 60;
  private physicsAccumulator: number = 0;
  private readonly gameObjectMap: Map<string, GameObject> = new Map<string, GameObject>();
  private readonly tagMap: Map<string, GameObject[]> = new Map<string, GameObject[]>();
  private readonly scenes: Map<number | string, IScene> = new Map<number | string, IScene>();
  private readonly _gameCanvas: HTMLCanvasElement;
  private readonly invokeTimeouts: Set<number> = new Set<number>();
  private readonly gameObjectsMarkedForDelete: GameObject[] = [];
  private readonly configuration: IGameEngineConfiguration;

  public constructor(configuration: IGameEngineConfiguration) {
    this._gameCanvas = configuration.gameCanvas;
    this.configuration = configuration;

    this.layerCollisionMatrix = new Map<Layer, Set<Layer>>();

    const layers = Object.keys(Layer)
      .filter(c => typeof Layer[c as any] === 'number')
      .map(k => Number(Layer[k as any]));

    for (const layer of layers) {
      this.layerCollisionMatrix.set(layer, new Set(layers));
    }

    const collidingLayers = this.layerCollisionMatrix.get(Layer.Terrain);

    if (collidingLayers === undefined) {
      throw new Error('Error with layers');
    }

    collidingLayers.delete(Layer.Terrain);
    this.fpsLimit = configuration.fpsLimit ?? 60;
    this.fixedTimeStep = configuration.fixedTimeStep ?? 1 / 60;
  }

  public get canvasContext(): CanvasRenderingContext2D {
    const context = this.gameCanvas.getContext('2d');

    if (context === null) {
      throw new Error('No context!');
    }

    return context;
  }

  public get input(): Input {
    if (this._input === null) {
      throw new Error('Input is null');
    }

    return this._input;
  }

  public get physics(): Physics {
    if (this._physics === null) {
      throw new Error('Physics is null');
    }

    return this._physics;
  }

  public get time(): Time {
    if (this._time === null) {
      throw new Error('Time is null');
    }

    return this._time;
  }

  public get paused(): boolean {
    return this._paused;
  }

  public set paused(value: boolean) {
    this._paused = value;

    if (!value && this._time !== null) {
      this.physicsAccumulator = 0;
      this.time.resetTime();
    }
  }

  public get componentAnalyzer(): ComponentAnalyzer {
    if (this._componentAnalyzer === null) {
      throw new Error('Component Analyzer is null');
    }

    return this._componentAnalyzer;
  }

  public get sceneManager(): SceneManager {
    if (this._sceneManager === null) {
      throw new Error('Scene Manager Analyzer is null');
    }

    return this._sceneManager;
  }

  public get terrain(): Terrain {
    if (this._terrain === null) {
      throw new Error('Terrain is null');
    }

    return this._terrain;
  }

  public get assetPool(): AssetPool {
    if (this._assetPool === null) {
      throw new Error('Asset pool is null');
    }

    return this._assetPool;
  }

  public get gameCanvas(): HTMLCanvasElement {
    return this._gameCanvas;
  }

  public get gameObjects(): readonly GameObject[] {
    return [...this._gameObjects];
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
    if (this.loadedScene === null) {
      throw new Error('No scene is currently loaded!');
    }

    return this.getScenePrimaryId(this.loadedScene);
  }

  public get fpsLimit(): number {
    return this.fpsCap;
  }

  public set fpsLimit(value: number) {
    this.fpsCap = value;
    this.fpsIntervalInMS = Math.floor(1000 / value);
  }

  public get fixedTimeStep(): number {
    return this._fixedTimeStep;
  }

  public set fixedTimeStep(value: number) {
    if (!Number.isFinite(value) || value <= 0) {
      throw new Error('fixedTimeStep must be a positive number');
    }

    this._fixedTimeStep = value;
    this.physicsAccumulator = 0;
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
    }, 1000 * time);

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
    const isRegistered = this.gameObjectMap.get(previousId) === gameObject || this._gameObjects.includes(gameObject);

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
    this._gameObjects.forEach(go => console.log(go));
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

  private get physicsEngine(): PhysicsEngine {
    if (this._physicsEngine === null) {
      throw new Error('Physics Engine is null');
    }

    return this._physicsEngine;
  }

  private get renderingEngine(): RenderingEngine {
    if (this._renderingEngine === null) {
      throw new Error('Rendering Engine is null');
    }

    return this._renderingEngine;
  }

  private removeReferencesToGameObject(object: GameObject): void {
    if (this.gameObjectMap.has(object.id)) {
      this.gameObjectMap.delete(object.id);
    }

    const index = this._gameObjects.indexOf(object);

    if (index !== -1) {
      this._gameObjects.splice(index, 1);
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
    this._gameObjects.length = 0;
    this.gameObjectsMarkedForDelete.length = 0;

    this.loadedScene = null;
    this._assetPool = null;
    this._componentAnalyzer = null;

    if (this._renderingEngine !== null) {
      this._renderingEngine.mainCamera = null;
    }
    this._input = null;
    this._physics = null;
    this._sceneManager = null;
    this._terrain = null;
    this._time = null;
  }

  private async initializeScene(scene: IScene): Promise<void> {
    this._assetPool = scene.getAssetPool !== undefined ? await scene.getAssetPool() : new AssetPool(new Map<string, unknown>());

    if (scene.gravity !== undefined) {
      this.gravity = scene.gravity;
    }

    const terrainSpec = scene.terrainSpec ?? null;
    let gameObjects: GameObject[] = [];

    if (terrainSpec !== null) {
      const terrianBuilder = new TerrainBuilder(this._gameCanvas.width, this._gameCanvas.height);
      const terrain = await terrianBuilder.buildTerrain(this, terrainSpec);

      gameObjects.push(terrain);

      this.renderingEngine.terrain = terrain;
      this._terrain = terrain;
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
          this._gameCanvas.width,
          this._gameCanvas.height,
          this.layerCollisionMatrix,
          100
        );

    const collisionResolver = this.configuration.collisionResolverGenerator
      ? this.configuration.collisionResolverGenerator(this)
      : new ImpulseCollisionResolver();

    this._physicsEngine = new PhysicsEngine(collisionDetector, collisionResolver);

    this._renderingEngine = new RenderingEngine(this.canvasContext);
    this.renderingEngine.renderGizmos = this.developmentMode;

    this._input = new Input(this._gameCanvas);
    this._componentAnalyzer = new ComponentAnalyzer(this.physicsEngine, this.renderingEngine);
    this._sceneManager = new SceneManager(this);
    this._time = time;
    this._physics = new Physics(this.physicsEngine);
  }

  private setGameObjects(gameObjects: GameObject[]): void {
    this._gameObjects = [];

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
    this._gameObjects.push(gameObject);
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

    //this.time.start();
    this.physicsAccumulator = 0;
    this.paused = false;

    this._gameObjects.forEach(go => go.start());

    this.gameLoopId = requestAnimationFrame(timeStamp => this.gameLoop(timeStamp));
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

    for (const gameObject of this._gameObjects) {
      if (gameObject.enabled) {
        gameObject.update();
      }
    }

    this.renderingEngine.renderScene();
  }

  private gameLoop(timeStamp: number): void {
    const now = performance.now();
    const diff = now - this.prevFrameTime;

    if (diff >= this.fpsIntervalInMS) {
      this.prevFrameTime = now;
      this.update(now);
    }

    this.gameLoopId = requestAnimationFrame(newTimeStamp => this.gameLoop(newTimeStamp));
  }
}
