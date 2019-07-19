import { Rigidbody } from "../Components/Rigidbody";
import { RectangleCollider } from "../Components/RectangleCollider";
import { Vector2 } from "./Vector2";
import { Geometry } from "./Geometry";

export class Physics {

    private static _instance: Physics;

    public gravity: number;

    private rigidbodies: Rigidbody[];
    private colliders: RectangleCollider[];


    private constructor() {
        this.rigidbodies = [];
        this.colliders = [];
        this.gravity = 1;
    }

    public static get instance(): Physics {
        return this._instance || (this._instance = new Physics());
    }

    public updatePhysics(): void {
        for (let collider of this.colliders) {
            for (let otherCollider of this.colliders) {
                if (!(collider === otherCollider)) {
                    collider.detectCollision(otherCollider);
                }
            }
        }
    }

    public addRigidbody(rb: Rigidbody): void {
        this.rigidbodies.push(rb);
    }

    public addCollider(collider: RectangleCollider): void {
        this.colliders.push(collider);
    }

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

        for (let collider of Physics.instance.colliders) {
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