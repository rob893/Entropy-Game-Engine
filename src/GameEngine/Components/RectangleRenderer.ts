import { Component } from './Component';
import { GameObject } from '../Core/GameObject';
import { Renderable } from '../Core/Interfaces/Renderable';
import { GameEngine } from '../Core/GameEngine';

export class RectangleRenderer extends Component implements Renderable {

    private readonly renderWidth: number;
    private readonly renderHeight: number;
    private color: string;

    public constructor(gameObject: GameObject, renderWidth: number, renderHeight: number, color: string) {
        super(gameObject);

        this.renderWidth = renderWidth;
        this.renderHeight = renderHeight;
        this.color = color;

        GameEngine.instance.renderingEngine.addRenderableObject(this);
    }

    public setColor(color: string): void {
        this.color = color;
    }

    public render(context: CanvasRenderingContext2D): void {
        context.fillStyle = this.color;
        context.fillRect(this.transform.position.x - (this.renderWidth / 2), this.transform.position.y - this.renderHeight, this.renderWidth, this.renderHeight);
    }
}