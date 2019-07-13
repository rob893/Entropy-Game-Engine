import { Component } from "../../GameEngine/Components/Component";
import { Player } from "../GameObjects/Player";
import { RectangleRenderer } from "../../GameEngine/Components/RectangleRenderer";
import { GameObject } from "../../GameEngine/Core/GameObject";
import { GameEngine } from "../../GameEngine/Core/GameEngine";
import { Ball } from "../GameObjects/Ball";

export class GameManager extends Component {

    private static instance: GameManager;

    private player: Player;
    private playerRenderer: RectangleRenderer;


    private constructor(gameObject: GameObject) {
        super(gameObject);

        document.getElementById("print-button").addEventListener("click", () => this.printGameData());
        document.getElementById("pause-button").addEventListener("click", () => this.togglePause());
        document.getElementById("add-ball").addEventListener("click", () => this.testInstantiate());
    }

    public start(): void {
        this.player = GameEngine.Instance.getGameObjectById("player");
    }

    public static get Instance(): GameManager {
        if(this.instance === null || this.instance === undefined) {
            throw new Error("GameManager has not been created yet. Use the createInstance method first.");
        }

        return this.instance;
    }

    public static createInstance(gameObject: GameObject): GameManager {
        if(this.instance === null || this.instance === undefined) {
            this.instance = new GameManager(gameObject);
            return this.instance;
        }
        
        throw new Error("More than one GameManager cannot be created!");
    }

    private togglePause(): void {
        GameEngine.Instance.togglePause();
    }

    private printGameData(): void {
        GameEngine.Instance.printGameData();
    }

    private testInstantiate(): void {
        GameEngine.Instance.instantiate(new Ball("ball2"));
    }
}