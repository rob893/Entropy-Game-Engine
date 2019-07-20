import { RectangleCollider } from "../../Components/RectangleCollider";

export interface ICollisionResolver {
    resolveCollisions(colliderA: RectangleCollider, colliderB: RectangleCollider): void;
}