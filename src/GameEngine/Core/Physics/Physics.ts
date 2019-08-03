import { Vector2 } from '../Helpers/Vector2';
import { RectangleCollider } from '../../Components/RectangleCollider';
import { Geometry } from '../Helpers/Geometry';
import { GameEngine } from '../GameEngine';

export abstract class Physics {
    
    public static raycast(origin: Vector2, direction: Vector2, distance: number): RectangleCollider | null {
        let result: RectangleCollider = null;
        const hitColliders = Physics.raycastAll(origin, direction, distance);
        let closestColliderDistance = -10;

        for (const collider of hitColliders) {
            const colliderDistance = Vector2.distance(origin, collider.transform.position);

            if (colliderDistance > closestColliderDistance) {
                result = collider;
                closestColliderDistance = colliderDistance;
            }
        }
        
        return result;
    }

    public static raycastAll(origin: Vector2, direction: Vector2, distance: number): RectangleCollider[] {
        const results: RectangleCollider[] = [];
        const terminalPoint = Vector2.add(origin, direction.multiplyScalar(distance));

        for (const collider of GameEngine.instance.physicsEngine.colliders) {
            if (Geometry.doIntersectRectangle(origin, terminalPoint, collider.topLeft, collider.topRight, collider.bottomLeft, collider.bottomRight)) {
                results.push(collider);
            }
        }

        return results;
    }

    public static sphereCast(): void {}

    public static overlapSphere(): RectangleCollider[] { 
        return [];
    }
}