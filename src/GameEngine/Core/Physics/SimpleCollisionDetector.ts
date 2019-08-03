import { CollisionDetector } from '../Interfaces/CollisionDetector';
import { CustomLiteEvent } from '../Interfaces/CustomLiteEvent';
import { RectangleCollider } from '../../Components/RectangleCollider';
import { LiteEvent } from '../Helpers/LiteEvent';

export class SimpleCollisionDetector implements CollisionDetector {
    
    private readonly _colliders: RectangleCollider[];
    private readonly _onCollisionDetected: LiteEvent<RectangleCollider> = new LiteEvent<RectangleCollider>();

    
    public constructor() {
        this._colliders = [];
    }

    public get colliders(): RectangleCollider[] {
        return this._colliders;
    }

    public get onCollisionDetected(): CustomLiteEvent<RectangleCollider> {
        return this._onCollisionDetected.expose();
    }

    public detectCollisions(): void {
        for (let i = 0, l = this._colliders.length; i < l; i++) {
            if (!this._colliders[i].enabled) {
                continue;
            }

            for (let j = 0; j < l; j++) {
                if (this._colliders[i] !== this._colliders[j] && this._colliders[i].detectCollision(this._colliders[j])) {
                    this._onCollisionDetected.trigger(this._colliders[i], this._colliders[j]);
                }
            }
        }
    }    

    public addCollider(collider: RectangleCollider): void {
        this._colliders.push(collider);
    }

    public addColliders(colliders: RectangleCollider[]): void {
        colliders.forEach(c => this.addCollider(c));
    }
}