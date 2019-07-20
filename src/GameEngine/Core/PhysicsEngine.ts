import { Rigidbody } from "../Components/Rigidbody";
import { RectangleCollider } from "../Components/RectangleCollider";
import { Vector2 } from "./Vector2";
import { Geometry } from "./Geometry";
import { ICollisionDetector } from "./Interfaces/ICollisionDetector";
import { SpatialHashCollisionDetector } from "./SpatialHashCollisionDetector";
import { SimpleCollisionDetector } from "./SimpleCollisionDetector";

export class PhysicsEngine {

    private static _instance: PhysicsEngine;

    public gravity: number;

    private readonly rigidbodies: Rigidbody[];
    private readonly gameCanvas: HTMLCanvasElement;
    private readonly collisionDetector: ICollisionDetector;


    private constructor(gameCanvas: HTMLCanvasElement) {
        this.gameCanvas = gameCanvas;
        this.rigidbodies = [];
        this.gravity = 665;
        this.collisionDetector = new SpatialHashCollisionDetector(gameCanvas.width, gameCanvas.height, 100);
        //this.collisionDetector.onCollisionDetected.add((a, b) => this.test(a, b));
    }

    public static get instance(): PhysicsEngine {
        if (this._instance === null || this._instance === undefined) {
            throw new Error('The instance has not been built yet. Call the buildInstance() function first.');
        }

        return this._instance;
    }

    public static buildPhysicsEngine(gameCanvas: HTMLCanvasElement) : PhysicsEngine {
        this._instance = new PhysicsEngine(gameCanvas);
        
        return this._instance;
    }

    private test(a: RectangleCollider, b: RectangleCollider): void {
        //console.log(a.gameObject.id + ' collided with ' + b.gameObject.id);
    }

    public get colliders(): RectangleCollider[] {
        return this.collisionDetector.colliders;
    }

    public updatePhysics(): void {
        this.collisionDetector.detectCollisions();
    }

    public addRigidbody(rb: Rigidbody): void {
        this.rigidbodies.push(rb);
    }

    public addCollider(collider: RectangleCollider): void {
        this.collisionDetector.addCollider(collider);
    }

    public static raycast(origin: Vector2, direction: Vector2, distance: number): RectangleCollider | null {
        let result: RectangleCollider = null;
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