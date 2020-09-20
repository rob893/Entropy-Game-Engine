import { CollisionResolver } from '../interfaces/CollisionResolver';
import { Vector2 } from '../helpers/Vector2';
import { Rigidbody } from '../../components/Rigidbody';
import { CollisionManifold } from '../helpers/CollisionManifold';

export class ImpulseCollisionResolver implements CollisionResolver {
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

    let j = -1 * (1 + e) * velAlongNormal;
    j /= rbA.inverseMass + rbB.inverseMass;

    const impulse = Vector2.multiplyScalar(collisionNormal, j);

    let tangent = rv.clone();
    tangent.subtract(Vector2.multiplyScalar(collisionNormal, Vector2.dot(rv, collisionNormal)));

    if (!tangent.equals(0, 0)) {
      tangent = tangent.normalized;
    }

    let jt = -1 * Vector2.dot(rv, tangent);
    jt /= 1 / rbA.mass + 1 / rbB.mass;

    const mu = colliderA.physicalMaterial.staticFriction ** 2 + colliderB.physicalMaterial.staticFriction ** 2;

    let frictionImpulse: Vector2;
    if (Math.abs(jt) < j * mu) {
      frictionImpulse = tangent.multiplyScalar(jt);
    } else {
      const dynamicFriction =
        colliderA.physicalMaterial.dynamicFriction ** 2 + colliderB.physicalMaterial.dynamicFriction ** 2;
      frictionImpulse = tangent.multiplyScalar(j * dynamicFriction);
    }

    const combinedMass = rbA.mass + rbB.mass;

    if (!rbA.isKinomatic) {
      rbA.addForce(Vector2.multiplyScalar(impulse, -1 * (rbB.mass / combinedMass)));
      rbA.addForce(Vector2.multiplyScalar(frictionImpulse, -1));
    }

    if (!rbB.isKinomatic) {
      rbB.addForce(Vector2.multiplyScalar(impulse, rbA.mass / combinedMass));
      rbB.addForce(frictionImpulse);
    }

    this.positionalCorrection(rbA, rbB, collisionNormal, collisionManifold.penetrationDepth);
  }

  private positionalCorrection(rbA: Rigidbody, rbB: Rigidbody, normal: Vector2, penetration: number): void {
    const percent = 0.2; // usually 20% to 80%
    const slop = 0.01; // usually 0.01 to 0.1
    const correction = (Math.max(penetration - slop, 0) / (rbA.inverseMass + rbB.inverseMass)) * percent;
    const correctionVector = normal.clone().multiplyScalar(correction);

    if (!rbA.isKinomatic) {
      rbA.transform.position.add(correctionVector.clone().multiplyScalar(rbA.inverseMass));
    }

    if (!rbB.isKinomatic) {
      rbB.transform.position.subtract(correctionVector.clone().multiplyScalar(rbB.inverseMass));
    }
  }
}
