import { Component } from './Component';
import { RenderableGUI } from '../Core/Interfaces/RenderableGUI';
import { Color } from '../Core/Enums/Color';
import { GameObject } from '../GameObjects/GameObject';

export interface TextRendererParams {
    fontSize?: number;
    fontFamily?: string;
    fontColor?: Color;
    text?: string;
    x?: number;
    y?: number;
}

export class TextRenderer extends Component implements RenderableGUI {

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