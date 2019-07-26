import { ICollisionResolver } from "../Interfaces/ICollisionResolver";
import { RectangleCollider } from "../../Components/RectangleCollider";

export class CollisionResolver implements ICollisionResolver {
    resolveCollisions(colliderA: RectangleCollider, colliderB: RectangleCollider): void {
        // if (colliderA.attachedRigidbody !== null && !colliderA.attachedRigidbody.isKinomatic) {
        //     //if (colliderA.gameObject.id === 'player') {debugger}
        //     while (colliderA.bottomLeft.y >= colliderB.topLeft.y) {
        //         colliderA.transform.position.y -= 1;
        //     }
        //     colliderA.attachedRigidbody.resetForce();
        //     // while (colliderA.topLeft.x <= colliderB.topRight.x) {
        //     //     colliderA.transform.position.x += 1;
        //     // }
        // }

        // if (colliderB.attachedRigidbody !== null && !colliderB.attachedRigidbody.isKinomatic) {
        //     while (colliderB.bottomLeft.y >= colliderA.topLeft.y) {
        //         colliderB.transform.position.y -= 1;
        //     }
        //     colliderB.attachedRigidbody.resetForce();
        //     // while (colliderB.topLeft.x <= colliderA.topRight.x) {
        //     //     colliderB.transform.position.x += 1;
        //     // }
        // }
    }
}