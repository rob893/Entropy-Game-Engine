import { SpatialHashCollisionDetector } from "./Physics/SpatialHashCollisionDetector";
import { CollisionResolver } from "./Physics/CollisionResolver";
export class PhysicsEngine {
    constructor(gameCanvas, collisionDetector, collisionResolver) {
        this.gameCanvas = gameCanvas;
        this.rigidbodies = [];
        this.gravity = 665;
        this.collisionDetector = collisionDetector;
        this.collisionResolver = collisionResolver;
        this.collisionDetector.onCollisionDetected.add((colliderA, colliderB) => this.resolveCollisions(colliderA, colliderB));
    }
    static buildPhysicsEngine(gameCanvas) {
        let collisionDetector = new SpatialHashCollisionDetector(gameCanvas.width, gameCanvas.height, 100);
        let collisionResolver = new CollisionResolver();
        const engine = new PhysicsEngine(gameCanvas, collisionDetector, collisionResolver);
        return engine;
    }
    get colliders() {
        return this.collisionDetector.colliders;
    }
    updatePhysics() {
        this.collisionDetector.detectCollisions();
        this.rigidbodies.forEach(rb => rb.updatePhysics());
    }
    addRigidbody(rb) {
        this.rigidbodies.push(rb);
    }
    addCollider(collider) {
        this.collisionDetector.addCollider(collider);
    }
    resolveCollisions(colliderA, colliderB) {
        this.collisionResolver.resolveCollisions(colliderA, colliderB);
    }
}
//# sourceMappingURL=PhysicsEngine.js.map