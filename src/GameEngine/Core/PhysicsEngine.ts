import { Rigidbody } from '../Components/Rigidbody';
import { RectangleCollider } from '../Components/RectangleCollider';
import { CollisionDetector } from './Interfaces/CollisionDetector';
import { SpatialHashCollisionDetector } from './Physics/SpatialHashCollisionDetector';
import { CollisionResolver } from './Interfaces/CollisionResolver';
import { SimpleCollisionResolver } from './Physics/CollisionResolver';

export class PhysicsEngine {

    public gravity: number;

    private readonly rigidbodies: Rigidbody[];
    private readonly collisionDetector: CollisionDetector;
    private readonly collisionResolver: CollisionResolver;


    private constructor(collisionDetector: CollisionDetector, collisionResolver: CollisionResolver) {
        this.rigidbodies = [];
        this.gravity = 665;
        this.collisionDetector = collisionDetector;
        this.collisionResolver = collisionResolver;
        this.collisionDetector.onCollisionDetected.add((colliderA, colliderB) => this.resolveCollisions(colliderA, colliderB));
    }

    public static buildPhysicsEngine(gameCanvas: HTMLCanvasElement): PhysicsEngine {
        const collisionDetector = new SpatialHashCollisionDetector(gameCanvas.width, gameCanvas.height, 100);
        const collisionResolver = new SimpleCollisionResolver();

        const engine = new PhysicsEngine(collisionDetector, collisionResolver);
        
        return engine;
    }

    public get colliders(): RectangleCollider[] {
        return this.collisionDetector.colliders;
    }

    public updatePhysics(): void {
        this.collisionDetector.detectCollisions();
        this.rigidbodies.forEach(rb => rb.updatePhysics());
    }

    public addRigidbody(rb: Rigidbody): void {
        this.rigidbodies.push(rb);
    }

    public addCollider(collider: RectangleCollider): void {
        this.collisionDetector.addCollider(collider);
    }

    private resolveCollisions(colliderA: RectangleCollider, colliderB: RectangleCollider): void {
        this.collisionResolver.resolveCollisions(colliderA, colliderB);
    }
}