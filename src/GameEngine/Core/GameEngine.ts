import { PhysicsEngine } from './PhysicsEngine';
import { GameObject } from './GameObject';
import { Time } from './Time';
import { RenderingEngine } from './RenderingEngine';
import { RenderableBackground } from './Interfaces/RenderableBackground';
import { KeyCode } from './Enums/KeyCode';
import { Terrain } from './Helpers/Terrain';
import { TerrainSpec } from './Interfaces/TerrainSpec';
import { TerrainBuilder } from './Helpers/TerrainBuilder';
import { Scene } from './Interfaces/Scene';
import { Input } from './Helpers/Input';
import { EventType } from './Enums/EventType';

export class GameEngine {

    private static _instance: GameEngine;

    private _physicsEngine: PhysicsEngine;
    private _renderingEngine: RenderingEngine;
    private loadedScene: Scene = null;
    private terrainObject: Terrain = null;
    private gameLoopId: number = null;
    private gameInitialized: boolean = false;
    private paused: boolean = false;
    private gameObjects: GameObject[] = [];
    private readonly gameObjectMap: Map<string, GameObject> = new Map<string, GameObject>();
    private readonly gameObjectNumMap: Map<string, number> = new Map<string, number>();
    private readonly tagMap: Map<string, GameObject[]> = new Map<string, GameObject[]>();
    private readonly scenes: Map<number | string, Scene> = new Map<number | string, Scene>();
    private readonly gameCanvas: HTMLCanvasElement;


    private constructor(gameCanvas: HTMLCanvasElement, physicsEngine: PhysicsEngine, renderingEngine: RenderingEngine) {
        this.gameCanvas = gameCanvas;
        this._physicsEngine = physicsEngine;
        this._renderingEngine = renderingEngine;

        Input.initialize(this.gameCanvas);
    }

    public static get instance(): GameEngine {
        if (this._instance === null || this._instance === undefined) {
            throw new Error('The instance has not been built yet. Call the buildGameEngine() function first.');
        }

        return this._instance;
    }

    public get terrain(): Terrain {
        return this.terrainObject;
    }

    public get physicsEngine(): PhysicsEngine {
        return this._physicsEngine;
    }

    public get renderingEngine(): RenderingEngine {
        return this._renderingEngine;
    }

    public static buildGameEngine(gameCanvas: HTMLCanvasElement): GameEngine {
        const physicsEngine = PhysicsEngine.buildPhysicsEngine(gameCanvas);
        const renderingEngine = new RenderingEngine(gameCanvas.getContext('2d'));
        
        this._instance = new GameEngine(gameCanvas, physicsEngine, renderingEngine);
        
        return this._instance;
    }

    public setScenes(scenes: Scene[]): void {
        for (const scene of scenes) {
            if (this.scenes.has(scene.loadOrder) || this.scenes.has(scene.name)) {
                console.error('Duplicate scene load orders or name detected ' + scene.loadOrder + ' ' + scene.name);
            }

            this.scenes.set(scene.loadOrder, scene);
            this.scenes.set(scene.name, scene);
        }
    }

    public async loadScene(loadOrderOrName: number | string): Promise<void> {
        if (!this.scenes.has(loadOrderOrName)) {
            throw new Error('Scene ' + loadOrderOrName + ' not found.');
        }

        this.endCurrentScene();

        const scene = this.scenes.get(loadOrderOrName);

        await this.initializeScene(scene.getStartingGameObjects(), scene.getSkybox(this.gameCanvas), scene.terrainSpec);

        Input.addKeyListener(EventType.KeyDown, KeyCode.One, async () => await this.loadScene(1));
        Input.addKeyListener(EventType.KeyDown, KeyCode.Two, async () => await this.loadScene(2));
        Input.addKeyListener(EventType.KeyDown, KeyCode.P, () => this.printGameData());
        Input.addKeyListener(EventType.KeyDown, KeyCode.UpArrow, async () => await this.gameCanvas.requestFullscreen());

        this.loadedScene = scene;
        this.startGame();
    }

    public instantiate(newGameObject: GameObject): GameObject {
        if (this.gameObjectMap.has(newGameObject.id)) {
            const originalId = newGameObject.id;
            newGameObject.id += ' Clone(' + this.gameObjectNumMap.get(originalId) + ')';
            this.gameObjectNumMap.set(originalId, this.gameObjectNumMap.get(originalId) + 1);
        }
        else {
            this.gameObjectNumMap.set(newGameObject.id, 1);
        }

        if (this.tagMap.has(newGameObject.tag)) {
            this.tagMap.get(newGameObject.tag).push(newGameObject);
        }
        else {
            this.tagMap.set(newGameObject.tag, [newGameObject]);
        }
        
        this.gameObjectMap.set(newGameObject.id, newGameObject);
        this.gameObjects.push(newGameObject);
        newGameObject.start();
        
        return newGameObject;
    }

    public findGameObjectById(id: string): GameObject {
        if (!this.gameObjectMap.has(id)) {
            return null;
        }

        return this.gameObjectMap.get(id);
    }

    public findGameObjectWithTag(tag: string): GameObject {
        if (!this.tagMap.has(tag)) {
            return null;
        }

        return this.tagMap.get(tag)[0];
    }

    public findGameObjectsWithTag(tag: string): GameObject[] {
        if (!this.tagMap.has(tag)) {
            return [];
        }

        return this.tagMap.get(tag);
    }

    public getGameCanvas(): HTMLCanvasElement {
        return this.gameCanvas;
    }

    public printGameData(): void {
        console.log(this);
        console.log('Time since game start ' + Time.TotalTime + 's');
        console.log(this._renderingEngine);
        console.log(this.physicsEngine);
        this.gameObjects.forEach(go => console.log(go));
    }

    public togglePause(): void {
        this.paused = !this.paused;
    }

    private setGameObjects(gameObjects: GameObject[]): void {
        this.gameObjects = gameObjects;

        for (const gameObject of gameObjects) {

            if (this.gameObjectMap.has(gameObject.id)) {
                const originalId = gameObject.id;
                gameObject.id += ' Clone(' + this.gameObjectNumMap.get(originalId) + ')';
                this.gameObjectNumMap.set(originalId, this.gameObjectNumMap.get(originalId) + 1);
            }
            else {
                this.gameObjectNumMap.set(gameObject.id, 1);
            }

            this.gameObjectMap.set(gameObject.id, gameObject);

            if (this.tagMap.has(gameObject.tag)) {
                this.tagMap.get(gameObject.tag).push(gameObject);
            }
            else {
                this.tagMap.set(gameObject.tag, [gameObject]);
            }
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

        Input.clearListeners();
        this.tagMap.clear();
        this.gameObjectMap.clear();
        this.gameObjectNumMap.clear();
        this.gameObjects.length = 0;
        this.loadedScene = null;
        this.terrainObject = null;
        this._physicsEngine = PhysicsEngine.buildPhysicsEngine(this.gameCanvas);
        this._renderingEngine = new RenderingEngine(this.gameCanvas.getContext('2d'));
        this._renderingEngine.renderGizmos = true;
    }

    private async initializeScene(gameObjects: GameObject[], skybox: RenderableBackground, terrainSpec: TerrainSpec = null): Promise<void> {
        this.setGameObjects(gameObjects);
        this._renderingEngine.background = skybox;

        if (terrainSpec !== null) {
            const terrianBuilder = new TerrainBuilder(this.gameCanvas.width, this.gameCanvas.height);
            const terrain = await terrianBuilder.buildTerrain(terrainSpec);
            this.terrainObject = terrain;
            this._renderingEngine.terrain = terrain;
        }

        this.gameInitialized = true;
    }

    private startGame(): void {

        if(!this.gameInitialized) {
            throw new Error('The game is not initialized yet!');
        }

        Time.start();
        this.paused = false;

        this.gameObjects.forEach(go => go.start());

        this.gameLoopId = requestAnimationFrame(() => this.gameLoop());
    }

    private update(): void {
        if (this.paused) {
            return;
        }

        Time.updateTime();
        this.physicsEngine.updatePhysics();
        
        for (const gameObject of this.gameObjects) {
            if (gameObject.enabled) {
                gameObject.update();
            }
        }

        this._renderingEngine.renderScene();
    }

    private gameLoop(): void {
        this.update();
        this.gameLoopId = requestAnimationFrame(() => this.gameLoop());
    }
}