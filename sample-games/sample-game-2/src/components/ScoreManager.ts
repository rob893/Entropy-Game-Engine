import {
  Component,
  GameObject,
  Key,
  MouseButton,
  RectangleCollider,
  RenderableGUI
} from '@entropy-engine/entropy-game-engine';

export class ScoreManager extends Component implements RenderableGUI {
  public readonly zIndex = 1;
  /** increase to slow down difficulty progression, decrease to speed up difficulty progression */
  public readonly progressDenom: number = 20;

  private readonly drawX: number;

  private timer: number = 0;
  private _score: number = 0;
  private _playing: boolean = false;

  public constructor(gameObject: GameObject) {
    super(gameObject);
    this.drawX = this.gameCanvas.width / 2;
  }

  public get score(): number {
    return this._score;
  }

  public get playing(): boolean {
    return this._playing;
  }

  public start(): void {
    const player = this.findGameObjectById('player');

    if (!player) {
      throw new Error('No player found.');
    }

    const playerCollider = player.getComponent(RectangleCollider);

    if (!playerCollider) {
      throw new Error('No collider attached to player');
    }

    playerCollider.onCollided.subscribe(() => (this._playing = false));
  }

  public update(): void {
    if (!this._playing) {
      if (
        (this.input.getKey(Key.Space) || this.input.getMouseButton(MouseButton.LeftMouseButton)) &&
        this._score === 0
      ) {
        this._playing = true;
      }

      return;
    }

    this.timer += this.time.deltaTime;

    if (this.timer > 0.1) {
      this._score++;
      this.timer = 0;
    }
  }

  public renderGUI(context: CanvasRenderingContext2D): void {
    context.font = '20px Arial';
    context.fillStyle = 'white';
    context.fillText(`Score: ${this._score}`, this.drawX, 20);

    if (!this._playing && this._score === 0) {
      context.fillText(
        'Press Space or left click to move up!',
        this.gameCanvas.width / 2 - 150,
        this.gameCanvas.height / 2 - 25
      );
      context.fillText(
        'Release space or left click to move down!',
        this.gameCanvas.width / 2 - 150,
        this.gameCanvas.height / 2
      );
      context.fillText(
        'Press space or left click to start!',
        this.gameCanvas.width / 2 - 150,
        this.gameCanvas.height / 2 + 25
      );
    } else if (!this._playing) {
      context.fillText('You lose!', this.gameCanvas.width / 2 - 50, this.gameCanvas.height / 2 - 15);
      context.fillText(`Your score: ${this._score}`, this.gameCanvas.width / 2 - 50, this.gameCanvas.height / 2 + 15);
    }
  }
}
