import { Physics } from "./Physics";
import { GameObject } from "./GameObject";
import { Time } from "./Time";
import { IBackground } from "./Interfaces/IBackground";

export class GameEngine {

    private static instance: GameEngine;

    private gameCanvas: HTMLCanvasElement;
    private canvasContext: CanvasRenderingContext2D;
    private background: IBackground;
    private physicsEngine: Physics;
    private gameObjects: GameObject[] = [];
    private gameObjectMap: Map<string, GameObject> = new Map<string, GameObject>();
    private gameInitialized: boolean = false;
    private paused: boolean = false;


    private constructor() {
        this.gameInitialized = false;
        this.physicsEngine = Physics.Instance;
    }

    public static get Instance(): GameEngine {
        return this.instance || (this.instance = new GameEngine());
    }

    public initializeGame(gameCanvas: HTMLCanvasElement, gameObjects: GameObject[], background: IBackground): void {
        this.background = background;
        this.setGameCanvas(gameCanvas);
        this.setGameObjects(gameObjects);
         
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

    public getGameCanvasContext(): CanvasRenderingContext2D {
        return this.canvasContext;
    }

    public printGameData(): void {
        console.log(this);
        console.log("Time since game start " + Time.TotalTime + "s");

        for(let i: number = 0; i < this.gameObjects.length; i++) {
            console.log(this.gameObjects[i]);
        }
    }

    public togglePause(): void {
        this.paused = !this.paused;
    }

    private setGameCanvas(gameCanvas: HTMLCanvasElement): void {
        this.gameCanvas = gameCanvas;
        this.canvasContext = this.gameCanvas.getContext("2d");
    }

    private setGameObjects(gameObjects: GameObject[]): void {
        this.gameObjects = gameObjects;

        for (let gameObject of gameObjects) {

            if (this.gameObjectMap.has(gameObject.id)) {
                throw new Error("Duplicate game object of " + gameObject.id + "!");
            }

            this.gameObjectMap.set(gameObject.id, gameObject);
        }
    }

    private update(): void {
        Time.updateTime();
        this.physicsEngine.updatePhysics();
        
        for(let i: number = 0; i < this.gameObjects.length; i++){
            this.gameObjects[i].update();
        }
    }

    private renderBackground(): void {
        this.background.render();
    }

    private gameLoop(): void {
        if(!this.paused) {
            this.renderBackground();
            this.update();
        }
       
        requestAnimationFrame(() => this.gameLoop());
    }
}