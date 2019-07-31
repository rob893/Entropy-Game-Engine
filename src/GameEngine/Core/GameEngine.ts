import { PhysicsEngine } from "./PhysicsEngine";
import { GameObject } from "./GameObject";
import { Time } from "./Time";
import { RenderingEngine } from "./RenderingEngine";
import { IRenderableBackground } from "./Interfaces/IRenderableBackground";
import { Key } from "./Enums/Key";
import { Terrain } from "./Helpers/Terrain";
import { ITerrainSpec } from "./Interfaces/ITerrainSpec";
import { TerrainBuilder } from "./Helpers/TerrainBuilder";
import { Vector2 } from "./Helpers/Vector2";
import { IScene } from "./Interfaces/IScene";

export class GameEngine {

    private static _instance: GameEngine;

    private gameCanvas: HTMLCanvasElement;
    private _physicsEngine: PhysicsEngine;
    private _renderingEngine: RenderingEngine;
    private scenes: Map<number | string, IScene> = new Map<number | string, IScene>();
    private loadedScene: IScene = null;
    private terrainObject: Terrain = null;
    private gameObjects: GameObject[] = [];
    private gameObjectMap: Map<string, GameObject> = new Map<string, GameObject>();
    private tagMap: Map<string, GameObject[]> = new Map<string, GameObject[]>();
    private gameObjectNumMap: Map<string, number> = new Map<string, number>();
    private gameInitialized: boolean = false;
    private gameLoopId: number = null;
    private paused: boolean = false;


    private constructor(gameCanvas: HTMLCanvasElement, physicsEngine: PhysicsEngine, renderingEngine: RenderingEngine) {
        this.gameCanvas = gameCanvas;
        this._physicsEngine = physicsEngine;
        this._renderingEngine = renderingEngine;

        document.addEventListener('keydown', (event) => {
            if (event.keyCode === Key.UpArrow) {
                this.gameCanvas.requestFullscreen();
            }
            else if (event.keyCode === Key.Two && this.loadedScene.loadOrder !== 2) {
                this.loadScene(2);
            }
            else if (event.keyCode === Key.One && this.loadedScene.loadOrder !== 1) {
                this.loadScene(1);
            }
            else if (event.keyCode === Key.P) {
                this.printGameData();
            }
        });
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

    public setScenes(scenes: IScene[]): void {
        for (let scene of scenes) {
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

        this.loadedScene = scene;
        this.startGame();
    }

    private async initializeScene(gameObjects: GameObject[], skybox: IRenderableBackground, terrainSpec: ITerrainSpec = null): Promise<void> {
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
            throw new Error("The game is not initialized yet!");
        }

        Time.start();
        this.paused = false;

        this.gameObjects.forEach(go => go.start());

        this.gameLoopId = requestAnimationFrame(() => this.gameLoop());
    }

    public instantiate(newGameObject: GameObject): GameObject {
        if (this.gameObjectMap.has(newGameObject.id)) {
            let originalId = newGameObject.id;
            newGameObject.id += " Clone(" + this.gameObjectNumMap.get(originalId) + ")";
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

    public getCursorPosition(event: MouseEvent): Vector2 {
        const rect = this.gameCanvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        return new Vector2(x, y);
    }

    public getGameObjectById(id: string): GameObject {
        if (!this.gameObjectMap.has(id)) {
            throw new Error("No GameObject with id of " + id + " exists!");
        }

        return this.gameObjectMap.get(id);
    }

    public getGameObjectWithTag(tag: string): GameObject {
        if (!this.tagMap.has(tag)) {
            throw new Error("No GameObject with tag of " + tag + " exists!");
        }

        return this.tagMap.get(tag)[0];
    }

    public getGameObjectsWithTag(tag: string): GameObject[] {
        if (!this.tagMap.has(tag)) {
            throw new Error("No GameObject with tag of " + tag + " exists!");
        }

        return this.tagMap.get(tag);
    }

    public getGameCanvas(): HTMLCanvasElement {
        return this.gameCanvas;
    }

    public printGameData(): void {
        console.log(this);
        console.log("Time since game start " + Time.TotalTime + "s");
        console.log(this._renderingEngine);
        console.log(this.physicsEngine);
        this.gameObjects.forEach(go => console.log(go));
    }

    public togglePause(): void {
        this.paused = !this.paused;
    }

    private setGameObjects(gameObjects: GameObject[]): void {
        this.gameObjects = gameObjects;

        for (let gameObject of gameObjects) {

            if (this.gameObjectMap.has(gameObject.id)) {
                let originalId = gameObject.id;
                gameObject.id += " Clone(" + this.gameObjectNumMap.get(originalId) + ")";
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

        this.tagMap.clear();
        this.gameObjectMap.clear();
        this.gameObjectNumMap.clear();
        this.gameObjects.length = 0;
        this.loadedScene = null;
        this._physicsEngine = PhysicsEngine.buildPhysicsEngine(this.gameCanvas);
        this._renderingEngine = new RenderingEngine(this.gameCanvas.getContext('2d'));
    }

    private update(): void {
        if (this.paused) {
            return;
        }

        Time.updateTime();
        this.physicsEngine.updatePhysics();
        
        for (let gameObject of this.gameObjects) {
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