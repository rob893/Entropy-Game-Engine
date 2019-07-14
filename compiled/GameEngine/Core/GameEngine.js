import { Physics } from "./Physics";
import { Time } from "./Time";
export class GameEngine {
    constructor() {
        this.gameObjects = [];
        this.gameObjectMap = new Map();
        this.gameInitialized = false;
        this.paused = false;
        this.gameInitialized = false;
        this.physicsEngine = Physics.Instance;
    }
    static get Instance() {
        return this.instance || (this.instance = new GameEngine());
    }
    initializeGame(gameCanvas, gameObjects, background) {
        this.background = background;
        this.setGameCanvas(gameCanvas);
        this.setGameObjects(gameObjects);
        this.gameInitialized = true;
    }
    startGame() {
        if (!this.gameInitialized) {
            throw new Error("The game is not initialized yet!");
        }
        Time.start();
        this.paused = false;
        for (let i = 0; i < this.gameObjects.length; i++) {
            this.gameObjects[i].start();
        }
        requestAnimationFrame(() => this.gameLoop());
    }
    instantiate(newGameObject) {
        this.gameObjects.push(newGameObject);
        newGameObject.start();
        return newGameObject;
    }
    getGameObjectById(id) {
        if (!this.gameObjectMap.has(id)) {
            throw new Error("No GameObject with id of " + id + " exists!");
        }
        return this.gameObjectMap.get(id);
    }
    getGameCanvas() {
        return this.gameCanvas;
    }
    getGameCanvasContext() {
        return this.canvasContext;
    }
    printGameData() {
        console.log(this);
        console.log("Time since game start " + Time.TotalTime + "s");
        for (let i = 0; i < this.gameObjects.length; i++) {
            console.log(this.gameObjects[i]);
        }
    }
    togglePause() {
        this.paused = !this.paused;
    }
    setGameCanvas(gameCanvas) {
        this.gameCanvas = gameCanvas;
        this.canvasContext = this.gameCanvas.getContext("2d");
    }
    setGameObjects(gameObjects) {
        this.gameObjects = gameObjects;
        for (let gameObject of gameObjects) {
            if (this.gameObjectMap.has(gameObject.id)) {
                throw new Error("Duplicate game object of " + gameObject.id + "!");
            }
            this.gameObjectMap.set(gameObject.id, gameObject);
        }
    }
    update() {
        Time.updateTime();
        this.physicsEngine.updatePhysics();
        for (let i = 0; i < this.gameObjects.length; i++) {
            this.gameObjects[i].update();
        }
    }
    renderBackground() {
        this.background.render();
    }
    gameLoop() {
        if (!this.paused) {
            this.renderBackground();
            this.update();
        }
        requestAnimationFrame(() => this.gameLoop());
    }
}
//# sourceMappingURL=GameEngine.js.map