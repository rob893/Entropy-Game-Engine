import { SpatialHashCollisionDetector } from './Physics/SpatialHashCollisionDetector';
import { SimpleCollisionResolver } from './Physics/CollisionResolver';
export class PhysicsEngine {
    constructor(collisionDetector, collisionResolver) {
        this.rigidbodies = [];
        this.gravity = 665;
        this.collisionDetector = collisionDetector;
        this.collisionResolver = collisionResolver;
        this.collisionDetector.onCollisionDetected.add((colliderA, colliderB) => this.resolveCollisions(colliderA, colliderB));
    }
    static buildPhysicsEngine(gameCanvas) {
        const collisionDetector = new SpatialHashCollisionDetector(gameCanvas.width, gameCanvas.height, 100);
        const collisionResolver = new SimpleCollisionResolver();
        const engine = new PhysicsEngine(collisionDetector, collisionResolver);
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