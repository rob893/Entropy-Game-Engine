import { Component, Vector2, RectangleCollider, GameObject } from '@entropy-engine/entropy-game-engine';
import { Border } from '../game-objects/Border';
import { ScoreManager } from './ScoreManager';

export class BorderManager extends Component {
  private readonly scoreManager: ScoreManager;
  private readonly topBorders: Border[] = [];
  private readonly bottomBorders: Border[] = [];
  private readonly borderWidth: number;
  private readonly borderHeight: number;
  private readonly maxBorderHeightStart = 30;
  private readonly minBorderHeightStart = 5;

  private maxBorderHeight: number;
  private minBorderHeight: number;
  private topGoingDown: boolean = false;
  private bottomGoingDown: boolean = false;

  public constructor(gameObject: GameObject, scoreManager: ScoreManager, borderWidth?: number, borderHeight?: number) {
    super(gameObject);
    this.scoreManager = scoreManager;
    this.borderWidth = borderWidth || 20;
    this.borderHeight = borderHeight || 200;
    this.maxBorderHeight = this.maxBorderHeightStart;
    this.minBorderHeight = this.minBorderHeightStart;
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
    this.maxBorderHeight = this.maxBorderHeightStart + this.scoreManager.score / this.scoreManager.progressDenom;

    if (this.maxBorderHeight > this.gameCanvas.height / 4) {
      this.maxBorderHeight = this.gameCanvas.height / 4;
    }

    this.minBorderHeight = this.minBorderHeightStart + this.scoreManager.score / this.scoreManager.progressDenom;

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
          position: { x: ltbX, y: ltbY }
        }
      } = this.topBorders[this.topBorders.length - 1];

      if (ltbY >= this.maxBorderHeight) {
        this.topGoingDown = false;
      } else if (ltbY <= this.minBorderHeight) {
        this.topGoingDown = true;
      }

      if (this.scoreManager.score % 50 === 0) {
        leftTopBorder.transform.setPosition(ltbX + this.borderWidth, Math.random() * this.maxBorderHeight + 1);
      } else {
        leftTopBorder.transform.setPosition(ltbX + this.borderWidth, this.topGoingDown ? ltbY + 1 : ltbY - 1);
      }

      this.topBorders.push(leftTopBorder);
    }

    if (this.bottomBorders[0].transform.position.x <= -100) {
      const leftBottomBorder = this.bottomBorders.shift();

      if (!leftBottomBorder) {
        throw new Error('Top border is null');
      }

      const {
        transform: {
          position: { x: ltbX, y: ltbY }
        }
      } = this.bottomBorders[this.bottomBorders.length - 1];

      const botBorderHeight = this.gameCanvas.height - (ltbY - this.borderHeight);

      if (botBorderHeight >= this.maxBorderHeight) {
        this.bottomGoingDown = true;
      } else if (botBorderHeight <= this.minBorderHeight) {
        this.bottomGoingDown = false;
      }

      if (this.scoreManager.score % 50 === 0) {
        leftBottomBorder.transform.setPosition(
          ltbX + this.borderWidth,
          Math.random() * this.maxBorderHeight + (this.gameCanvas.height - this.maxBorderHeight) + this.borderHeight + 1
        );
      } else {
        leftBottomBorder.transform.setPosition(ltbX + this.borderWidth, this.bottomGoingDown ? ltbY + 1 : ltbY - 1);
      }

      this.bottomBorders.push(leftBottomBorder);
    }
  }
}
