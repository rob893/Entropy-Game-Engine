import { Vector2 } from "../Core/Vector2";
import { Component } from "./Component";
import { Transform } from "./Transform";
import { LiteEvent } from "../Core/Helpers/LiteEvent";
import { GameObject } from "../Core/GameObject";
import { Physics } from "../Core/Physics";
import { ILiteEvent } from "../Core/Interfaces/ILiteEvent";
import { RenderingEngine } from "../Core/RenderingEngine";
import { IRenderableGizmo } from "../Core/Interfaces/IRenderableGizmo";

export class RectangleCollider extends Component implements IRenderableGizmo {

    public width: number;
    public height: number;
    public readonly transform: Transform;

    private readonly onCollide = new LiteEvent<RectangleCollider>();
    private _topLeft: Vector2;
    private _topRight: Vector2;
    private _bottomLeft: Vector2;
    private _bottomRight: Vector2;


    public constructor(gameObject: GameObject, width: number, height: number) {
        super(gameObject);

        this.width = width;
        this.height = height;

        this.transform = gameObject.getTransform();
        let transform: Transform = this.transform;

        this._topLeft = new Vector2(transform.position.x - (width / 2), transform.position.y - height);
        this._topRight = new Vector2(transform.position.x + (width / 2), transform.position.y - height);
        this._bottomLeft = new Vector2(transform.position.x - (width / 2), transform.position.y);
        this._bottomRight = new Vector2(transform.position.x + (width / 2), transform.position.y);

        Physics.instance.addCollider(this);
        RenderingEngine.instance.addRenderableGizmo(this);
    }

    public get topLeft(): Vector2 {
        this._topLeft.x = this.transform.position.x - (this.width / 2);
        this._topLeft.y = this.transform.position.y - this.height;

        return this._topLeft;
    }

    public get topRight(): Vector2 {
        this._topRight.x = this.transform.position.x + (this.width / 2);
        this._topRight.y = this.transform.position.y - this.height;

        return this._topRight;
    }

    public get bottomLeft(): Vector2 {
        this._bottomLeft.x = this.transform.position.x - (this.width / 2);
        this._bottomLeft.y = this.transform.position.y;

        return this._bottomLeft;
    }

    public get bottomRight(): Vector2 {
        this._bottomRight.x = this.transform.position.x + (this.width / 2);
        this._bottomRight.y = this.transform.position.y;

        return this._bottomRight;
    }

    public detectCollision(other: RectangleCollider): boolean {
        
        if(!(other.topLeft.x > this.topRight.x ||
            other.topRight.x < this.topLeft.x ||
            other.topLeft.y > this.bottomLeft.y ||
            other.bottomLeft.y < this.topLeft.y)) {
            this.onCollide.trigger(other);
                
            return true;
        }
        
        return false;
    }

    public get center(): Vector2 {
        return new Vector2(this.topLeft.x + (this.width / 2), this.topLeft.y + (this.height / 2));
    }

    public get onCollided(): ILiteEvent<RectangleCollider> { 
        return this.onCollide.expose(); 
    }

    public renderGizmo(context: CanvasRenderingContext2D): void {
        context.beginPath();
        context.moveTo(this.topLeft.x, this.topLeft.y);
        context.lineTo(this.bottomLeft.x, this.bottomLeft.y);
        context.lineTo(this.bottomRight.x, this.bottomRight.y);
        context.lineTo(this.topRight.x, this.topRight.y);
        context.lineTo(this.topLeft.x, this.topLeft.y);
        context.strokeStyle = '#2fff0f';
        context.stroke();
    }
}