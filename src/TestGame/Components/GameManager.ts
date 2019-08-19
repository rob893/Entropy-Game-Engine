import { Component } from '../../GameEngine/Components/Component';
import { GameObject } from '../../GameEngine/Core/GameObject';
import { GameEngine } from '../../GameEngine/Core/GameEngine';
import { Ball } from '../GameObjects/Ball';
import { AudioSource } from '../../GameEngine/Components/AudioSource';
import { RenderableGUI } from '../../GameEngine/Core/Interfaces/RenderableGUI';
import { Time } from '../../GameEngine/Core/Time';
import { Input } from '../../GameEngine/Core/Helpers/Input';
import { EventType } from '../../GameEngine/Core/Enums/EventType';
import { KeyCode } from '../../GameEngine/Core/Enums/KeyCode';

export class GameManager extends Component implements RenderableGUI {

    //private audioSource: AudioSource;
    private sceneMessage: string = '';
    private messageColor: string = '';
    private messageTimer: number = 0;
    private messageLength: number = 0;
    private readonly gameOver: boolean = false; //to get es lint to shut up


    public constructor(gameObject: GameObject, input: Input) {
        super(gameObject);

        // input.addKeyListener(EventType.KeyDown, KeyCode.One, async () => await this.gameEngine.loadScene(1));
        // input.addKeyListener(EventType.KeyDown, KeyCode.Two, async () => await this.gameEngine.loadScene(2));
        // input.addKeyListener(EventType.KeyDown, KeyCode.Three, async () => await this.gameEngine.loadScene(3));
        // input.addKeyListener(EventType.KeyDown, KeyCode.P, () => this.printGameData());
    }

    // public endGame(): void {
    //     this.togglePause();
    //     this.gameOver = true;
    // }

    public showMessage(message: string, lengthInSeconds: number, color: string): void {
        this.sceneMessage = message;
        this.messageLength = lengthInSeconds;
        this.messageColor = color;
    }

    public renderGUI(context: CanvasRenderingContext2D): void {
        this.renderGameOver(context);
        this.renderMessage(context);
    }

    private renderGameOver(context: CanvasRenderingContext2D): void {
        if (this.gameOver) {
            context.fillText('Game Over! YOU SUCK', 50, 50);
        }
    }

    private renderMessage(context: CanvasRenderingContext2D): void {
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

    // private togglePause(): void {
    //     this.gameEngine.togglePause();
    // }

    // private printGameData(): void {
    //     this.gameEngine.printGameData();
    // }

    private testInstantiate(): void {
        //GameEngine.instance.instantiate(new Ball('ball2'));
    }
}