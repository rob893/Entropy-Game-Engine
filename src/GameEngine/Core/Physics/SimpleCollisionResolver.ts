import { CollisionResolver } from '../Interfaces/CollisionResolver';
import { RectangleCollider } from '../../Components/RectangleCollider';
import { Vector2 } from '../Helpers/Vector2';

export class SimpleCollisionResolver implements CollisionResolver {
    public resolveCollisions(colliderA: RectangleCollider, colliderB: RectangleCollider): void {
        if (colliderA.gameObject.id !== 'player' && colliderB.gameObject.id !== 'player') {
            return;
        }
        //console.log(colliderA.)
        const player = colliderA.gameObject.id === 'player' ? colliderA.transform : colliderB.transform;

        const xAxis = Math.abs(colliderA.center.x - colliderB.center.x);
        const yAxis = Math.abs(colliderA.center.y - colliderB.center.y);

        const cw = (colliderA.width / 2) + (colliderB.width / 2);
        const ch = (colliderA.height / 2) + (colliderB.height / 2);

        const ox = Math.abs(xAxis - cw);
        const oy = Math.abs(yAxis - ch);

        const dir = Vector2.clone(colliderA.center).subtract(colliderB.center).normalized;
        const projection = new Vector2(dir.x * (ox + 1), dir.y * (oy + 1));

        if (ox > oy) {
            projection.x = 0;
        }
        else if (ox < oy) {
            projection.y = 0;
        }

        player.position.add(projection);
    }
}