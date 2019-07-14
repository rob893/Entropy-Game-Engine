import { Component } from "./Component";
import { Vector2 } from "../Core/Vector2";
import { Transform } from "./Transform";
import { GameObject } from "../Core/GameObject";
import { Physics } from "../Core/Physics";
import { Time } from "../Core/Time";

export class Rigidbody extends Component {

    // In kg
    public mass: number;
    public isKinomatic: boolean = false;
    private velocity: Vector2;
    private acceleration: Vector2;
    
    private force: Vector2;
    private transform: Transform;


    public constructor(gameObject: GameObject, mass: number = 70) {
        super(gameObject);

        this.transform = gameObject.getTransform();
        this.mass = mass;
        this.velocity = new Vector2(0, 0);
        this.acceleration = new Vector2(0, 0);
        this.force = Vector2.zero;
        Physics.Instance.addRigidbody(this);
    }

    public update(): void {
        if (this.isKinomatic) {
            return;
        }

        this.addGravity(665);
        this.velocity.add(this.force.divideScalar(this.mass));
        this.transform.translate(this.velocity);
    }

    public addForce(force: Vector2): void {
        this.force.add(force);
    }

    public addGravity(newtonsDown: number): void {
        this.addForce(Vector2.down.multiplyScalar(newtonsDown).multiplyScalar(Time.DeltaTime));
    }

    public resetForce(): void {
        this.force.zero();
        this.velocity.zero();
    }
}