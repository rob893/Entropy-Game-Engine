import { Vector2 } from "../Core/Vector2";
import { Component } from "./Component";
import { Transform } from "./Transform";
import { LiteEvent } from "../Core/Helpers/LiteEvent";
import { GameObject } from "../Core/GameObject";

export class RectangleCollider extends Component {

    public topLeft: Vector2;
    public topRight: Vector2;
    public bottomLeft: Vector2;
    public bottomRight: Vector2;
    public readonly transform: Transform;

    private readonly onCollide = new LiteEvent<RectangleCollider>();


    public constructor(gameObject: GameObject) {
        super(gameObject);

        this.transform = gameObject.getTransform();
        let transform: Transform = this.transform;

        transform.onMoved.add(() => this.onTransformMoved());

        this.topLeft = new Vector2(transform.position.x, transform.position.y);
        this.topRight = new Vector2(transform.position.x + transform.width, transform.position.y);
        this.bottomLeft = new Vector2(transform.position.x, transform.position.y + transform.height);
        this.bottomRight = new Vector2(transform.position.x + transform.width, transform.position.y + transform.height);
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

    public get onCollided() { 
        return this.onCollide.expose(); 
    }

    public onTransformMoved(): void {
        this.topLeft.x = this.transform.position.x;
        this.topLeft.y = this.transform.position.y;
        this.topRight.x = this.transform.position.x + this.transform.width;
        this.topRight.y = this.transform.position.y;
        this.bottomLeft.x = this.transform.position.x;
        this.bottomLeft.y = this.transform.position.y + this.transform.height;
        this.bottomRight.x = this.transform.position.x + this.transform.width;
        this.bottomRight.y = this.transform.position.y + this.transform.height;
    }
}