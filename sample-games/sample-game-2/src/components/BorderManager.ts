import { Component, Vector2, RectangleCollider, GameObject } from '@entropy-engine/entropy-game-engine';
import { Border } from '../game-objects/Border';

export class BorderManager extends Component {
  private readonly topBorders: Border[] = [];
  private readonly bottomBorders: Border[] = [];
  private readonly borderWidth: number;
  private readonly borderHeight: number;

  private maxBorderHeight: number;
  private minBorderHeight: number;
  private topGoingDown: boolean = false;
  private bottomGoingDown: boolean = false;

  public constructor(
    gameObject: GameObject,
    borderWidth?: number,
    borderHeight?: number,
    maxBorderHeight?: number,
    minBorderHeight?: number
  ) {
    super(gameObject);
    this.borderWidth = borderWidth || 20;
    this.borderHeight = borderHeight || 200;
    this.maxBorderHeight = maxBorderHeight || 30;
    this.minBorderHeight = minBorderHeight || 5;
  }

  public start(): void {
    const targetWidth = this.gameCanvas.width + 100;

    let currX = -100;

    while (currX <= targetWidth) {
      const topBorder = this.instantiate(Border, new Vector2(currX, 5));
      const bottomBorder = this.instantiate(
        Border,
        new Vector2(currX, this.gameCanvas.height + (this.borderHeight - 5))
      );

      currX += this.borderWidth;

      if (topBorder instanceof Border) {
        this.topBorders.push(topBorder);
      }

      if (bottomBorder instanceof Border) {
        this.bottomBorders.push(bottomBorder);
      }
    }
  }

  public update(): void {
    if (this.topBorders.length === 0 || this.bottomBorders.length === 0) {
      return;
    }

    if (this.topBorders[0].transform.position.x <= -100) {
      const leftTopBorder = this.topBorders.shift();

      if (!leftTopBorder) {
        throw new Error('Top border is null');
      }

      const {
        transform: {
          position: { y: ltY }
        }
      } = leftTopBorder;

      if (ltY >= this.maxBorderHeight) {
        this.topGoingDown = false;
      } else if (ltY <= this.minBorderHeight) {
        this.topGoingDown = true;
      }

      leftTopBorder.transform.setPosition(this.gameCanvas.width + 100, this.topGoingDown ? ltY + 5 : ltY - 5);
      this.topBorders.push(leftTopBorder);
    }

    if (this.bottomBorders[0].transform.position.x <= -100) {
      const leftBottomBorder = this.bottomBorders.shift();
      if (!leftBottomBorder) {
        throw new Error('Top border is null');
      }

      leftBottomBorder.transform.setPosition(
        this.gameCanvas.width + 100,
        this.gameCanvas.height + (this.borderHeight - 5)
      );
      this.bottomBorders.push(leftBottomBorder);
    }
  }
}
