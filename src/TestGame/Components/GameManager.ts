import { Component } from '../../GameEngine/Components/Component';
import { GameObject } from '../../GameEngine/Core/GameObject';
import { GameEngine } from '../../GameEngine/Core/GameEngine';
import { Ball } from '../GameObjects/Ball';
import { AudioSource } from '../../GameEngine/Components/AudioSource';
import { RenderableGUI } from '../../GameEngine/Core/Interfaces/RenderableGUI';
import { Time } from '../../GameEngine/Core/Time';

export class GameManager extends Component implements RenderableGUI {

    private static _instance: GameManager;

    private audioSource: AudioSource;
    private sceneMessage: string = '';
    private messageColor: string = '';
    private messageTimer: number = 0;
    private messageLength: number = 0;
    private gameOver: boolean = false;


    private constructor(gameObject: GameObject) {
        super(gameObject);

        document.getElementById('print-button').addEventListener('click', () => this.printGameData());
        document.getElementById('pause-button').addEventListener('click', () => this.togglePause());
        document.getElementById('add-ball').addEventListener('click', () => this.testInstantiate());
        document.getElementById('toggle-music').addEventListener('click', () => this.toggleMusic());
    }

    public static get instance(): GameManager {
        if(this._instance === null || this._instance === undefined) {
            throw new Error('GameManager has not been created yet. Use the createinstance method first.');
        }

        return this._instance;
    }

    public static createinstance(gameObject: GameObject): GameManager {
        if(this._instance === null || this._instance === undefined) {
            this._instance = new GameManager(gameObject);
            return this.instance;
        }
        
        throw new Error('More than one GameManager cannot be created!');
    }

    public start(): void {
        GameEngine.instance.renderingEngine.addRenderableGUIElement(this);
        this.audioSource = this.gameObject.getComponent(AudioSource);
        this.audioSource.loop = true;
    }

    public endGame(): void {
        this.togglePause();
        this.gameOver = true;
    }

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
        GameEngine.instance.instantiate(new Ball('ball2'));
    }
}