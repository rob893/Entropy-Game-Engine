import { PhysicsEngine } from './PhysicsEngine';
import { GameObject } from './GameObject';
import { Time } from './Time';
import { RenderingEngine } from './RenderingEngine';
import { Terrain } from './Helpers/Terrain';
import { TerrainBuilder } from './Helpers/TerrainBuilder';
import { Scene } from './Interfaces/Scene';
import { Input } from './Helpers/Input';
import { ObjectManager } from './Helpers/ObjectManager';
import { APIs } from './Interfaces/APIs';
import { ComponentAnalyzer } from './Helpers/ComponentAnalyzer';

export class GameEngine {

    private physicsEngine: PhysicsEngine;
    private renderingEngine: RenderingEngine;
    private loadedScene: Scene = null;
    private gameLoopId: number = null;
    private gameInitialized: boolean = false;
    private paused: boolean = false;
    private gameObjects: GameObject[] = [];
    private apis: APIs;
    private readonly gameObjectMap: Map<string, GameObject> = new Map<string, GameObject>();
    private readonly gameObjectNumMap: Map<string, number> = new Map<string, number>();
    private readonly tagMap: Map<string, GameObject[]> = new Map<string, GameObject[]>();
    private readonly scenes: Map<number | string, Scene> = new Map<number | string, Scene>();
    private readonly gameCanvas: HTMLCanvasElement;


    private constructor(gameCanvas: HTMLCanvasElement, physicsEngine: PhysicsEngine, renderingEngine: RenderingEngine) {
        this.gameCanvas = gameCanvas;
        this.physicsEngine = physicsEngine;
        this.renderingEngine = renderingEngine;
        this.renderingEngine.renderGizmos = true;
    }

    public static buildGameEngine(gameCanvas: HTMLCanvasElement): GameEngine {
        const physicsEngine = PhysicsEngine.buildPhysicsEngine(gameCanvas);
        const renderingEngine = new RenderingEngine(gameCanvas.getContext('2d'));
        
        return new GameEngine(gameCanvas, physicsEngine, renderingEngine);
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

        this.createEnginesAndAPIs();

        const scene = this.scenes.get(loadOrderOrName);

        await this.initializeScene(scene);

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

        for (const child of newGameObject.transform.children) {
            this.instantiate(child.gameObject);
        }
        
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

    public printGameData(): void {
        console.log(this);
        console.log('Time since game start ' + Time.TotalTime + 's');
        console.log(this.renderingEngine);
        console.log(this.physicsEngine);
        this.gameObjects.forEach(go => console.log(go));
    }

    public togglePause(): void {
        this.paused = !this.paused;
    }

    private setGameObjects(gameObjects: GameObject[]): void {
        this.gameObjects = [...gameObjects];

        for (const gameObject of this.gameObjects) {

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

            //Initialize children of gameObject
            const children = gameObject.transform.children;

            while (children.length > 0) {
                const child = children.pop();

                this.gameObjects.push(child.gameObject);

                for (const childsChild of child.children) {
                    children.push(childsChild);
                }
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

        this.apis.input.clearListeners();
        this.tagMap.clear();
        this.gameObjectMap.clear();
        this.gameObjectNumMap.clear();
        this.gameObjects.length = 0;
        this.loadedScene = null;
    }

    private async initializeScene(scene: Scene): Promise<void> {
        if (this.apis === undefined || this.apis === null) {
            throw new Error('There was an error initializing the scene. The APIs object must be created before initialization.');
        }

        const terrainSpec = scene.terrainSpec;
        let gameObjects: GameObject[] = [];

        if (terrainSpec !== null) {
            const terrianBuilder = new TerrainBuilder(this.gameCanvas.width, this.gameCanvas.height);
            const terrain = await terrianBuilder.buildTerrain(this.apis, terrainSpec);
            
            gameObjects.push(terrain);

            this.renderingEngine.terrain = terrain;
            this.apis.terrain = terrain;
        }

        gameObjects = [...gameObjects, ...scene.getStartingGameObjects(this.apis)];

        this.setGameObjects(gameObjects);
        this.renderingEngine.background = scene.getSkybox(this.gameCanvas);

        this.gameInitialized = true;
    }

    private createEnginesAndAPIs(): void {
        this.physicsEngine = PhysicsEngine.buildPhysicsEngine(this.gameCanvas);

        const renderGizmos = this.renderingEngine.renderGizmos;

        this.renderingEngine = new RenderingEngine(this.gameCanvas.getContext('2d'));
        this.renderingEngine.renderGizmos = renderGizmos;
        
        this.apis = {
            input: new Input(this.gameCanvas),
            objectManager: new ObjectManager(this),
            terrain: null,
            componentAnalyzer: new ComponentAnalyzer(this.physicsEngine, this.renderingEngine),
            gameCanvas: this.gameCanvas
        };
    }

    private startGame(): void {

        if(!this.gameInitialized) {
            throw new Error('The game is not initialized yet!');
        }

        Time.start();
        this.paused = false;

        this.gameObjects.forEach(go => {
            go.start();
            const children = go.transform.children;

            while (children.length > 0) {
                const child = children.pop();
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

        Time.updateTime();
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