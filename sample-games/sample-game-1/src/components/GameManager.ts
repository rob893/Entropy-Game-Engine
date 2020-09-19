import {
  GameObject,
  Component,
  RenderableGUI,
  EventType,
  Rigidbody,
  Vector2,
  Cursor,
  Key
} from '@entropy-engine/entropy-game-engine';
import { TrumpRB } from '../game-objects/TrumpRB';
import cursorImage from '../assets/images/cursors/cursor_final.png';

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

    this.input.addKeyListener(EventType.KeyDown, '1', async () => await this.sceneManager.loadScene(1));
    this.input.addKeyListener(EventType.KeyDown, '2', async () => await this.sceneManager.loadScene(2));
    this.input.addKeyListener(EventType.KeyDown, '3', async () => await this.sceneManager.loadScene(3));
    this.input.addKeyListener(EventType.KeyDown, 'p', () => this.printGameData());
    this.input.addKeyListener(EventType.KeyDown, 'i', () => this.testInstantiate());
    this.input.addKeyListener(EventType.KeyDown, Key.Escape, () => this.togglePause());

    Cursor.setCursor(cursorImage);
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

  //     this.input.addKeyListener(EventType.KeyDown, 't', () => this.send());

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
