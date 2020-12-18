import { Component } from './Component';
import { Vector2 } from '../core/helpers/Vector2';
import { GameObject } from '../game-objects/GameObject';
import { Topic } from '../core/helpers/Topic';
import { Subscribable } from '../core';

export class Rigidbody extends Component {
  public readonly velocity: Vector2 = Vector2.zero;

  /**
   * Mass in KG. 0 represents an infinite mass.
   */
  private _mass: number;
  private _inverseMass: number;
  private _isKinomatic: boolean = false;
  private readonly forces: Vector2[] = [];
  private readonly _becameKinomatic = new Topic<Rigidbody>();
  private readonly _becameNonKinomatic = new Topic<Rigidbody>();

  public constructor(gameObject: GameObject, mass: number = 70, isKinomatic: boolean = false) {
    super(gameObject);

    this._mass = mass;
    this._inverseMass = mass !== 0 ? 1 / mass : 0;
    this.isKinomatic = isKinomatic;
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

  public set isKinomatic(isKinomatic: boolean) {
    this._isKinomatic = isKinomatic;

    if (isKinomatic) {
      this._becameKinomatic.publish(this);
    } else {
      this._becameNonKinomatic.publish(this);
    }
  }

  public get isKinomatic(): boolean {
    return this._isKinomatic;
  }

  public get becameKinomatic(): Subscribable<Rigidbody> {
    return this._becameKinomatic;
  }

  public get becameNonKinomatic(): Subscribable<Rigidbody> {
    return this._becameNonKinomatic;
  }

  public updatePhysics(): void {
    this.forces.forEach(force => this.velocity.add(force.divideScalar(this.mass)));
    this.forces.length = 0;

    this.transform.translate(this.velocity);
  }

  public addForce(force: Vector2): void {
    this.forces.push(force);
  }
}
