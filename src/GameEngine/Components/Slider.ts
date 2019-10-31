import { Component } from './Component';
import { Color } from '../Core/Enums/Color';
import { GameObject } from '../Core/GameObject';
import { RenderableGUI } from '../Core/Interfaces/RenderableGUI';

export class Slider extends Component implements RenderableGUI {

    public fillColor: Color;
    public backgroundColor: Color;
    public renderWidth: number;
    public renderHeight: number;

    private _fillAmount: number = 100;


    public constructor(gameObject: GameObject, renderWidth: number, renderHeight: number, fillColor: Color, backgroundColor: Color) {
        super(gameObject);

        this.fillColor = fillColor;
        this.backgroundColor = backgroundColor;
        this.renderWidth = renderWidth;
        this.renderHeight = renderHeight;
    }

    public get fillAmount(): number {
        return this._fillAmount;
    }

    public set fillAmount(amount: number) {
        if (amount < 0) {
            amount = 0;
        }
        else if (amount > 100) {
            amount = 100;
        }

        this._fillAmount = amount;
    }

    public renderGUI(context: CanvasRenderingContext2D): void {
        //draw background
        context.fillStyle = this.backgroundColor;
        context.fillRect(this.transform.position.x - (this.renderWidth / 2), this.transform.position.y - this.renderHeight, this.renderWidth, this.renderHeight);

        //draw fill
        const fillWidth = (this._fillAmount / 100) * this.renderWidth;
        context.fillStyle = this.fillColor;
        context.fillRect(this.transform.position.x - (this.renderWidth / 2), this.transform.position.y - this.renderHeight, fillWidth, this.renderHeight);
    }
}