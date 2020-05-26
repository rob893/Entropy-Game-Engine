import { Component, GameObject, RenderableBackground } from '@entropy-engine/entropy-game-engine';

export class ScrollingBackground extends Component implements RenderableBackground {
  public scrollSpeed: number = 10;

  private readonly backgroundImage: HTMLImageElement;

  private x: number = 0;

  public constructor(gameObject: GameObject, backgroundImage: HTMLImageElement) {
    super(gameObject);
    this.backgroundImage = backgroundImage;
  }

  public update(): void {
    this.x -= this.scrollSpeed;

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
