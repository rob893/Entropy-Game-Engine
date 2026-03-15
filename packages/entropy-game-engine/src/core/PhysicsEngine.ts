import { Rigidbody } from '../components/Rigidbody';
import { RectangleCollider } from '../components/RectangleCollider';
import type { ICollisionDetector } from './types';
import type { ICollisionResolver } from './types';
import type { CollisionManifold } from './helpers/CollisionManifold';
import { Vector2 } from './helpers/Vector2';
import type { Component } from '../components/Component';

export class PhysicsEngine {
  public gravity: number;

  private readonly rigidbodies: Rigidbody[];
  private readonly collisionDetector: ICollisionDetector;
  private readonly collisionResolver: ICollisionResolver;

  public constructor(collisionDetector: ICollisionDetector, collisionResolver: ICollisionResolver) {
    this.rigidbodies = [];
    this.gravity = 665;
    this.collisionDetector = collisionDetector;
    this.collisionResolver = collisionResolver;
    this.collisionDetector.onCollisionDetected.subscribe(manifold => this.resolveCollisions(manifold));
  }

  public get colliders(): RectangleCollider[] {
    return this.collisionDetector.colliders;
  }

  public getPossibleColliders(origin: Vector2, radius: number): RectangleCollider[] {
    return [];
  }

  public updatePhysics(fixedDeltaTime: number): void {
    this.rigidbodies.forEach(rb => {
      if (!rb.enabled || rb.isKinematic) {
        return;
      }

      rb.velocity.add(new Vector2(0, this.gravity * fixedDeltaTime));
      rb.updatePhysics(fixedDeltaTime);
    });

    this.collisionDetector.detectCollisions();
  }

  public addRigidbody(rb: Rigidbody): void {
    if (!rb.isKinematic) {
      this.rigidbodies.push(rb);
    }

    rb.becameKinematic.subscribe(this.removeKinematicRigidbody);
    rb.becameNonKinematic.subscribe(this.addNonKinematicRigidbody);
    rb.onDestroyed.subscribe(this.removeKinematicRigidbody);
  }

  public addCollider(collider: RectangleCollider): void {
    this.collisionDetector.addCollider(collider);
    collider.onDestroyed.subscribe(this.removeColliderFromDetector);
  }

  private resolveCollisions(collisionManifold: CollisionManifold | undefined): void {
    if (collisionManifold === undefined) {
      throw new Error('Invalid');
    }

    this.collisionResolver.resolveCollisions(collisionManifold);
  }

  private readonly addNonKinematicRigidbody = (rb: Rigidbody | undefined): void => {
    if (rb === undefined) {
      throw new Error('Invalid input');
    }

    this.rigidbodies.push(rb);
  };

  private readonly removeKinematicRigidbody = (rb: Component | undefined): void => {
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
