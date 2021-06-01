import { Component, GameObject, RenderableBackground } from '@entropy-engine/entropy-game-engine';
import { ScoreManager } from './ScoreManager';

export class ScrollingBackground extends Component implements RenderableBackground {
  public scrollSpeed: number = 300;

  private readonly backgroundImage: HTMLImageElement;

  private x: number = 0;
  private scoreManager: ScoreManager | null = null;

  public constructor(gameObject: GameObject, backgroundImage: HTMLImageElement) {
    super(gameObject);
    this.backgroundImage = backgroundImage;
  }

  public override start(): void {
    const gameManager = this.findGameObjectById('gameManager');

    if (!gameManager) {
      throw new Error('no gameManager found');
    }

    this.scoreManager = gameManager.getComponent(ScoreManager);
  }

  public override update(): void {
    if (!this.scoreManager) {
      throw new Error('No score manager found');
    }

    if (!this.scoreManager.playing) {
      return;
    }

    this.x -= this.scrollSpeed * this.time.deltaTime;

    if (this.x < -this.gameCanvas.width) {
      this.x = 0;
    }
  }

  public renderBackground(context: CanvasRenderingContext2D): void {
    context.drawImage(this.backgroundImage, this.x, 0, this.gameCanvas.width, this.gameCanvas.height);

    if (this.x < 0) {
      context.drawImage(
        this.backgroundImage,
        this.x + this.gameCanvas.width,
        0,
        this.gameCanvas.width,
        this.gameCanvas.height
      );
    }
  }
}
