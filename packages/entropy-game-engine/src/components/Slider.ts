import { Component } from './Component';
import { Color } from '../core/enums/Color';
import { GameObject } from '../game-objects/GameObject';
import { RenderableGUI } from '../core/interfaces/RenderableGUI';
import { SerializedComponent } from '../core';
import { readNumber, readString } from '../core/helpers/Serialization';

export class Slider extends Component implements RenderableGUI {
  public static override readonly typeName: string = 'Slider';
  public fillColor: Color;
  public backgroundColor: Color;
  public renderWidth: number;
  public renderHeight: number;
  public zIndex: number = 0;

  private _fillAmount: number = 100;

  public constructor(
    gameObject: GameObject,
    renderWidth: number,
    renderHeight: number,
    fillColor: Color,
    backgroundColor: Color
  ) {
    super(gameObject);

    this.fillColor = fillColor;
    this.backgroundColor = backgroundColor;
    this.renderWidth = renderWidth;
    this.renderHeight = renderHeight;
  }

  public static createFromSerialized(gameObject: GameObject, data: Record<string, unknown>): Slider {
    const slider = new Slider(
      gameObject,
      readNumber(data.renderWidth) ?? 0,
      readNumber(data.renderHeight) ?? 0,
      (readString(data.fillColor) ?? Color.White) as Color,
      (readString(data.backgroundColor) ?? Color.Black) as Color
    );
    slider.deserialize(data);
    return slider;
  }

  public get fillAmount(): number {
    return this._fillAmount;
  }

  public set fillAmount(amount: number) {
    if (amount < 0) {
      amount = 0;
    } else if (amount > 100) {
      amount = 100;
    }

    this._fillAmount = amount;
  }

  public override serialize(): SerializedComponent {
    return {
      typeName: this.typeName,
      data: {
        fillColor: this.fillColor,
        backgroundColor: this.backgroundColor,
        renderWidth: this.renderWidth,
        renderHeight: this.renderHeight,
        fillAmount: this.fillAmount,
        zIndex: this.zIndex
      }
    };
  }

  public override deserialize(data: Record<string, unknown>): void {
    const fillColor = readString(data.fillColor);
    if (fillColor !== null) {
      this.fillColor = fillColor as Color;
    }

    const backgroundColor = readString(data.backgroundColor);
    if (backgroundColor !== null) {
      this.backgroundColor = backgroundColor as Color;
    }

    const renderWidth = readNumber(data.renderWidth);
    if (renderWidth !== null) {
      this.renderWidth = renderWidth;
    }

    const renderHeight = readNumber(data.renderHeight);
    if (renderHeight !== null) {
      this.renderHeight = renderHeight;
    }

    const fillAmount = readNumber(data.fillAmount);
    if (fillAmount !== null) {
      this.fillAmount = fillAmount;
    }

    const zIndex = readNumber(data.zIndex);
    if (zIndex !== null) {
      this.zIndex = zIndex;
    }
  }

  public renderGUI(context: CanvasRenderingContext2D): void {
    //draw background
    context.fillStyle = this.backgroundColor;
    context.fillRect(
      this.transform.position.x - this.renderWidth / 2,
      this.transform.position.y - this.renderHeight,
      this.renderWidth,
      this.renderHeight
    );

    //draw fill
    const fillWidth = (this._fillAmount / 100) * this.renderWidth;
    context.fillStyle = this.fillColor;
    context.fillRect(
      this.transform.position.x - this.renderWidth / 2,
      this.transform.position.y - this.renderHeight,
      fillWidth,
      this.renderHeight
    );
  }
}
