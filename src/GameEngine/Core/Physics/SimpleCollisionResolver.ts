import { CollisionResolver } from '../Interfaces/CollisionResolver';
import { RectangleCollider } from '../../Components/RectangleCollider';
import { Vector2 } from '../Helpers/Vector2';
import { Rigidbody } from '../../Components/Rigidbody';

export class SimpleCollisionResolver implements CollisionResolver {

    public resolveCollisions(colliderA: RectangleCollider, colliderB: RectangleCollider): void {
        if (colliderA.isTrigger || colliderB.isTrigger) {
            return;
        }

        if (colliderA.attachedRigidbody === null || colliderB.attachedRigidbody === null) {
            return;
        }

        //this wont work corrct here now since duplicate pairs of colliders (ie: (a, b) (b, a)) are not being computed. Need to implement impulse resolution using rigidbodies

        // if (colliderA.gameObject.id !== 'player') {
        //     return;
        // }

        const xAxis = Math.abs(colliderA.center.x - colliderB.center.x);
        const yAxis = Math.abs(colliderA.center.y - colliderB.center.y);

        const cw = (colliderA.width / 2) + (colliderB.width / 2);
        const ch = (colliderA.height / 2) + (colliderB.height / 2);

        const ox = Math.abs(xAxis - cw);
        const oy = Math.abs(yAxis - ch);

        const dir = Vector2.clone(colliderA.center).subtract(colliderB.center).normalized;
        //const projection = new Vector2(dir.x * (ox + 1), dir.y * (oy + 1));

        const penetration = ox < oy ? oy : ox;

        if (ox > oy) {
            dir.x = 0;
            dir.y = dir.y > 0 ? 1 : -1;
            // projection.x = 0;
            // projection.y = projection.y > 0 ? 1 : -1; 
        }
        else if (ox < oy) {
            dir.y = 0;
            dir.x = dir.x > 0 ? 1 : -1;
            // projection.y = 0;
            // projection.x = projection.x > 0 ? 1 : -1;
        }

        const rbA = colliderA.attachedRigidbody;
        const rbB = colliderB.attachedRigidbody;

        const rv = Vector2.subtract(rbB.velocity, rbA.velocity);

        const velAlongNormal = Vector2.dot(rv, dir);

        if (velAlongNormal < 0) {
            return;
        }

        const e = Math.min(colliderA.physicalMaterial.bounciness, colliderB.physicalMaterial.bounciness);

        let j = -1 * (1 + e) * velAlongNormal;
        j /= (rbA.inverseMass + rbB.inverseMass);

        const impulse = Vector2.multiplyScalar(dir, j);

        const combinedMass = rbA.mass + rbB.mass;

        if (!rbA.isKinomatic) {
            const a = Vector2.multiplyScalar(impulse, rbA.inverseMass);
            a.multiplyScalar(rbA.mass / combinedMass);
            rbA.velocity.subtract(a);
        }

        if (!rbB.isKinomatic) {
            const b = Vector2.multiplyScalar(impulse, rbA.inverseMass);
            b.multiplyScalar(rbA.mass / combinedMass);
            rbB.velocity.add(b);
        }

        this.positionalCorrection(rbA, rbB, dir, penetration);
        
        // const colliderAPos = colliderA.transform.position;

        // while (colliderA.detectCollision(colliderB)) {
        //     colliderAPos.add(dir);
        // }
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