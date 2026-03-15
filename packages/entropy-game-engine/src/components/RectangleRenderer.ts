import type { Color, ISerializedComponent } from '../core';
import { readNumber, readString } from '../core/helpers/Serialization';
import type { IRenderable } from '../core/types';
import type { GameObject } from '../game-objects/GameObject';
import { Component } from './Component';
import type { IRectangleRendererOptions } from './types';

export class RectangleRenderer extends Component implements IRenderable {
  public static override readonly typeName: string = 'RectangleRenderer';

  public renderWidth: number;

  public renderHeight: number;

  public color?: string;

  public borderColor?: string;

  public constructor(gameObject: GameObject, options: IRectangleRendererOptions);
  public constructor(gameObject: GameObject, renderWidth: number, renderHeight: number, color: string);
  public constructor(
    gameObject: GameObject,
    renderWidthOrOptions: number | IRectangleRendererOptions,
    renderHeight?: number,
    color?: string
  ) {
    super(gameObject);

    if (typeof renderWidthOrOptions === 'number' && typeof renderHeight === 'number' && typeof color === 'string') {
      this.renderWidth = renderWidthOrOptions;
      this.renderHeight = renderHeight;
      this.color = color;
    } else {
      const { renderHeight, renderWidth, borderColor, fillColor } = renderWidthOrOptions as IRectangleRendererOptions;
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

  public static createFromSerialized(gameObject: GameObject, data: Record<string, unknown>): RectangleRenderer {
    const rectangleRenderer = new RectangleRenderer(gameObject, {
      renderWidth: readNumber(data.renderWidth) ?? 0,
      renderHeight: readNumber(data.renderHeight) ?? 0,
      fillColor: (readString(data.color) ?? undefined) as Color | undefined,
      borderColor: (readString(data.borderColor) ?? undefined) as Color | undefined
    });
    rectangleRenderer.deserialize(data);
    return rectangleRenderer;
  }

  public override serialize(): ISerializedComponent {
    return {
      typeName: this.typeName,
      data: {
        renderWidth: this.renderWidth,
        renderHeight: this.renderHeight,
        color: this.color ?? null,
        borderColor: this.borderColor ?? null
      }
    };
  }

  public override deserialize(data: Record<string, unknown>): void {
    const renderWidth = readNumber(data.renderWidth);
    if (renderWidth !== null) {
      this.renderWidth = renderWidth;
    }

    const renderHeight = readNumber(data.renderHeight);
    if (renderHeight !== null) {
      this.renderHeight = renderHeight;
    }

    if (data.color === null) {
      this.color = undefined;
    } else {
      const color = readString(data.color);
      if (color !== null) {
        this.color = color;
      }
    }

    if (data.borderColor === null) {
      this.borderColor = undefined;
    } else {
      const borderColor = readString(data.borderColor);
      if (borderColor !== null) {
        this.borderColor = borderColor;
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
