import { Component } from './Component';
import { GameObject } from '../game-objects/GameObject';
import { Renderable } from '../core/interfaces/Renderable';
import { Color } from '../core';

export interface RectangleRendererOptions {
  renderWidth: number;
  renderHeight: number;
  fillColor?: Color;
  borderColor?: Color;
}

export class RectangleRenderer extends Component implements Renderable {
  public renderWidth: number;
  public renderHeight: number;
  public color?: string;
  public borderColor?: string;

  public constructor(gameObject: GameObject, options: RectangleRendererOptions);
  public constructor(gameObject: GameObject, renderWidth: number, renderHeight: number, color: string);
  public constructor(
    gameObject: GameObject,
    renderWidthOrOptions: number | RectangleRendererOptions,
    renderHeight?: number,
    color?: string
  ) {
    super(gameObject);

    if (typeof renderWidthOrOptions === 'number' && typeof renderHeight === 'number' && typeof color === 'string') {
      this.renderWidth = renderWidthOrOptions;
      this.renderHeight = renderHeight;
      this.color = color;
    } else {
      const { renderHeight, renderWidth, borderColor, fillColor } = renderWidthOrOptions as RectangleRendererOptions;
      this.renderWidth = renderWidth;
      this.renderHeight = renderHeight;

      if (borderColor) {
        this.borderColor = borderColor;
      }

      if (fillColor) {
        this.color = fillColor;
      }
    }
  }

  public setColor(color: string): void {
    this.color = color;
  }

  public render(context: CanvasRenderingContext2D): void {
    if (this.color) {
      context.fillStyle = this.color;
      context.fillRect(
        this.transform.position.x - this.renderWidth / 2,
        this.transform.position.y - this.renderHeight,
        this.renderWidth,
        this.renderHeight
      );
    }

    if (this.borderColor) {
      context.beginPath();
      context.moveTo(this.transform.position.x - this.renderWidth / 2, this.transform.position.y - this.renderHeight);
      context.lineTo(this.transform.position.x + this.renderWidth / 2, this.transform.position.y - this.renderHeight);
      context.lineTo(this.transform.position.x + this.renderWidth / 2, this.transform.position.y);
      context.lineTo(this.transform.position.x - this.renderWidth / 2, this.transform.position.y);
      context.lineTo(this.transform.position.x - this.renderWidth / 2, this.transform.position.y - this.renderHeight);
      context.strokeStyle = this.borderColor;
      context.stroke();
    }
  }
}
