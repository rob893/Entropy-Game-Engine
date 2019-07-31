import { Rigidbody } from "../Components/Rigidbody";
import { RectangleCollider } from "../Components/RectangleCollider";
import { Vector2 } from "./Helpers/Vector2";
import { Geometry } from "./Helpers/Geometry";
import { ICollisionDetector } from "./Interfaces/ICollisionDetector";
import { SpatialHashCollisionDetector } from "./Physics/SpatialHashCollisionDetector";
import { SimpleCollisionDetector } from "./Physics/SimpleCollisionDetector";
import { ICollisionResolver } from "./Interfaces/ICollisionResolver";
import { CollisionResolver } from "./Physics/CollisionResolver";

export class PhysicsEngine {

    public gravity: number;

    private readonly rigidbodies: Rigidbody[];
    private readonly gameCanvas: HTMLCanvasElement;
    private readonly collisionDetector: ICollisionDetector;
    private readonly collisionResolver: ICollisionResolver;


    private constructor(gameCanvas: HTMLCanvasElement, collisionDetector: ICollisionDetector, collisionResolver: ICollisionResolver) {
        this.gameCanvas = gameCanvas;
        this.rigidbodies = [];
        this.gravity = 665;
        this.collisionDetector = collisionDetector;
        this.collisionResolver = collisionResolver;
        this.collisionDetector.onCollisionDetected.add((colliderA, colliderB) => this.resolveCollisions(colliderA, colliderB));
    }

    public static buildPhysicsEngine(gameCanvas: HTMLCanvasElement) : PhysicsEngine {
        let collisionDetector = new SpatialHashCollisionDetector(gameCanvas.width, gameCanvas.height, 100);
        let collisionResolver = new CollisionResolver();

        const engine = new PhysicsEngine(gameCanvas, collisionDetector, collisionResolver);
        
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