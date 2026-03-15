import type { ISerializedComponent } from '../core';
import { createImageFromSource, getElementSource, readNumber, readString } from '../core/helpers/Serialization';
import type { IRenderable } from '../core/types';
import type { GameObject } from '../game-objects/GameObject';
import { Component } from './Component';

export class ImageRenderer extends Component implements IRenderable {
  public static override readonly typeName: string = 'ImageRenderer';

  private image: HTMLImageElement;

  private renderWidth: number;

  private renderHeight: number;

  private halfRWidth: number;

  private halfRHeight: number;

  public constructor(gameObject: GameObject, renderWidth: number, renderHeight: number, image: HTMLImageElement) {
    super(gameObject);

    this.renderWidth = renderWidth;
    this.halfRWidth = renderWidth / 2;
    this.renderHeight = renderHeight;
    this.halfRHeight = renderHeight / 2;
    this.image = image;
  }

  public static createFromSerialized(gameObject: GameObject, data: Record<string, unknown>): ImageRenderer {
    const renderWidth = readNumber(data.renderWidth) ?? 0;
    const renderHeight = readNumber(data.renderHeight) ?? 0;
    const imageRenderer = new ImageRenderer(
      gameObject,
      renderWidth,
      renderHeight,
      createImageFromSource(readString(data.imageSource))
    );
    imageRenderer.deserialize(data);
    return imageRenderer;
  }

  public override serialize(): ISerializedComponent {
    return {
      typeName: this.typeName,
      data: {
        renderWidth: this.renderWidth,
        renderHeight: this.renderHeight,
        imageSource: getElementSource(this.image) ?? null
      }
    };
  }

  public override deserialize(data: Record<string, unknown>): void {
    const renderWidth = readNumber(data.renderWidth);
    if (renderWidth !== null) {
      this.renderWidth = renderWidth;
      this.halfRWidth = renderWidth / 2;
    }

    const renderHeight = readNumber(data.renderHeight);
    if (renderHeight !== null) {
      this.renderHeight = renderHeight;
      this.halfRHeight = renderHeight / 2;
    }

    const imageSource = readString(data.imageSource);
    if (imageSource !== null) {
      this.image = createImageFromSource(imageSource);
    }
  }

  public render(context: CanvasRenderingContext2D): void {
    context.save();
    context.translate(this.transform.position.x, this.transform.position.y - this.halfRHeight);
    context.rotate(this.transform.rotation);
    context.drawImage(this.image, 0 - this.halfRWidth, 0 - this.halfRHeight, this.renderWidth, this.renderHeight);
    context.restore();
  }
}
