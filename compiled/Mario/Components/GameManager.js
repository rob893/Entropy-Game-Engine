import { Component } from "../../GameEngine/Components/Component";
import { GameEngine } from "../../GameEngine/Core/GameEngine";
import { Ball } from "../GameObjects/Ball";
export class GameManager extends Component {
    constructor(gameObject) {
        super(gameObject);
        document.getElementById("print-button").addEventListener("click", () => this.printGameData());
        document.getElementById("pause-button").addEventListener("click", () => this.togglePause());
        document.getElementById("add-ball").addEventListener("click", () => this.testInstantiate());
    }
    start() {
        this.player = GameEngine.Instance.getGameObjectById("player");
    }
    static get Instance() {
        if (this.instance === null || this.instance === undefined) {
            throw new Error("GameManager has not been created yet. Use the createInstance method first.");
        }
        return this.instance;
    }
    static createInstance(gameObject) {
        if (this.instance === null || this.instance === undefined) {
            this.instance = new GameManager(gameObject);
            return this.instance;
        }
        throw new Error("More than one GameManager cannot be created!");
    }
    togglePause() {
        GameEngine.Instance.togglePause();
    }
    printGameData() {
        GameEngine.Instance.printGameData();
    }
    testInstantiate() {
        GameEngine.Instance.instantiate(new Ball("ball2"));
    }
}
//# sourceMappingURL=GameManager.js.map