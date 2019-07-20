import { Vector2 } from "./Vector2";
import { Geometry } from "./Geometry";
import { SpatialHashDetector } from "./SpatialHashDetector";
export class PhysicsEngine {
    constructor(gameCanvas) {
        this.gameCanvas = gameCanvas;
        this.rigidbodies = [];
        this.gravity = 665;
        this.collisionDetector = new SpatialHashDetector(gameCanvas.width, gameCanvas.height, 100);
    }
    static get instance() {
        if (this._instance === null || this._instance === undefined) {
            throw new Error('The instance has not been built yet. Call the buildInstance() function first.');
        }
        return this._instance;
    }
    static buildPhysicsEngine(gameCanvas) {
        this._instance = new PhysicsEngine(gameCanvas);
        return this._instance;
    }
    get colliders() {
        return this.collisionDetector.colliders;
    }
    updatePhysics() {
        this.collisionDetector.detectCollisions();
    }
    addRigidbody(rb) {
        this.rigidbodies.push(rb);
    }
    addCollider(collider) {
        this.collisionDetector.addCollider(collider);
    }
    static raycast(origin, direction, distance) {
        let result = null;
        let hitColliders = PhysicsEngine.raycastAll(origin, direction, distance);
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
        for (let collider of PhysicsEngine.instance.colliders) {
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
//# sourceMappingURL=PhysicsEngine.js.map