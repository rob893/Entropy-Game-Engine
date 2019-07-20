import { Component } from "./Component";
import { Transform } from "./Transform";
import { GameObject } from "../Core/GameObject";
import { IRenderable } from "../Core/Interfaces/IRenderable";
import { RenderingEngine } from "../Core/RenderingEngine";

export class RectangleRenderer extends Component implements IRenderable {

    private renderWidth: number;
    private renderHeight: number;
    private color: string;

    public constructor(gameObject: GameObject, renderWidth: number, renderHeight: number, color: string) {
        super(gameObject);

        this.renderWidth = renderWidth;
        this.renderHeight = renderHeight;
        this.color = color

        RenderingEngine.instance.addRenderableObject(this);
    }

    public setColor(color: string): void {
        this.color = color;
    }

    public render(context: CanvasRenderingContext2D): void {
        context.fillStyle = this.color;
        context.fillRect(this.transform.position.x - (this.renderWidth / 2), this.transform.position.y - this.renderHeight, this.renderWidth, this.renderHeight);
    }
}