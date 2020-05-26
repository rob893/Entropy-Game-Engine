import { Component } from './Component';
import { Renderable } from '../core/interfaces/Renderable';
import { GameObject } from '../game-objects/GameObject';

export class ImageRenderer extends Component implements Renderable {
  private image: HTMLImageElement;
  private readonly renderWidth: number;
  private readonly renderHeight: number;
  private readonly halfRWidth: number;
  private readonly halfRHeight: number;

  public constructor(gameObject: GameObject, renderWidth: number, renderHeight: number, image: HTMLImageElement) {
    super(gameObject);

    this.renderWidth = renderWidth;
    this.halfRWidth = renderWidth / 2;
    this.renderHeight = renderHeight;
    this.halfRHeight = renderHeight / 2;
    this.image = image;
  }

  public render(context: CanvasRenderingContext2D): void {
    context.translate(this.transform.position.x, this.transform.position.y - this.halfRHeight);
    context.rotate(this.transform.rotation);

    context.drawImage(this.image, 0 - this.halfRWidth, 0 - this.halfRHeight, this.renderWidth, this.renderHeight);

    context.rotate(-this.transform.rotation);
    context.translate(-this.transform.position.x, -(this.transform.position.y - this.halfRHeight));
  }
}
