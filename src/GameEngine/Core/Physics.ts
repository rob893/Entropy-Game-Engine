import { Rigidbody } from "../Components/Rigidbody";
import { RectangleCollider } from "../Components/RectangleCollider";

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

    public updatePhysics(): void {
        for(let i: number = 0, l: number = this.rigidbodies.length; i < l; i++) {
            this.rigidbodies[i].addGravity(this.gravity);
        }
    }

    public addRigidbody(rb: Rigidbody): void {
        this.rigidbodies.push(rb);
    }

    public static raycast() {}

    public static sphereCast() {}

    public static overlapSphere(): RectangleCollider[] { return [] }
}