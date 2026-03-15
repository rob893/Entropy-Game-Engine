import { Color } from '../core/enums/Color';
import type { IRenderableGizmo } from '../core/types';
import type { GameObject } from '../game-objects/GameObject';
import { Component } from './Component';

export class GridOverlayGizmo extends Component implements IRenderableGizmo {
  public static override readonly typeName: string = 'GridOverlayGizmo';

  private readonly cellWidth: number;

  private readonly cellHeight: number;

  private readonly gridCols: number;

  private readonly gridRows: number;

  private readonly lineColor: Color;

  public constructor(
    gameObject: GameObject,
    cellWidth: number,
    cellHeight: number,
    gridCols: number,
    gridRows: number,
    lineColor: Color = Color.Grey
  ) {
    super(gameObject);

    this.cellWidth = cellWidth;
    this.cellHeight = cellHeight;
    this.gridCols = gridCols;
    this.gridRows = gridRows;
    this.lineColor = lineColor;
  }

  public renderGizmo(context: CanvasRenderingContext2D): void {
    const totalWidth = this.gridCols * this.cellWidth;
    const totalHeight = this.gridRows * this.cellHeight;

    context.strokeStyle = this.lineColor;
    context.lineWidth = 0.5;
    context.globalAlpha = 0.4;

    context.beginPath();

    for (let col = 0; col <= this.gridCols; col++) {
      const x = col * this.cellWidth;
      context.moveTo(x, 0);
      context.lineTo(x, totalHeight);
    }

    for (let row = 0; row <= this.gridRows; row++) {
      const y = row * this.cellHeight;
      context.moveTo(0, y);
      context.lineTo(totalWidth, y);
    }

    context.stroke();
    context.globalAlpha = 1;
    context.lineWidth = 1;
  }
}
