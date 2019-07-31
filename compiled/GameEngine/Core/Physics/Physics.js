import { Vector2 } from "../Helpers/Vector2";
import { Geometry } from "../Helpers/Geometry";
import { GameEngine } from "../GameEngine";
export class Physics {
    static raycast(origin, direction, distance) {
        let result = null;
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
    static raycastAll(origin, direction, distance) {
        let results = [];
        let terminalPoint = Vector2.add(origin, direction.multiplyScalar(distance));
        for (let collider of GameEngine.instance.physicsEngine.colliders) {
            if (Geometry.doIntersectRectangle(origin, terminalPoint, collider.topLeft, collider.topRight, collider.bottomLeft, collider.bottomRight)) {
                results.push(collider);
            }
        }
        return results;
    }
    static sphereCast() { }
    static overlapSphere() {
        return [];
    }
}
//# sourceMappingURL=Physics.js.map