import { PhysicsEngine } from './PhysicsEngine';
import { GameObject } from './GameObject';
import { Time } from './Time';
import { RenderingEngine } from './RenderingEngine';
import { TerrainBuilder } from './Helpers/TerrainBuilder';
import { Scene } from './Interfaces/Scene';
import { Input } from './Helpers/Input';
import { ComponentAnalyzer } from './Helpers/ComponentAnalyzer';
import { SceneManager } from './Helpers/SceneManager';
import { Layer } from './Enums/Layer';
import { SpatialHashCollisionDetector } from './Physics/SpatialHashCollisionDetector';
import { ImpulseCollisionResolver } from './Physics/ImpulseCollisionResolver';
import { Physics } from './Physics/Physics';
import { Vector2 } from './Helpers/Vector2';
import { Transform } from '../Components/Transform';
import { AssetPool } from './Helpers/AssetPool';
import { Terrain } from './Helpers/Terrain';

export class GameEngine {

    public developmentMode: boolean = true;
    
    private _physicsEngine: PhysicsEngine | null = null;
    private _renderingEngine: RenderingEngine | null = null;
    private loadedScene: Scene | null = null;
    private gameLoopId: number | null = null;
    private gameInitialized: boolean = false;
    private paused: boolean = false;
    private gameObjects: GameObject[] = [];
    private _input: Input | null = null;
    private _physics: Physics | null = null;
    private _assetPool: AssetPool | null = null;
    private _time: Time | null = null;
    private _sceneManager: SceneManager | null = null;
    private _terrain: Terrain | null = null;
    private _componentAnalyzer: ComponentAnalyzer | null = null;
    private readonly gameObjectMap: Map<string, GameObject> = new Map<string, GameObject>();
    private readonly gameObjectNumMap: Map<string, number> = new Map<string, number>();
    private readonly tagMap: Map<string, GameObject[]> = new Map<string, GameObject[]>();
    private readonly scenes: Map<number | string, Scene> = new Map<number | string, Scene>();
    private readonly _gameCanvas: HTMLCanvasElement;
    private readonly invokeTimeouts: Set<number> = new Set<number>();
    private readonly gameObjectsMarkedForDelete: GameObject[] = [];


    public constructor(gameCanvas: HTMLCanvasElement) {
        this._gameCanvas = gameCanvas;
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

    public instantiate<T extends GameObject>(type: new (gameEngine: GameEngine) => T, position?: Vector2, rotation?: number, parent?: Transform): GameObject {
        const newGameObject = new type(this);

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
        }
        else {
            this.invoke(() => {
                this.gameObjectsMarkedForDelete.push(object);
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

    public invokeRepeating(funcToInvoke: () => void, repeatRate: number): void {
        this.invoke(() => {
            funcToInvoke();

            this.invokeRepeating(funcToInvoke, repeatRate);
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

        return gameObjects;
    }

    public printGameData(): void {
        console.log(this);
        console.log('Time since game start ' + this.time.totalTime + 's');
        console.log(this.renderingEngine);
        console.log(this.physicsEngine);
        this.gameObjects.forEach(go => console.log(go));
    }

    public togglePause(): void {
        this.paused = !this.paused;
    }

    public setScenes(scenes: Scene[]): void {
        for (const scene of scenes) {
            if (this.scenes.has(scene.loadOrder) || this.scenes.has(scene.name)) {
                console.error(`Duplicate scene load orders or name detected ${scene.loadOrder} ${scene.name}`);
            }

            this.scenes.set(scene.loadOrder, scene);
            this.scenes.set(scene.name, scene);
        }
    }

    public async loadScene(loadOrderOrName: number | string): Promise<void> {
        const scene = this.scenes.get(loadOrderOrName);
        
        if (scene === undefined) {
            throw new Error(`Scene ${loadOrderOrName} not found.`);
        }

        this.endCurrentScene();

        this.createEnginesAndAPIs();

        await this.initializeScene(scene);

        this.loadedScene = scene;
        this.startGame();
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

        const index = this.gameObjects.indexOf(object);

        if (index !== -1) {
            this.gameObjects.splice(index, 1);
        }

        const gameObjectsWithTag = this.tagMap.get(object.tag);

        if (gameObjectsWithTag !== undefined) {
            const tagIndex = gameObjectsWithTag.indexOf(object);

            if (tagIndex !== -1) {
                gameObjectsWithTag.splice(tagIndex, 1);
            }
        }
        
        //TODO: This still has a bug. Sometimes object ids are still not working correctly when creating and destroying objects (the old bug that used to console errors).
        //For some reason, the id is being set here before being called a 'clone'.
        const numGameObjects = this.gameObjectNumMap.get(object.id);
        if (numGameObjects !== undefined) {
            numGameObjects > 1 ? this.gameObjectNumMap.set(object.id, numGameObjects - 1) : this.gameObjectNumMap.delete(object.id);
        }

        object.onDestroy();
    }

    private registerGameObject(newGameObject: GameObject): void {
        if (newGameObject.id === '') {
            newGameObject.id = this.generateUniqueId();
        }
        
        if (this.gameObjectMap.has(newGameObject.id)) {
            const originalId = newGameObject.id;
            const numOfSameGameObject = this.gameObjectNumMap.get(originalId);

            if (numOfSameGameObject === undefined) {
                throw new Error('Error in regitering the new game object');
            }

            newGameObject.id += ` Clone(${numOfSameGameObject})`;
            this.gameObjectNumMap.set(originalId, numOfSameGameObject + 1);
        }
        else {
            this.gameObjectNumMap.set(newGameObject.id, 1);
        }

        const gameObjectsWithTag = this.tagMap.get(newGameObject.tag);
        if (gameObjectsWithTag !== undefined) {
            gameObjectsWithTag.push(newGameObject);
        }
        else {
            this.tagMap.set(newGameObject.tag, [newGameObject]);
        }
        
        this.gameObjectMap.set(newGameObject.id, newGameObject);
        this.gameObjects.push(newGameObject);
        newGameObject.start();

        for (const child of newGameObject.transform.children) {
            this.registerGameObject(child.gameObject);
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

        this.input.clearListeners();
        this.tagMap.clear();
        this.gameObjectMap.clear();
        this.gameObjectNumMap.clear();
        this.gameObjects.length = 0;
        this.gameObjectsMarkedForDelete.length = 0;
        
        this.loadedScene = null;
        this._assetPool = null;
        this._componentAnalyzer = null;
        this._input = null;
        this._physics = null;
        this._sceneManager = null;
        this._terrain = null;
        this._time = null;
    }

    private async initializeScene(scene: Scene): Promise<void> {

        const assetPoolPromise = scene.getAssetPool();
        const terrainSpec = scene.terrainSpec;
        let gameObjects: GameObject[] = [];

        if (terrainSpec !== null) {
            const terrianBuilder = new TerrainBuilder(this._gameCanvas.width, this._gameCanvas.height);
            const terrain = await terrianBuilder.buildTerrain(this, terrainSpec);
            
            gameObjects.push(terrain);

            this.renderingEngine.terrain = terrain;
            this._terrain = terrain;
        }

        this._assetPool = await assetPoolPromise;

        gameObjects = [...gameObjects, ...scene.getStartingGameObjects(this)];

        this.setGameObjects(gameObjects);
        this.renderingEngine.background = scene.getSkybox(this._gameCanvas);

        this.gameInitialized = true;
    }

    private createEnginesAndAPIs(): void {
        const time = new Time();
        
        const layerCollisionMatrix = new Map<Layer, Set<Layer>>();

        const layers = Object.keys(Layer).filter(c => typeof Layer[c as any] === 'number').map(k => Number(Layer[k as any]));
        
        for (const layer of layers) {
            layerCollisionMatrix.set(layer, new Set(layers));
        }

        const collidingLayers = layerCollisionMatrix.get(Layer.Terrain);

        if (collidingLayers === undefined) {
            throw new Error('Error with layers');
        }

        collidingLayers.delete(Layer.Terrain);

        const collisionDetector = new SpatialHashCollisionDetector(this._gameCanvas.width, this._gameCanvas.height, layerCollisionMatrix, 100);
        const collisionResolver = new ImpulseCollisionResolver();

        this._physicsEngine = new PhysicsEngine(collisionDetector, collisionResolver, time);

        this._renderingEngine = new RenderingEngine(this.canvasContext);
        this.renderingEngine.renderGizmos = this.developmentMode;

        this._input = new Input(this._gameCanvas);
        this._componentAnalyzer = new ComponentAnalyzer(this.physicsEngine, this.renderingEngine);
        this._sceneManager = new SceneManager(this);
        this._time = time;
        this._physics = new Physics(this.physicsEngine);
    }

    private setGameObjects(gameObjects: GameObject[]): void {
        this.gameObjects = [...gameObjects];

        for (const gameObject of this.gameObjects) {

            if (this.gameObjectMap.has(gameObject.id)) {
                const originalId = gameObject.id;
                const numGameObjects = this.gameObjectNumMap.get(originalId);

                if (numGameObjects === undefined) {
                    throw new Error('Error setting up initial game objects.');
                }

                gameObject.id += ` Clone(${numGameObjects})`;
                this.gameObjectNumMap.set(originalId, numGameObjects + 1);
            }
            else {
                this.gameObjectNumMap.set(gameObject.id, 1);
            }

            this.gameObjectMap.set(gameObject.id, gameObject);

            const gameObjectsWithTag = this.tagMap.get(gameObject.tag);
            if (gameObjectsWithTag !== undefined) {
                gameObjectsWithTag.push(gameObject);
            }
            else {
                this.tagMap.set(gameObject.tag, [gameObject]);
            }

            //Initialize children of gameObject
            const children = gameObject.transform.children;

            while (children.length > 0) {
                const child = children.pop();

                if (child === undefined) {
                    throw new Error('Error getting child');
                }

                this.gameObjects.push(child.gameObject);

                for (const childsChild of child.children) {
                    children.push(childsChild);
                }
            }
        }
    }

    private generateUniqueId(): string {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    private startGame(): void {

        if(!this.gameInitialized) {
            throw new Error('The game is not initialized yet!');
        }

        this.time.start();
        this.paused = false;

        this.gameObjects.forEach(go => {
            go.start();
            const children = go.transform.children;

            while (children.length > 0) {
                const child = children.pop();

                if (child === undefined) {
                    throw new Error('Error getting child');
                }

                child.gameObject.start();

                for (const childsChild of child.children) {
                    children.push(childsChild);
                }
            }
        });

        this.gameLoopId = requestAnimationFrame(() => this.gameLoop());
    }

    private update(): void {
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

        this.time.updateTime();
        this.physicsEngine.updatePhysics();
        
        for (const gameObject of this.gameObjects) {
            if (gameObject.enabled) {
                gameObject.update();
            }
        }

        this.renderingEngine.renderScene();
    }

    private gameLoop(): void {
        this.update();
        this.gameLoopId = requestAnimationFrame(() => this.gameLoop());
    }
}