import { RectangleCollider } from '../../Components/RectangleCollider';
import { Vector2 } from './Vector2';

export class CollisionManifold {
  public readonly colliderA: RectangleCollider;
  public readonly colliderB: RectangleCollider;
  public readonly penetrationDepth: number;
  public readonly collisionNormal: Vector2;

  public constructor(
    colliderA: RectangleCollider,
    colliderB: RectangleCollider,
    penetrationDepth: number,
    collisionNormal: Vector2
  ) {
    this.colliderA = colliderA;
    this.colliderB = colliderB;
    this.penetrationDepth = penetrationDepth;
    this.collisionNormal = collisionNormal;
  }

  public getOtherCollider(collider: RectangleCollider): RectangleCollider {
    return collider === this.colliderA ? this.colliderB : this.colliderA;
  }

  public getCollisionNormalForCollider(collider: RectangleCollider): Vector2 {
    return collider === this.colliderA ? this.collisionNormal.clone() : this.collisionNormal.clone().multiplyScalar(-1);
  }
}
