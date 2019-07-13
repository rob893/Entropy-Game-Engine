import { Component } from "./Component";
import { Vector2 } from "../Core/Vector2";
import { LiteEvent } from "../Core/Helpers/LiteEvent";
import { GameObject } from "../Core/GameObject";
import { ILiteEvent } from "../Core/Interfaces/ILiteEvent";

export class Transform extends Component {

    public width: number = 0;
    public height: number = 0;
    //Position is the top left of the agent with width growing right and height growing down.
    public readonly position: Vector2;
    //Rotation in radians
    public rotation: number;

    private readonly onMove = new LiteEvent<void>();

    
    public constructor(gameObject: GameObject, x: number, y: number, width: number, height: number) {
        super(gameObject);
        this.width = width;
        this.height = height;
        this.position = new Vector2(x, y);
        this.rotation = 0;
    }

    public get onMoved(): ILiteEvent<void> { 
        return this.onMove.expose(); 
    }

    public get center(): Vector2 {
        return new Vector2(this.position.x + (this.width / 2), this.position.y + (this.height / 2));
    }

    public get bottomCenter(): Vector2 {
        return new Vector2(this.position.x + (this.width / 2), this.position.y + this.height);
    }

    public translate(translation: Vector2): void {
        this.position.x += translation.x;
        this.position.y += (-1 * translation.y); //This is to make a more positive y value go up instead of down.
        this.onMove.trigger();
    }

    public setPosition(x: number, y: number): void {
        this.position.x = x;
        this.position.y = y;
        this.onMove.trigger();
    }
}