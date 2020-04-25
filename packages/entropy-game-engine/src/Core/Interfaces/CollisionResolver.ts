import { CollisionManifold } from '../Helpers/CollisionManifold';

export interface CollisionResolver {
  resolveCollisions(collisionManifold: CollisionManifold): void;
}
