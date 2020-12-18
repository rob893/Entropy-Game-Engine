import { RectangleCollider } from '../../components/RectangleCollider';
import { CollisionManifold } from '../helpers/CollisionManifold';
import { Subscribable } from '../helpers';

export interface CollisionDetector {
  readonly onCollisionDetected: Subscribable<CollisionManifold>;
  readonly colliders: RectangleCollider[];
  detectCollisions(): void;
  addCollider(collider: RectangleCollider): void;
  removeCollider(collider: RectangleCollider): void;
  addColliders(colliders: RectangleCollider[]): void;
}
