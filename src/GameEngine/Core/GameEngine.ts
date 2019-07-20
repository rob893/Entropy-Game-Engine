import { PhysicsEngine } from "./PhysicsEngine";
import { GameObject } from "./GameObject";
import { Time } from "./Time";
import { RenderingEngine } from "./RenderingEngine";
import { IRenderableBackground } from "./Interfaces/IRenderableBackground";
import { Key } from "./Enums/Key";

export class GameEngine {

    private static _instance: GameEngine;

    private gameCanvas: HTMLCanvasElement;
    private physicsEngine: PhysicsEngine;
    private renderingEngine: RenderingEngine;
    private gameObjects: GameObject[] = [];
    private gameObjectMap: Map<string, GameObject> = new Map<string, GameObject>();
    private tagMap: Map<string, GameObject[]> = new Map<string, GameObject[]>();
    private gameObjectNumMap: Map<string, number> = new Map<string, number>();
    private gameInitialized: boolean = false;
    private paused: boolean = false;


    private constructor(gameCanvas: HTMLCanvasElement, physicsEngine: PhysicsEngine, renderingEngine: RenderingEngine) {
        this.gameInitialized = false;
        this.gameCanvas = gameCanvas;
        this.physicsEngine = physicsEngine;
        this.renderingEngine = renderingEngine;

        document.addEventListener('keydown', (event) => {
            if (event.keyCode === Key.UpArrow) {
                this.gameCanvas.requestFullscreen();
            }
        });
    }

    public static get instance(): GameEngine {
        if (this._instance === null || this._instance === undefined) {
            throw new Error('The instance has not been built yet. Call the buildGameEngine() function first.');
        }

        return this._instance;
    }

    public static buildGameEngine(gameCanvas: HTMLCanvasElement): GameEngine {
        let physicsEngine = PhysicsEngine.buildPhysicsEngine(gameCanvas);
        let renderingEngine = RenderingEngine.buildRenderingEngine(gameCanvas.getContext('2d'));
        
        this._instance = new GameEngine(gameCanvas, physicsEngine, renderingEngine);
        
        return this._instance;
    }

    public initializeGame(gameObjects: GameObject[], background: IRenderableBackground): void {
        this.setGameObjects(gameObjects);
        this.renderingEngine.background = background;
        this.gameInitialized = true;
    }

    public startGame(): void {

        if(!this.gameInitialized) {
            throw new Error("The game is not initialized yet!");
        }

        Time.start();
        this.paused = false;

        this.gameObjects.forEach(go => go.start());

        requestAnimationFrame(() => this.gameLoop());
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
        console.log(this.renderingEngine);
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

        this.renderingEngine.renderScene();
    }

    private gameLoop(): void { 
        this.update();
        requestAnimationFrame(() => this.gameLoop());
    }
}