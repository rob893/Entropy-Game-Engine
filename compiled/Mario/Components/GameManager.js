import { Component } from "../../GameEngine/Components/Component";
import { GameEngine } from "../../GameEngine/Core/GameEngine";
import { Ball } from "../GameObjects/Ball";
import { AudioSource } from "../../GameEngine/Components/AudioSource";
export class GameManager extends Component {
    constructor(gameObject) {
        super(gameObject);
        document.getElementById("print-button").addEventListener("click", () => this.printGameData());
        document.getElementById("pause-button").addEventListener("click", () => this.togglePause());
        document.getElementById("add-ball").addEventListener("click", () => this.testInstantiate());
        document.getElementById("toggle-music").addEventListener("click", () => this.toggleMusic());
    }
    start() {
        this.player = GameEngine.instance.getGameObjectById("player");
        this.audioSource = this.gameObject.getComponent(AudioSource);
        this.audioSource.loop = true;
    }
    static get instance() {
        if (this._instance === null || this._instance === undefined) {
            throw new Error("GameManager has not been created yet. Use the createinstance method first.");
        }
        return this._instance;
    }
    static createinstance(gameObject) {
        if (this._instance === null || this._instance === undefined) {
            this._instance = new GameManager(gameObject);
            return this.instance;
        }
        throw new Error("More than one GameManager cannot be created!");
    }
    toggleMusic() {
        if (this.audioSource.isPlaying) {
            this.audioSource.pause();
        }
        else {
            this.audioSource.play();
        }
    }
    togglePause() {
        GameEngine.instance.togglePause();
    }
    printGameData() {
        GameEngine.instance.printGameData();
    }
    testInstantiate() {
        GameEngine.instance.instantiate(new Ball("ball2"));
    }
}
//# sourceMappingURL=GameManager.js.map