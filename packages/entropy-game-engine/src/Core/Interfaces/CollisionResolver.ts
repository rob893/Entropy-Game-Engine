import { CollisionManifold } from '../helpers/CollisionManifold';

export interface CollisionResolver {
  resolveCollisions(collisionManifold: CollisionManifold): void;
}
