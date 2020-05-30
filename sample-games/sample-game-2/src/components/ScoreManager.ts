import { Component, GameObject, RenderableGUI } from '@entropy-engine/entropy-game-engine';

export class ScoreManager extends Component implements RenderableGUI {
  public readonly zIndex = 1;
  /** increase to slow down difficulty progression, decrease to speed up difficulty progression */
  public readonly progressDenom: number = 20;

  private readonly drawX: number;

  private timer: number = 0;
  private _score: number = 0;

  public constructor(gameObject: GameObject) {
    super(gameObject);
    this.drawX = this.gameCanvas.width / 2;
  }

  public get score(): number {
    return this._score;
  }

  public update(): void {
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
  }
}
