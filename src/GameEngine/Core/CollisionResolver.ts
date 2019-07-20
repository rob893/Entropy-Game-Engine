import { ICollisionResolver } from "./Interfaces/ICollisionResolver";
import { RectangleCollider } from "../Components/RectangleCollider";

export class CollisionResolver implements ICollisionResolver {
    resolveCollisions(colliderA: RectangleCollider, colliderB: RectangleCollider): void {
        //console.log(colliderA + ' has collided with ' + colliderB);
    }
}