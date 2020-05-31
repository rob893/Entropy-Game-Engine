import { BaseCollisionDetector } from './BaseCollisionDetector';

export class SimpleCollisionDetector extends BaseCollisionDetector {
  public detectCollisions(): void {
    for (let i = 0; i < this.colliders.length - 1; i++) {
      const collider = this.colliders[i];

      if (!collider.enabled) {
        continue;
      }

      const collidingLayers = this.layerCollisionMatrix.get(collider.gameObject.layer);

      if (collidingLayers === undefined) {
        throw new Error('Layer not found');
      }

      for (let j = i + 1; j < this.colliders.length; j++) {
        const other = this.colliders[j];

        if (collidingLayers.has(other.gameObject.layer) && collider.detectCollision(other)) {
          const collisionManifold = this.buildCollisionManifold(collider, other);

          collider.triggerCollision(collisionManifold);
          other.triggerCollision(collisionManifold);

          this._onCollisionDetected.trigger(collisionManifold);
        }
      }
    }
  }
}
