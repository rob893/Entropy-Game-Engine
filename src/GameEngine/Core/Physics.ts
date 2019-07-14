import { Rigidbody } from "../Components/Rigidbody";
import { RectangleCollider } from "../Components/RectangleCollider";
import { Vector2 } from "./Vector2";

export class Physics {

    private static instance: Physics;

    public gravity: number;

    private rigidbodies: Rigidbody[];
    private colliders: RectangleCollider[];


    private constructor() {
        this.rigidbodies = [];
        this.colliders = [];
        this.gravity = 1;
    }

    public static get Instance(): Physics {
        return this.instance || (this.instance = new Physics());
    }

    // public updatePhysics(): void {
    //     for(let i: number = 0, l: number = this.rigidbodies.length; i < l; i++) {
    //         this.rigidbodies[i].addGravity(this.gravity);
    //     }
    // }

    public addRigidbody(rb: Rigidbody): void {
        this.rigidbodies.push(rb);
        //this.colliders.push(rb.gameObject.getComponent(RectangleCollider));
    }

    public addCollider(collider: RectangleCollider): void {
        this.colliders.push(collider);
    }

    public static raycast(origin: Vector2, direction: Vector2, distance: number): RectangleCollider | null {
        let terminalPoint = Vector2.add(origin, direction.multiplyScalar(distance));
        
        
        return null;
    }

    public static sphereCast() {}

    public static overlapSphere(): RectangleCollider[] { return [] }

    public static lineLineIntersection(startPointA: Vector2, terminalPointA: Vector2, startPointB: Vector2, terminalPointB: Vector2): boolean {
        let uA = ((terminalPointB.x - startPointB.x) * (startPointA.y - startPointB.y) - (terminalPointB.y - startPointB.y) * (startPointA.x - startPointB.x))
            / ((startPointB.y - startPointB.y) * (terminalPointA.x - startPointA.x) - (terminalPointB.x - startPointB.x) * (terminalPointA.y - startPointA.y));

        // float uA = ((x4-x3)*(y1-y3) - (y4-y3)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));

        // float uB = ((x2-x1)*(y1-y3) - (y2-y1)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
        
        return false;
    }
}