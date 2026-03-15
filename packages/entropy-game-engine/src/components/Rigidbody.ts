import { Component } from './Component';
import { Vector2 } from '../core/helpers/Vector2';
import { GameObject } from '../game-objects/GameObject';
import { Topic } from '../core/helpers/Topic';
import { SerializedComponent, Subscribable } from '../core';
import { readBoolean, readNumber, readVector2 } from '../core/helpers/Serialization';

export class Rigidbody extends Component {
  public static override readonly typeName: string = 'Rigidbody';
  public readonly velocity: Vector2 = new Vector2(0, 0);
  public useGravity: boolean = false;
  public drag: number = 0;

  /**
   * Mass in KG. 0 represents an infinite mass.
   */
  private _mass: number;
  private _inverseMass: number;
  private _isKinematic: boolean = false;
  private readonly forces: Vector2[] = [];
  private readonly _becameKinematic = new Topic<Rigidbody>();
  private readonly _becameNonKinematic = new Topic<Rigidbody>();

  public constructor(gameObject: GameObject, mass: number = 70, isKinematic: boolean = false) {
    super(gameObject);

    this._mass = mass;
    this._inverseMass = mass !== 0 ? 1 / mass : 0;
    this.isKinematic = isKinematic;
  }

  public static createFromSerialized(gameObject: GameObject, data: Record<string, unknown>): Rigidbody {
    const mass = readNumber(data.mass) ?? 70;
    const isKinematic = readBoolean(data.isKinematic) ?? false;
    const rigidbody = new Rigidbody(gameObject, mass, isKinematic);
    rigidbody.deserialize(data);
    return rigidbody;
  }

  /**
   * Mass in KG. 0 represents an infinite mass.
   */
  public set mass(mass: number) {
    this._mass = mass;
    this._inverseMass = mass !== 0 ? 1 / mass : 0;
  }

  /**
   * Mass in KG. 0 represents an infinite mass.
   */
  public get mass(): number {
    if (this._mass === 0) {
      return Infinity;
    }

    return this._mass;
  }

  public get inverseMass(): number {
    return this._inverseMass;
  }

  public set isKinematic(isKinematic: boolean) {
    this._isKinematic = isKinematic;

    if (isKinematic) {
      this._becameKinematic.publish(this);
    } else {
      this._becameNonKinematic.publish(this);
    }
  }

  public get isKinematic(): boolean {
    return this._isKinematic;
  }

  public get becameKinematic(): Subscribable<Rigidbody> {
    return this._becameKinematic;
  }

  public get becameNonKinematic(): Subscribable<Rigidbody> {
    return this._becameNonKinematic;
  }

  public override serialize(): SerializedComponent {
    return {
      typeName: this.typeName,
      data: {
        mass: this._mass,
        velocity: {
          x: this.velocity.x,
          y: this.velocity.y
        },
        useGravity: this.useGravity,
        isKinematic: this.isKinematic,
        drag: this.drag
      }
    };
  }

  public override deserialize(data: Record<string, unknown>): void {
    const mass = readNumber(data.mass);
    if (mass !== null) {
      this.mass = mass;
    }

    const velocity = readVector2(data.velocity);
    if (velocity !== null) {
      this.velocity.x = velocity.x;
      this.velocity.y = velocity.y;
    }

    const useGravity = readBoolean(data.useGravity);
    if (useGravity !== null) {
      this.useGravity = useGravity;
    }

    const isKinematic = readBoolean(data.isKinematic);
    if (isKinematic !== null) {
      this.isKinematic = isKinematic;
    }

    const drag = readNumber(data.drag);
    if (drag !== null) {
      this.drag = drag;
    }
  }

  public updatePhysics(deltaTime: number): void {
    this.forces.forEach(force => this.velocity.add(force.divideScalar(this.mass)));
    this.transform.translate(this.velocity.clone().multiplyScalar(deltaTime));
    this.forces.length = 0;
  }

  public addForce(force: Vector2): void {
    this.forces.push(force);
  }
}
