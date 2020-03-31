import { CollisionDetector } from '../Interfaces/CollisionDetector';
import { CustomLiteEvent } from '../Interfaces/CustomLiteEvent';
import { RectangleCollider } from '../../Components/RectangleCollider';
import { LiteEvent } from '../Helpers/LiteEvent';
import { CollisionManifold } from '../Helpers/CollisionManifold';
import { Vector2 } from '../Helpers/Vector2';

export class SimpleCollisionDetector implements CollisionDetector {
    private readonly _colliders: RectangleCollider[];
    private readonly _onCollisionDetected: LiteEvent<CollisionManifold> = new LiteEvent<CollisionManifold>();

    public constructor() {
        this._colliders = [];
    }

    public get colliders(): RectangleCollider[] {
        return this._colliders;
    }

    public get onCollisionDetected(): CustomLiteEvent<CollisionManifold> {
        return this._onCollisionDetected.expose();
    }

    public detectCollisions(): void {
        for (let i = 0, l = this._colliders.length; i < l; i++) {
            if (!this._colliders[i].enabled) {
                continue;
            }

            for (let j = 0; j < l; j++) {
                if (
                    this._colliders[i] !== this._colliders[j] &&
                    this._colliders[i].detectCollision(this._colliders[j])
                ) {
                    this._onCollisionDetected.trigger(
                        this.buildCollisionManifold(this._colliders[i], this._colliders[j])
                    );
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

    public removeCollider(collider: RectangleCollider): void {
        const index = this._colliders.indexOf(collider);

        if (index !== -1) {
            this._colliders.splice(index, 1);
        }
    }

    private buildCollisionManifold(colliderA: RectangleCollider, colliderB: RectangleCollider): CollisionManifold {
        const xAxis = Math.abs(colliderA.center.x - colliderB.center.x);
        const yAxis = Math.abs(colliderA.center.y - colliderB.center.y);

        const cw = colliderA.width / 2 + colliderB.width / 2;
        const ch = colliderA.height / 2 + colliderB.height / 2;

        const ox = Math.abs(xAxis - cw);
        const oy = Math.abs(yAxis - ch);

        const normal = Vector2.clone(colliderA.center).subtract(colliderB.center).normalized;

        const penetration = ox < oy ? oy : ox;

        if (ox > oy) {
            normal.x = 0;
            normal.y = normal.y > 0 ? 1 : -1;
        } else if (ox < oy) {
            normal.y = 0;
            normal.x = normal.x > 0 ? 1 : -1;
        }

        return new CollisionManifold(colliderA, colliderB, penetration, normal);
    }
}
