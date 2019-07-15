import { Vector2 } from "./Vector2";
import { Geometry } from "./Geometry";
export class Physics {
    constructor() {
        this.rigidbodies = [];
        this.colliders = [];
        this.gravity = 1;
    }
    static get Instance() {
        return this.instance || (this.instance = new Physics());
    }
    addRigidbody(rb) {
        this.rigidbodies.push(rb);
    }
    addCollider(collider) {
        this.colliders.push(collider);
    }
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
        for (let collider of Physics.Instance.colliders) {
            if (Geometry.doIntersectRectangle(origin, terminalPoint, collider.topLeft, collider.topRight, collider.bottomLeft, collider.bottomRight)) {
                results.push(collider);
            }
        }
        return results;
    }
    static sphereCast() { }
    static overlapSphere() { return []; }
}
//# sourceMappingURL=Physics.js.map