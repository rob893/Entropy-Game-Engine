import { Component } from "./Component";
import { Vector2 } from "../Core/Vector2";
import { LiteEvent } from "../Core/LiteEvent";
import { GameObject } from "../Core/GameObject";
import { ILiteEvent } from "../Core/Interfaces/ILiteEvent";

export class Transform extends Component {

    //Position is the top left of the agent with width growing right and height growing down.
    public readonly position: Vector2;
    //Rotation in radians
    public rotation: number;
    public readonly scale: Vector2;

    private readonly onMove = new LiteEvent<void>();

    
    public constructor(gameObject: GameObject, x: number, y: number) {
        super(gameObject);
        this.position = new Vector2(x, y);
        this.rotation = 0;
        this.scale = Vector2.one;
    }

    public get onMoved(): ILiteEvent<void> { 
        return this.onMove.expose(); 
    }

    public translate(translation: Vector2): void {
        this.position.add(translation);
        this.onMove.trigger();
    }

    public setPosition(x: number, y: number): void {
        this.position.x = x;
        this.position.y = y;
        this.onMove.trigger();
    }
}