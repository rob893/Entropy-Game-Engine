import { Vector2 } from "../Helpers/Vector2";
import { RectangleCollider } from "../../Components/RectangleCollider";
import { PhysicsEngine } from "../PhysicsEngine";
import { Geometry } from "../Helpers/Geometry";

export abstract class Physics {
    
    public static raycast(origin: Vector2, direction: Vector2, distance: number): RectangleCollider | null {
        let result: RectangleCollider = null;
        let hitColliders = Physics.raycastAll(origin, direction, distance);
        let closestColliderDistance = -10;

        for (let collider of hitColliders) {
            let colliderDistance = Vector2.distance(origin, collider.transform.position);

            if (colliderDistance > closestColliderDistance) {
                result = collider;
                closestColliderDistance = colliderDistance;
            }
        }
        
        return result;
    }

    public static raycastAll(origin: Vector2, direction: Vector2, distance: number): RectangleCollider[] {
        let results: RectangleCollider[] = [];
        let terminalPoint = Vector2.add(origin, direction.multiplyScalar(distance));

        for (let collider of PhysicsEngine.instance.colliders) {
            if (Geometry.doIntersectRectangle(origin, terminalPoint, collider.topLeft, collider.topRight, collider.bottomLeft, collider.bottomRight)) {
                results.push(collider);
            }
        }

        return results;
    }

    public static sphereCast() {}

    public static overlapSphere(): RectangleCollider[] { 
        return [];
    }
}