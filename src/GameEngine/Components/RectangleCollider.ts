import { Vector2 } from "../Core/Vector2";
import { Component } from "./Component";
import { Transform } from "./Transform";
import { LiteEvent } from "../Core/Helpers/LiteEvent";
import { GameObject } from "../Core/GameObject";
import { Physics } from "../Core/Physics";
import { ILiteEvent } from "../Core/Interfaces/ILiteEvent";

export class RectangleCollider extends Component {

    public topLeft: Vector2;
    public topRight: Vector2;
    public bottomLeft: Vector2;
    public bottomRight: Vector2;
    public width: number;
    public height: number;
    public visualize: boolean = true;
    public readonly transform: Transform;

    private readonly onCollide = new LiteEvent<RectangleCollider>();
    private canvasContext: CanvasRenderingContext2D;


    public constructor(gameObject: GameObject, width: number, height: number) {
        super(gameObject);

        this.width = width;
        this.height = height;

        this.transform = gameObject.getTransform();
        let transform: Transform = this.transform;

        transform.onMoved.add(() => this.onTransformMoved());

        this.topLeft = new Vector2(transform.position.x - (width / 2), transform.position.y - height);
        this.topRight = new Vector2(transform.position.x + (width / 2), transform.position.y - height);
        this.bottomLeft = new Vector2(transform.position.x - (width / 2), transform.position.y);
        this.bottomRight = new Vector2(transform.position.x + (width / 2), transform.position.y);

        Physics.Instance.addCollider(this);
    }

    public start(): void {
        this.canvasContext = this.gameObject.getGameCanvas().getContext('2d');
    }

    public update(): void {
        if (this.visualize) {
            this.drawCollider();
        }
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

    public onTransformMoved(): void {
        this.topLeft.x = this.transform.position.x - (this.width / 2);
        this.topLeft.y = this.transform.position.y - this.height;
        this.topRight.x = this.transform.position.x + (this.width / 2);
        this.topRight.y = this.transform.position.y - this.height;
        this.bottomLeft.x = this.transform.position.x - (this.width / 2);
        this.bottomLeft.y = this.transform.position.y;
        this.bottomRight.x = this.transform.position.x + (this.width / 2);
        this.bottomRight.y = this.transform.position.y;
    }

    private drawCollider(): void {
        this.canvasContext.beginPath();
        this.canvasContext.moveTo(this.topLeft.x, this.topLeft.y);
        this.canvasContext.lineTo(this.bottomLeft.x, this.bottomLeft.y);
        this.canvasContext.lineTo(this.bottomRight.x, this.bottomRight.y);
        this.canvasContext.lineTo(this.topRight.x, this.topRight.y);
        this.canvasContext.lineTo(this.topLeft.x, this.topLeft.y);
        this.canvasContext.strokeStyle = '#2fff0f';
        this.canvasContext.stroke();
    }
}