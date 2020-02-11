import { Component } from './Component';
import { GameObject } from '../GameObjects/GameObject';
import { Renderable } from '../Core/Interfaces/Renderable';

export class RectangleRenderer extends Component implements Renderable {

    public renderWidth: number;
    public renderHeight: number;
    public color: string;


    public constructor(gameObject: GameObject, renderWidth: number, renderHeight: number, color: string) {
        super(gameObject);

        this.renderWidth = renderWidth;
        this.renderHeight = renderHeight;
        this.color = color;
    }

    public setColor(color: string): void {
        this.color = color;
    }

    public render(context: CanvasRenderingContext2D): void {
        context.fillStyle = this.color;
        context.fillRect(this.transform.position.x - (this.renderWidth / 2), this.transform.position.y - this.renderHeight, this.renderWidth, this.renderHeight);
    }
}