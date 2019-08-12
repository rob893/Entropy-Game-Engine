import { CollisionResolver } from '../Interfaces/CollisionResolver';
import { RectangleCollider } from '../../Components/RectangleCollider';
import { Vector2 } from '../Helpers/Vector2';

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

        const e = Math.min(1, 1);

        let j = -1 * (1 + e) * velAlongNormal;
        j /= (rbA.inverseMass + rbB.inverseMass);

        const impulse = Vector2.multiplyScalar(dir, j);

        if (!rbA.isKinomatic) {
            rbA.velocity.subtract(Vector2.multiplyScalar(impulse, rbA.inverseMass));
        }

        if (!rbB.isKinomatic) {
            rbB.velocity.add(Vector2.multiplyScalar(impulse, rbB.inverseMass));
        }
        
        // const colliderAPos = colliderA.transform.position;

        // while (colliderA.detectCollision(colliderB)) {
        //     colliderAPos.add(dir);
        // }
    }
}