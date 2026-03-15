import type { ICollisionResolver } from '../types';
import { Vector2 } from '../helpers/Vector2';
import type { Rigidbody } from '../../components/Rigidbody';
import type { CollisionManifold } from '../helpers/CollisionManifold';

export class ImpulseCollisionResolver implements ICollisionResolver {
  public resolveCollisions(collisionManifold: CollisionManifold): void {
    const { colliderA } = collisionManifold;
    const { colliderB } = collisionManifold;

    if (colliderA.isTrigger || colliderB.isTrigger) {
      return;
    }

    if (colliderA.attachedRigidbody === null || colliderB.attachedRigidbody === null) {
      return;
    }

    const { collisionNormal } = collisionManifold;

    const rbA = colliderA.attachedRigidbody;
    const rbB = colliderB.attachedRigidbody;

    const rv = Vector2.subtract(rbB.velocity, rbA.velocity);

    const velAlongNormal = Vector2.dot(rv, collisionNormal);

    if (velAlongNormal < 0) {
      return;
    }

    const e = Math.min(colliderA.physicalMaterial.bounciness, colliderB.physicalMaterial.bounciness);
    const inverseMassSum = rbA.inverseMass + rbB.inverseMass;

    if (inverseMassSum === 0) {
      return;
    }

    let j = -1 * (1 + e) * velAlongNormal;
    j /= inverseMassSum;

    const impulse = Vector2.multiplyScalar(collisionNormal, j);

    let tangent = rv.clone();
    tangent.subtract(Vector2.multiplyScalar(collisionNormal, Vector2.dot(rv, collisionNormal)));

    if (!tangent.equals(0, 0)) {
      tangent = tangent.normalized;
    }

    let jt = -1 * Vector2.dot(rv, tangent);
    jt /= inverseMassSum;

    const mu = Math.sqrt(colliderA.physicalMaterial.staticFriction * colliderB.physicalMaterial.staticFriction);

    let frictionImpulse: Vector2;
    if (Math.abs(jt) < j * mu) {
      frictionImpulse = tangent.clone().multiplyScalar(jt);
    } else {
      const dynamicFriction = Math.sqrt(
        colliderA.physicalMaterial.dynamicFriction * colliderB.physicalMaterial.dynamicFriction
      );
      frictionImpulse = tangent.clone().multiplyScalar(j * dynamicFriction);
    }

    if (!rbA.isKinematic) {
      rbA.velocity.subtract(impulse.clone().multiplyScalar(rbA.inverseMass));
      rbA.velocity.subtract(frictionImpulse.clone().multiplyScalar(rbA.inverseMass));
    }

    if (!rbB.isKinematic) {
      rbB.velocity.add(impulse.clone().multiplyScalar(rbB.inverseMass));
      rbB.velocity.add(frictionImpulse.clone().multiplyScalar(rbB.inverseMass));
    }

    this.positionalCorrection(rbA, rbB, collisionNormal, collisionManifold.penetrationDepth);
  }

  private positionalCorrection(rbA: Rigidbody, rbB: Rigidbody, normal: Vector2, penetration: number): void {
    const percent = 0.2; // usually 20% to 80%
    const slop = 0.01; // usually 0.01 to 0.1
    const correction = (Math.max(penetration - slop, 0) / (rbA.inverseMass + rbB.inverseMass)) * percent;
    const correctionVector = normal.clone().multiplyScalar(correction);

    if (!rbA.isKinematic) {
      rbA.transform.position.add(correctionVector.clone().multiplyScalar(rbA.inverseMass));
    }

    if (!rbB.isKinematic) {
      rbB.transform.position.subtract(correctionVector.clone().multiplyScalar(rbB.inverseMass));
    }
  }
}

