import { Rigidbody } from '../Components/Rigidbody';
import { RectangleCollider } from '../Components/RectangleCollider';
import { CollisionDetector } from './Interfaces/CollisionDetector';
import { CollisionResolver } from './Interfaces/CollisionResolver';
import { CollisionManifold } from './Helpers/CollisionManifold';
import { Vector2 } from './Helpers/Vector2';
import { Time } from './Time';
import { Component } from '../Components/Component';

export class PhysicsEngine {
  public gravity: number;

  private readonly rigidbodies: Rigidbody[];
  private readonly collisionDetector: CollisionDetector;
  private readonly collisionResolver: CollisionResolver;
  private readonly time: Time;

  public constructor(collisionDetector: CollisionDetector, collisionResolver: CollisionResolver, time: Time) {
    this.rigidbodies = [];
    this.gravity = 665;
    this.collisionDetector = collisionDetector;
    this.collisionResolver = collisionResolver;
    this.collisionDetector.onCollisionDetected.add(manifold => this.resolveCollisions(manifold));

    this.time = time;
  }

  public get colliders(): RectangleCollider[] {
    return this.collisionDetector.colliders;
  }

  public getPossibleColliders(origin: Vector2, radius: number): RectangleCollider[] {
    return [];
  }

  public updatePhysics(): void {
    this.collisionDetector.detectCollisions();
    this.rigidbodies.forEach(rb => {
      rb.addForce(Vector2.down.multiplyScalar(this.gravity).multiplyScalar(this.time.deltaTime)); //add gravity
      rb.updatePhysics();
    });
  }

  public addRigidbody(rb: Rigidbody): void {
    if (!rb.isKinomatic) {
      this.rigidbodies.push(rb);
    }

    rb.becameKinomatic.add(this.removeKinomaticRigidbody);
    rb.becameNonKinomatic.add(this.addNonKinomaticRigidbody);
    rb.onDestroyed.add(this.removeKinomaticRigidbody);
  }

  public addCollider(collider: RectangleCollider): void {
    this.collisionDetector.addCollider(collider);
    collider.onDestroyed.add(this.removeColliderFromDetector);
  }

  private resolveCollisions(collisionManifold: CollisionManifold | undefined): void {
    if (collisionManifold === undefined) {
      throw new Error('Invalid');
    }

    this.collisionResolver.resolveCollisions(collisionManifold);
  }

  private readonly addNonKinomaticRigidbody = (rb: Rigidbody | undefined): void => {
    if (rb === undefined) {
      throw new Error('Invalid input');
    }

    this.rigidbodies.push(rb);
  };

  private readonly removeKinomaticRigidbody = (rb: Component | undefined): void => {
    if (!(rb instanceof Rigidbody)) {
      throw new Error('Invalid component passed in');
    }

    const index = this.rigidbodies.indexOf(rb);

    if (index !== -1) {
      this.rigidbodies.splice(index, 1);
    }
  };

  private readonly removeColliderFromDetector = (collider: Component | undefined): void => {
    if (!(collider instanceof RectangleCollider)) {
      console.error('Invalid component. Expecting RectangleCollider');
      return;
    }

    this.collisionDetector.removeCollider(collider);
  };
}
