import type { Transform } from '../components/Transform';
import { GameObject } from '../game-objects/GameObject';
import type { Terrain } from '../game-objects/Terrain';
import { Layer } from './enums/Layer';
import { GameLoop } from './GameLoop';
import { GameObjectRegistry } from './GameObjectRegistry';
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
import { SchedulerService } from './SchedulerService';
import { Time } from './Time';
import type { IScene } from './types';
import type { IGameObjectConstructionParams } from './types';
import type { IGameEngineConfiguration } from './types';

const DEFAULT_FPS_CAP = 60;
const DEFAULT_FIXED_TIME_STEP = 1 / 60;

export class GameEngine {
  public developmentMode: boolean = true;

  public readonly layerCollisionMatrix: Map<Layer, Set<Layer>>;

  private loadedScene: IScene | null = null;

  private gameInitialized: boolean = false;

  private readonly scenes: Map<number | string, IScene> = new Map<number | string, IScene>();

  private readonly configuration: IGameEngineConfiguration;

  private readonly scheduler: SchedulerService = new SchedulerService();

  private registry: GameObjectRegistry = new GameObjectRegistry(this.scheduler);

  private gameLoop: GameLoop | null = null;

  #physicsEngine: PhysicsEngine | null = null;

  #renderingEngine: RenderingEngine | null = null;

  #paused: boolean = false;

  #input: Input | null = null;

  #physics: Physics | null = null;

  #assetPool: AssetPool | null = null;

  #time: Time | null = null;

  #sceneManager: SceneManager | null = null;

  #terrain: Terrain | null = null;

  #componentAnalyzer: ComponentAnalyzer | null = null;

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
      if (this.gameLoop !== null) {
        this.gameLoop.resetPhysicsAccumulator();
      }

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
    return this.registry.allGameObjects;
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
    return this.gameLoop !== null ? this.gameLoop.fpsLimit : DEFAULT_FPS_CAP;
  }

  public set fpsLimit(value: number) {
    if (this.gameLoop !== null) {
      this.gameLoop.fpsLimit = value;
    }
  }

  public get fixedTimeStep(): number {
    return this.gameLoop !== null ? this.gameLoop.fixedTimeStep : DEFAULT_FIXED_TIME_STEP;
  }

  public set fixedTimeStep(value: number) {
    if (this.gameLoop !== null) {
      this.gameLoop.fixedTimeStep = value;
    }
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
    return this.registry.instantiate(type, this, position, rotation, parent);
  }

  public destroy(object: GameObject, time: number = 0): void {
    this.registry.destroy(object, time);
  }

  public invoke(funcToInvoke: () => void, time: number): void {
    this.scheduler.invoke(funcToInvoke, time);
  }

  public invokeRepeating(funcToInvoke: () => void, repeatRate: number, cancelToken?: { cancel: boolean }): void {
    this.scheduler.invokeRepeating(funcToInvoke, repeatRate, cancelToken);
  }

  public findGameObjectById(id: string): GameObject | null {
    return this.registry.findGameObjectById(id);
  }

  public findGameObjectWithTag(tag: string): GameObject | null {
    return this.registry.findGameObjectWithTag(tag);
  }

  public findGameObjectsWithTag(tag: string): GameObject[] {
    return this.registry.findGameObjectsWithTag(tag);
  }

  public syncGameObjectRegistration(gameObject: GameObject, previousId: string, previousTag: string): void {
    this.registry.syncGameObjectRegistration(gameObject, previousId, previousTag);
  }

  public printGameData(): void {
    console.log(this);
    console.log(`Time since game start ${this.time.totalTime}s`);
    console.log(this.renderingEngine);
    console.log(this.physicsEngine);

    for (const go of this.registry.allGameObjects) {
      console.log(go);
    }
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

  private endCurrentScene(): void {
    if (this.loadedScene === null) {
      return;
    }

    if (this.gameLoop !== null) {
      this.gameLoop.stop();
      this.gameLoop = null;
    }

    this.scheduler.clearAll();

    this.input.clearListeners();
    this.registry.clear();

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

    this.registry.setGameObjects(gameObjects);

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

    this.registry = new GameObjectRegistry(this.scheduler);
  }

  private startGame(): void {
    if (!this.gameInitialized) {
      throw new Error('The game is not initialized yet!');
    }

    this.paused = false;

    this.registry.startAllGameObjects();

    this.gameLoop = new GameLoop(
      {
        processDestroyQueue: (): void => this.registry.processDestroyQueue(),
        updateTime: (timeStamp: number): number => {
          this.time.updateTime(timeStamp);
          return this.time.deltaTime;
        },
        physicsStep: (fixedDeltaTime: number): void => this.physicsEngine.updatePhysics(fixedDeltaTime),
        updateGameObjects: (): void => this.registry.updateAllGameObjects(),
        render: (): void => this.renderingEngine.renderScene(),
        isPaused: (): boolean => this.#paused
      },
      this.configuration.fpsLimit ?? DEFAULT_FPS_CAP,
      this.configuration.fixedTimeStep ?? DEFAULT_FIXED_TIME_STEP
    );

    this.gameLoop.start();
  }
}
