import { RectangleCollider } from '../../Components/RectangleCollider';
import { Vector2 } from './Vector2';

export class CollisionManifold {

    public readonly colliderA: RectangleCollider;
    public readonly colliderB: RectangleCollider;
    public readonly penetrationDepth: number;
    public readonly collisionNormal: Vector2;


    public constructor(colliderA: RectangleCollider, colliderB: RectangleCollider, penetrationDepth: number, collisionNormal: Vector2) {
        this.colliderA = colliderA;
        this.colliderB = colliderB;
        this.penetrationDepth = penetrationDepth;
        this.collisionNormal = collisionNormal;
    }
}