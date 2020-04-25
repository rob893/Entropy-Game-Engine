import { Vector2 } from '../Helpers/Vector2';
import { RectangleCollider } from '../../Components/RectangleCollider';
import { Geometry } from '../Helpers/Geometry';
import { PhysicsEngine } from '../PhysicsEngine';
import { Layer } from '../Enums/Layer';

export class Physics {
  private readonly physicsEngine: PhysicsEngine;

  public constructor(physicsEngine: PhysicsEngine) {
    this.physicsEngine = physicsEngine;
  }

  public pointRaycastToScreen(point: Vector2): RectangleCollider | null {
    for (const collider of this.physicsEngine.colliders) {
      if (Geometry.rectangleContainsPoint(collider.topLeft, collider.bottomRight, point)) {
        return collider;
      }
    }

    return null;
  }

  public raycast(origin: Vector2, direction: Vector2, distance: number): RectangleCollider | null {
    let result: RectangleCollider | null = null;
    const hitColliders = this.raycastAll(origin, direction, distance);
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

  public raycastAll(origin: Vector2, direction: Vector2, distance: number): RectangleCollider[] {
    const results: RectangleCollider[] = [];
    const terminalPoint = Vector2.add(origin, direction.multiplyScalar(distance));

    for (const collider of this.physicsEngine.colliders) {
      if (
        Geometry.doIntersectRectangle(
          origin,
          terminalPoint,
          collider.topLeft,
          collider.topRight,
          collider.bottomLeft,
          collider.bottomRight
        )
      ) {
        results.push(collider);
      }
    }

    return results;
  }

  public sphereCast(): void {}

  public overlapSphere(position: Vector2, radius: number, layer?: Layer): RectangleCollider[] {
    const colliders: RectangleCollider[] = [];

    for (const collider of this.physicsEngine.colliders) {
      if (layer !== undefined && collider.gameObject.layer !== layer) {
        continue;
      }

      if (Vector2.distance(position, collider.transform.position) <= radius) {
        colliders.push(collider);
      }
    }

    return colliders;
  }
}
