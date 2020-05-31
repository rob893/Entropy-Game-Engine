import { LiteEvent } from '../helpers/LiteEvent';
import { CollisionManifold } from '../helpers/CollisionManifold';
import { Vector2 } from '../helpers/Vector2';
import { Layer } from '../enums/Layer';
import { RectangleCollider } from '../../components/RectangleCollider';
import { CollisionDetector } from '../interfaces/CollisionDetector';
import { CustomLiteEvent } from '../interfaces/CustomLiteEvent';

export abstract class BaseCollisionDetector implements CollisionDetector {
  public readonly colliders: RectangleCollider[] = [];

  protected readonly _onCollisionDetected: LiteEvent<CollisionManifold> = new LiteEvent<CollisionManifold>();
  protected readonly layerCollisionMatrix: Map<Layer, Set<Layer>>;

  public constructor(layerCollisionMatrix: Map<Layer, Set<Layer>>) {
    this.layerCollisionMatrix = layerCollisionMatrix;
  }

  public get onCollisionDetected(): CustomLiteEvent<CollisionManifold> {
    return this._onCollisionDetected.expose();
  }

  public addCollider(collider: RectangleCollider): void {
    this.colliders.push(collider);
  }

  public removeCollider(collider: RectangleCollider): void {
    const index = this.colliders.indexOf(collider);

    if (index !== -1) {
      this.colliders.splice(index, 1);
    }
  }

  public addColliders(colliders: RectangleCollider[]): void {
    colliders.forEach(c => this.addCollider(c));
  }

  protected buildCollisionManifold(colliderA: RectangleCollider, colliderB: RectangleCollider): CollisionManifold {
    const xAxis = Math.abs(colliderA.center.x - colliderB.center.x);
    const yAxis = Math.abs(colliderA.center.y - colliderB.center.y);

    const cw = colliderA.width / 2 + colliderB.width / 2;
    const ch = colliderA.height / 2 + colliderB.height / 2;

    const ox = Math.abs(xAxis - cw);
    const oy = Math.abs(yAxis - ch);

    const normal = Vector2.clone(colliderA.center).subtract(colliderB.center).normalized;

    const penetration = ox > oy ? oy : ox;

    if (ox > oy) {
      normal.x = 0;
      normal.y = normal.y > 0 ? 1 : -1;
    } else if (ox < oy) {
      normal.y = 0;
      normal.x = normal.x > 0 ? 1 : -1;
    }

    return new CollisionManifold(colliderA, colliderB, penetration, normal);
  }

  public abstract detectCollisions(): void;
}
