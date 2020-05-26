import { CollisionDetector } from './CollisionDetector';
import { CollisionResolver } from './CollisionResolver';

export interface GameEngineOptions {
  collisionDetectorGenerator?: () => CollisionDetector;
  collisionResolverGenerator?: () => CollisionResolver;
}
