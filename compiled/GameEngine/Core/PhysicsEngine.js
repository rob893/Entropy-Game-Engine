import { SpatialHashCollisionDetector } from "./SpatialHashCollisionDetector";
import { CollisionResolver } from "./CollisionResolver";
export class PhysicsEngine {
    constructor(gameCanvas, collisionDetector, collisionResolver) {
        this.gameCanvas = gameCanvas;
        this.rigidbodies = [];
        this.gravity = 665;
        this.collisionDetector = collisionDetector;
        this.collisionResolver = collisionResolver;
        this.collisionDetector.onCollisionDetected.add((colliderA, colliderB) => this.resolveCollisions(colliderA, colliderB));
    }
    static get instance() {
        if (this._instance === null || this._instance === undefined) {
            throw new Error('The instance has not been built yet. Call the buildInstance() function first.');
        }
        return this._instance;
    }
    static buildPhysicsEngine(gameCanvas) {
        let collisionDetector = new SpatialHashCollisionDetector(gameCanvas.width, gameCanvas.height, 100);
        let collisionResolver = new CollisionResolver();
        this._instance = new PhysicsEngine(gameCanvas, collisionDetector, collisionResolver);
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
    resolveCollisions(colliderA, colliderB) {
        this.collisionResolver.resolveCollisions(colliderA, colliderB);
    }
}
//# sourceMappingURL=PhysicsEngine.js.map