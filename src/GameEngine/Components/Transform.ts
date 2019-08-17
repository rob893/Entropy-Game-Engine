import { Component } from './Component';
import { Vector2 } from '../Core/Helpers/Vector2';
import { LiteEvent } from '../Core/Helpers/LiteEvent';
import { GameObject } from '../Core/GameObject';
import { CustomLiteEvent } from '../Core/Interfaces/CustomLiteEvent';

export class Transform extends Component {

    //Rotation in radians
    public rotation: number;
    //Position is the top left of the agent with width growing right and height growing down.
    public readonly position: Vector2;
    public readonly scale: Vector2;

    private _parent: Transform = null;
    private readonly _children: Transform[] = [];
    private readonly onMove = new LiteEvent<void>();

    
    public constructor(gameObject: GameObject, x: number, y: number, rotation: number = 0, parent: Transform = null) {
        super(gameObject);
        this.position = new Vector2(x, y);
        this.rotation = rotation;
        this.parent = parent;
        this.scale = Vector2.one;
    }

    public get onMoved(): CustomLiteEvent<void> { 
        return this.onMove.expose(); 
    }

    public get parent(): Transform {
        return this._parent;
    }

    public set parent(newParent: Transform | null) {
        if (this._parent !== null) {
            this._parent.onMoved.remove(this.updatePositionBasedOnParent);
        }
        
        if (newParent !== null) {
            newParent.onMoved.add(this.updatePositionBasedOnParent);
        }

        this._parent = newParent;
    }

    public get children(): Transform[] {
        return [...this._children];
    }

    public translate(translation: Vector2): void {
        this.position.add(translation);
        this.onMove.trigger();
    }

    public lookAt(target: Vector2): void {
        this.rotation = Math.atan2(target.y - this.position.y, target.x - this.position.x) - Math.PI / 2;
    }

    public setPosition(x: number, y: number): void {
        this.position.x = x;
        this.position.y = y;
        this.onMove.trigger();
    }

    public addChild(child: Transform): void {
        this._children.push(child);
        child.parent = this;
    }

    public isChildOf(parent: Transform): boolean {
        if (parent === this) {
            return true;
        }

        let current = this.parent;

        while (current !== null) {
            if (current === parent) {
                return true;
            }

            current = current.parent;
        }
        
        return false;
    }

    private readonly updatePositionBasedOnParent = (): void => {
        this.setPosition(this._parent.position.x, this._parent.position.y);
    }
}