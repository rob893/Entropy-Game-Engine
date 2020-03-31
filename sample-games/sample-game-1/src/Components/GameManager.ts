import { Component } from '../../GameEngine/Components/Component';
import { GameObject } from '../../GameEngine/GameObjects/GameObject';
import { RenderableGUI } from '../../GameEngine/Core/Interfaces/RenderableGUI';
import { EventType } from '../../GameEngine/Core/Enums/EventType';
import { KeyCode } from '../../GameEngine/Core/Enums/KeyCode';
import { TrumpRB } from '../GameObjects/TrumpRB';
import { Rigidbody } from '../../GameEngine/Components/Rigidbody';
import { Vector2 } from '../../GameEngine/Core/Helpers/Vector2';
import { HubConnectionBuilder, HubConnection, HubConnectionState } from '@aspnet/signalr';
import { PlayerMotor } from './Characters/Player/PlayerMotor';
import { Transform } from '../../GameEngine/Components/Transform';

export class GameManager extends Component implements RenderableGUI {
    public zIndex: number = 0;

    private sceneMessage: string = '';
    private messageColor: string = '';
    private messageTimer: number = 0;
    private messageLength: number = 0;
    private gameOver: boolean = false;
    //private playerTransform: Transform | null = null;
    //private hubConnection: HubConnection | null = null;

    public constructor(gameObject: GameObject) {
        super(gameObject);

        this.input.addKeyListener(EventType.KeyDown, KeyCode.One, async () => await this.sceneManager.loadScene(1));
        this.input.addKeyListener(EventType.KeyDown, KeyCode.Two, async () => await this.sceneManager.loadScene(2));
        this.input.addKeyListener(EventType.KeyDown, KeyCode.Three, async () => await this.sceneManager.loadScene(3));
        this.input.addKeyListener(EventType.KeyDown, KeyCode.P, () => this.printGameData());
        this.input.addKeyListener(EventType.KeyDown, KeyCode.I, () => this.testInstantiate());
        this.input.addKeyListener(EventType.KeyDown, KeyCode.Escape, () => this.togglePause());
    }

    // public start(): void {
    //     if (this.sceneManager.loadedSceneId !== 1) {
    //         return;
    //     }

    //     this.hubConnection = new HubConnectionBuilder().withUrl('https://rwherber.com/api/gameserver/test').build();

    //     this.hubConnection.on('messageReceived', (username: string, message: string) => {
    //         console.log(`${username} says ${message}`);
    //     });

    //     this.hubConnection.on('playerMoved', (x: number, y: number) => this.movePlayer(x, y));

    //     this.hubConnection.start();

    //     this.input.addKeyListener(EventType.KeyDown, KeyCode.T, () => this.send());

    //     const player = this.findGameObjectById('player');

    //     if (player === null) {
    //         throw new Error('could not find player');
    //     }

    //     const playerTransform = player.getComponent(Transform);

    //     if (playerTransform === null) {
    //         throw new Error();
    //     }

    //     this.playerTransform = playerTransform;

    //     playerTransform.onMoved.add(() => this.playerMoved());
    // }

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
            this.messageTimer += this.time.deltaTime;
            context.fillStyle = this.messageColor;
            context.fillText(this.sceneMessage, 250, 250);

            if (this.messageTimer > this.messageLength) {
                this.sceneMessage = '';
                this.messageTimer = 0;
                this.messageLength = 0;
            }
        }
    }

    private togglePause(): void {
        this.sceneManager.togglePause();
    }

    private printGameData(): void {
        this.sceneManager.printGameData();
    }

    private testInstantiate(): void {
        const obj = this.instantiate(TrumpRB);
        const rb = obj.getComponent(Rigidbody);
        if (rb !== null) {
            rb.addForce(
                new Vector2(
                    (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 1500),
                    (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 1500)
                )
            );
        }
    }

    // private movePlayer(x: number, y: number): void {
    //     if (this.playerTransform === null) {
    //         return;
    //     }

    //     this.playerTransform.position.x = x;
    //     this.playerTransform.position.y = y;
    // }

    // private playerMoved(): void {
    //     if (this.playerTransform === null || this.hubConnection === null || this.hubConnection.state !== HubConnectionState.Connected) {
    //         return;
    //     }

    //     this.hubConnection.send('movedPlayer', this.playerTransform.position.x, this.playerTransform.position.y);
    // }

    // private send(): void {
    //     if (this.hubConnection === null || this.hubConnection.state !== HubConnectionState.Connected) {
    //         return;
    //     }

    //     this.hubConnection.send('newMessage', 'test username', 'test message').then(() => console.log('wat'));
    // }
}
