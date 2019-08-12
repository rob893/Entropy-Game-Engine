import { Component } from './Component';
import { Vector2 } from '../Core/Helpers/Vector2';
import { GameObject } from '../Core/GameObject';
import { Time } from '../Core/Time';
import { GameEngine } from '../Core/GameEngine';

export class Rigidbody extends Component {

    // In kg
    public mass: number;
    public isKinomatic: boolean = false;
    public readonly velocity: Vector2;

    //private readonly force: Vector2;
    private readonly forces: Vector2[] = [];


    public constructor(gameObject: GameObject, mass: number = 70) {
        super(gameObject);

        this.mass = mass;
        this.velocity = new Vector2(0, 0);
        //this.force = Vector2.zero;
        GameEngine.instance.physicsEngine.addRigidbody(this);
    }

    public get inverseMass(): number {
        return this.mass !== 0 ? 1 / this.mass : 0;
    }

    public updatePhysics(): void {
        if (this.isKinomatic) {
            return;
        }

        this.forces.forEach(force => this.velocity.add(force.divideScalar(this.mass)));

        this.forces.length = 0;

        //this.addGravity(665);
        //this.velocity.add(this.force.divideScalar(this.mass));
        this.transform.translate(this.velocity);
    }

    public addForce(force: Vector2): void {
        //this.force.add(force);
        this.forces.push(force);
    }

    public addGravity(newtonsDown: number): void {
        this.addForce(Vector2.down.multiplyScalar(newtonsDown).multiplyScalar(Time.DeltaTime));
    }
}