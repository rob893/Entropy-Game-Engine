import { Component } from "../../GameEngine/Components/Component";
import { Player } from "../GameObjects/Player";
import { RectangleRenderer } from "../../GameEngine/Components/RectangleRenderer";
import { GameObject } from "../../GameEngine/Core/GameObject";
import { GameEngine } from "../../GameEngine/Core/GameEngine";
import { Ball } from "../GameObjects/Ball";
import { AudioSource } from "../../GameEngine/Components/AudioSource";

export class GameManager extends Component {

    private static _instance: GameManager;

    private player: Player;
    private playerRenderer: RectangleRenderer;
    private audioSource: AudioSource;


    private constructor(gameObject: GameObject) {
        super(gameObject);

        document.getElementById("print-button").addEventListener("click", () => this.printGameData());
        document.getElementById("pause-button").addEventListener("click", () => this.togglePause());
        document.getElementById("add-ball").addEventListener("click", () => this.testInstantiate());
        document.getElementById("toggle-music").addEventListener("click", () => this.toggleMusic());
    }

    public start(): void {
        this.player = GameEngine.instance.getGameObjectById("player");
        this.audioSource = this.gameObject.getComponent(AudioSource);
        this.audioSource.loop = true;
    }

    public static get instance(): GameManager {
        if(this._instance === null || this._instance === undefined) {
            throw new Error("GameManager has not been created yet. Use the createinstance method first.");
        }

        return this._instance;
    }

    public static createinstance(gameObject: GameObject): GameManager {
        if(this._instance === null || this._instance === undefined) {
            this._instance = new GameManager(gameObject);
            return this.instance;
        }
        
        throw new Error("More than one GameManager cannot be created!");
    }

    private toggleMusic(): void {
        if (this.audioSource.isPlaying) {
            this.audioSource.pause();
        }
        else {
            this.audioSource.play();
        }
    }

    private togglePause(): void {
        GameEngine.instance.togglePause();
    }

    private printGameData(): void {
        GameEngine.instance.printGameData();
    }

    private testInstantiate(): void {
        GameEngine.instance.instantiate(new Ball("ball2"));
    }
}