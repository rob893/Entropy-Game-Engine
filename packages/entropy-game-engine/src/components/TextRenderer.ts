import { Component } from './Component';
import { RenderableGUI } from '../core/interfaces/RenderableGUI';
import { Color } from '../core/enums/Color';
import { GameObject } from '../game-objects/GameObject';
import { SerializedComponent } from '../core';
import { readNumber, readString } from '../core/helpers/Serialization';

export interface TextRendererParams {
  fontSize?: number;
  fontFamily?: string;
  fontColor?: Color;
  text?: string;
  x?: number;
  y?: number;
}

export class TextRenderer extends Component implements RenderableGUI {
  public static override readonly typeName: string = 'TextRenderer';
  public fontSize: number;
  public fontFamily: string;
  public fontColor: Color;
  public text: string;
  public x: number;
  public y: number;
  public zIndex: number = 0;

  public constructor(gameObject: GameObject, config: TextRendererParams) {
    super(gameObject);

    this.fontSize = config.fontSize || 20;
    this.fontFamily = config.fontFamily || 'Arial';
    this.fontColor = config.fontColor || Color.White;
    this.text = config.text || '';
    this.x = config.x || 0;
    this.y = config.y || 0;
  }

  public static createFromSerialized(gameObject: GameObject, data: Record<string, unknown>): TextRenderer {
    const textRenderer = new TextRenderer(gameObject, {
      fontSize: readNumber(data.fontSize) ?? undefined,
      fontFamily: readString(data.fontFamily) ?? undefined,
      fontColor: (readString(data.color) ?? undefined) as Color | undefined,
      text: readString(data.text) ?? undefined,
      x: readNumber(data.x) ?? undefined,
      y: readNumber(data.y) ?? undefined,
    });
    textRenderer.deserialize(data);
    return textRenderer;
  }

  public override serialize(): SerializedComponent {
    return {
      typeName: this.typeName,
      data: {
        text: this.text,
        fontSize: this.fontSize,
        fontFamily: this.fontFamily,
        color: this.fontColor,
        x: this.x,
        y: this.y,
        zIndex: this.zIndex
      }
    };
  }

  public override deserialize(data: Record<string, unknown>): void {
    const text = readString(data.text);
    if (text !== null) {
      this.text = text;
    }

    const fontSize = readNumber(data.fontSize);
    if (fontSize !== null) {
      this.fontSize = fontSize;
    }

    const fontFamily = readString(data.fontFamily);
    if (fontFamily !== null) {
      this.fontFamily = fontFamily;
    }

    const color = readString(data.color);
    if (color !== null) {
      this.fontColor = color as Color;
    }

    const x = readNumber(data.x);
    if (x !== null) {
      this.x = x;
    }

    const y = readNumber(data.y);
    if (y !== null) {
      this.y = y;
    }

    const zIndex = readNumber(data.zIndex);
    if (zIndex !== null) {
      this.zIndex = zIndex;
    }
  }

  public renderGUI(context: CanvasRenderingContext2D): void {
    context.font = `${this.fontSize}px ${this.fontFamily}`;
    context.fillStyle = this.fontColor;
    context.fillText(this.text, this.x, this.y);
  }

  public getTextWidth(context: CanvasRenderingContext2D): number {
    const oldFont = context.font;
    context.font = `${this.fontSize}px ${this.fontFamily}`;
    const textInfo = context.measureText(this.text);
    context.font = oldFont;

    return textInfo.width;
  }
}
