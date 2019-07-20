import { ICollisionDetector } from "./Interfaces/ICollisionDetector";
import { ILiteEvent } from "./Interfaces/ILiteEvent";
import { RectangleCollider } from "../Components/RectangleCollider";
import { LiteEvent } from "./Helpers/LiteEvent";

export class SimpleCollisionDetector implements ICollisionDetector {
    
    private readonly _colliders: RectangleCollider[];
    private readonly onCollided: LiteEvent<RectangleCollider> = new LiteEvent<RectangleCollider>();
    
    public constructor() {
        this._colliders = [];
    }

    public get colliders(): RectangleCollider[] {
        return this._colliders;
    }

    public detectCollisions(): void {
        for (let i = 0, l = this._colliders.length; i < l; i++) {
            if (!this._colliders[i].enabled) {
                continue;
            }

            for (let j = 0; j < l; j++) {
                if (this._colliders[i] !== this._colliders[j] && this._colliders[i].detectCollision(this._colliders[j])) {
                    this.onCollided.trigger(this._colliders[i], this._colliders[j]);
                }
            }
        }
    }    
    
    public onCollisionDetected(): ILiteEvent<RectangleCollider> {
        return this.onCollided.expose();
    }

    public addCollider(collider: RectangleCollider): void {
        this._colliders.push(collider);
    }

    public addColliders(colliders: RectangleCollider[]): void {
        colliders.forEach(c => this.addCollider(c));
    }
}