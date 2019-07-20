import { Component } from "../../GameEngine/Components/Component";
import { GameEngine } from "../../GameEngine/Core/GameEngine";
import { Ball } from "../GameObjects/Ball";
import { AudioSource } from "../../GameEngine/Components/AudioSource";
import { RenderingEngine } from "../../GameEngine/Core/RenderingEngine";
import { Time } from "../../GameEngine/Core/Time";
export class GameManager extends Component {
    constructor(gameObject) {
        super(gameObject);
        this.sceneMessage = '';
        this.messageColor = '';
        this.messageTimer = 0;
        this.messageLength = 0;
        this.gameOver = false;
        document.getElementById("print-button").addEventListener("click", () => this.printGameData());
        document.getElementById("pause-button").addEventListener("click", () => this.togglePause());
        document.getElementById("add-ball").addEventListener("click", () => this.testInstantiate());
        document.getElementById("toggle-music").addEventListener("click", () => this.toggleMusic());
    }
    start() {
        RenderingEngine.instance.addRenderableGUIElement(this);
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
    endGame() {
        this.togglePause();
        this.gameOver = true;
    }
    showMessage(message, lengthInSeconds, color) {
        this.sceneMessage = message;
        this.messageLength = lengthInSeconds;
        this.messageColor = color;
    }
    renderGUI(context) {
        this.renderGameOver(context);
        this.renderMessage(context);
    }
    renderGameOver(context) {
        if (this.gameOver) {
            context.fillText("Game Over! YOU SUCK", 50, 50);
        }
    }
    renderMessage(context) {
        if (this.sceneMessage !== '') {
            this.messageTimer += Time.DeltaTime;
            context.fillStyle = this.messageColor;
            context.fillText(this.sceneMessage, 250, 250);
            if (this.messageTimer > this.messageLength) {
                this.sceneMessage = '';
                this.messageTimer = 0;
                this.messageLength = 0;
            }
        }
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