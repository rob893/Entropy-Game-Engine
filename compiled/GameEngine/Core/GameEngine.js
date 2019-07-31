var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { PhysicsEngine } from "./PhysicsEngine";
import { Time } from "./Time";
import { RenderingEngine } from "./RenderingEngine";
import { Key } from "./Enums/Key";
import { TerrainBuilder } from "./Helpers/TerrainBuilder";
import { Vector2 } from "./Helpers/Vector2";
export class GameEngine {
    constructor(gameCanvas, physicsEngine, renderingEngine) {
        this.scenes = new Map();
        this.gameObjects = [];
        this.gameObjectMap = new Map();
        this.tagMap = new Map();
        this.gameObjectNumMap = new Map();
        this.gameInitialized = false;
        this.paused = false;
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
    static get instance() {
        if (this._instance === null || this._instance === undefined) {
            throw new Error('The instance has not been built yet. Call the buildGameEngine() function first.');
        }
        return this._instance;
    }
    get terrain() {
        return this.terrainObject;
    }
    static buildGameEngine(gameCanvas) {
        let physicsEngine = PhysicsEngine.buildPhysicsEngine(gameCanvas);
        let renderingEngine = RenderingEngine.buildRenderingEngine(gameCanvas.getContext('2d'));
        this._instance = new GameEngine(gameCanvas, physicsEngine, renderingEngine);
        return this._instance;
    }
    setScenes(scenes) {
        for (let scene of scenes) {
            if (this.scenes.has(scene.loadOrder) || this.scenes.has(scene.name)) {
                console.error('Duplicate scene load orders or name detected ' + scene.loadOrder + ' ' + scene.name);
            }
            this.scenes.set(scene.loadOrder, scene);
            this.scenes.set(scene.name, scene);
        }
    }
    loadScene(loadOrderOrName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.scenes.has(loadOrderOrName)) {
                throw new Error('Scene ' + loadOrderOrName + ' not found.');
            }
            const scene = this.scenes.get(loadOrderOrName);
            yield this.initializeScene(scene.getStartingGameObjects(), scene.getSkybox(this.gameCanvas), scene.terrainSpec);
            this.startGame();
        });
    }
    initializeScene(gameObjects, skybox, terrainSpec = null) {
        return __awaiter(this, void 0, void 0, function* () {
            this.setGameObjects(gameObjects);
            this.renderingEngine.background = skybox;
            if (terrainSpec !== null) {
                const terrianBuilder = new TerrainBuilder(this.gameCanvas.width, this.gameCanvas.height);
                const terrain = yield terrianBuilder.buildTerrain(terrainSpec);
                this.terrainObject = terrain;
                this.renderingEngine.terrain = terrain;
            }
            this.gameInitialized = true;
        });
    }
    startGame() {
        if (!this.gameInitialized) {
            throw new Error("The game is not initialized yet!");
        }
        Time.start();
        this.paused = false;
        this.gameObjects.forEach(go => go.start());
        requestAnimationFrame(() => this.gameLoop());
    }
    instantiate(newGameObject) {
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
    getCursorPosition(event) {
        const rect = this.gameCanvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        return new Vector2(x, y);
    }
    getGameObjectById(id) {
        if (!this.gameObjectMap.has(id)) {
            throw new Error("No GameObject with id of " + id + " exists!");
        }
        return this.gameObjectMap.get(id);
    }
    getGameObjectWithTag(tag) {
        if (!this.tagMap.has(tag)) {
            throw new Error("No GameObject with tag of " + tag + " exists!");
        }
        return this.tagMap.get(tag)[0];
    }
    getGameObjectsWithTag(tag) {
        if (!this.tagMap.has(tag)) {
            throw new Error("No GameObject with tag of " + tag + " exists!");
        }
        return this.tagMap.get(tag);
    }
    getGameCanvas() {
        return this.gameCanvas;
    }
    printGameData() {
        console.log(this);
        console.log("Time since game start " + Time.TotalTime + "s");
        console.log(this.renderingEngine);
        console.log(this.physicsEngine);
        this.gameObjects.forEach(go => console.log(go));
    }
    togglePause() {
        this.paused = !this.paused;
    }
    setGameObjects(gameObjects) {
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
    update() {
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
    gameLoop() {
        this.update();
        requestAnimationFrame(() => this.gameLoop());
    }
}
//# sourceMappingURL=GameEngine.js.map