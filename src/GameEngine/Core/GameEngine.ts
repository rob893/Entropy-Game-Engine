import { Physics } from "./Physics";
import { GameObject } from "./GameObject";
import { Time } from "./Time";
import { RenderingEngine } from "./RenderingEngine";
import { IRenderableBackground } from "./Interfaces/IRenderableBackground";

export class GameEngine {

    private static _instance: GameEngine;

    private gameCanvas: HTMLCanvasElement;
    private physicsEngine: Physics;
    private renderingEngine: RenderingEngine;
    private gameObjects: GameObject[] = [];
    private gameObjectMap: Map<string, GameObject> = new Map<string, GameObject>();
    private gameObjectNumMap: Map<string, number> = new Map<string, number>();
    private gameInitialized: boolean = false;
    private paused: boolean = false;


    private constructor() {
        this.gameInitialized = false;
        this.physicsEngine = Physics.instance;
        this.renderingEngine = RenderingEngine.instance;
    }

    public static get instance(): GameEngine {
        return this._instance || (this._instance = new GameEngine());
    }

    public initializeGame(gameCanvas: HTMLCanvasElement, gameObjects: GameObject[], background: IRenderableBackground): void {
        this.gameCanvas = gameCanvas;
        this.setGameObjects(gameObjects);
        this.renderingEngine.background = background;
        this.renderingEngine.canvasContext = gameCanvas.getContext('2d');
         
        this.gameInitialized = true;
    }

    public startGame(): void {

        if(!this.gameInitialized) {
            throw new Error("The game is not initialized yet!");
        }

        Time.start();
        this.paused = false;

        for(let i: number = 0; i < this.gameObjects.length; i++) {
            this.gameObjects[i].start();
        }

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
        }
    }

    private update(): void {
        if (this.paused) {
            return;
        }

        Time.updateTime();
        //this.physicsEngine.updatePhysics();
        
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