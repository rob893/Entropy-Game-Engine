import { RectangleCollider } from '../../Components/RectangleCollider';

export interface CollisionResolver {
    resolveCollisions(colliderA: RectangleCollider, colliderB: RectangleCollider): void;
}