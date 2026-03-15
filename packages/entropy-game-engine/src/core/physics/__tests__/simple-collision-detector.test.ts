import { Layer } from '../../enums/Layer';
import type { CollisionManifold } from '../../helpers/CollisionManifold';
import { SimpleCollisionDetector } from '../SimpleCollisionDetector';
import { createLayerCollisionMatrix, createMockCollider } from './collision-test-utils';

describe('SimpleCollisionDetector', () => {
  it('detects a collision when two colliders overlap', () => {
    const detector = new SimpleCollisionDetector(
      createLayerCollisionMatrix([[Layer.Default, [Layer.Default]]])
    );
    const first = createMockCollider({ x: 50, y: 50 });
    const second = createMockCollider({ x: 60, y: 50 });
    const collisions: CollisionManifold[] = [];

    detector.onCollisionDetected.subscribe((manifold): void => {
      collisions.push(manifold);
    });
    detector.addColliders([first.collider, second.collider]);

    detector.detectCollisions();

    expect(collisions).toHaveLength(1);
    expect(collisions[0].colliderA).toBe(first.collider);
    expect(collisions[0].colliderB).toBe(second.collider);
    expect(first.triggerCollisionSpy).toHaveBeenCalledTimes(1);
    expect(second.triggerCollisionSpy).toHaveBeenCalledTimes(1);
  });

  it('does not detect a collision when colliders do not overlap', () => {
    const detector = new SimpleCollisionDetector(
      createLayerCollisionMatrix([[Layer.Default, [Layer.Default]]])
    );
    const first = createMockCollider({ x: 50, y: 50 });
    const second = createMockCollider({ x: 140, y: 50 });
    const collisions: CollisionManifold[] = [];

    detector.onCollisionDetected.subscribe((manifold): void => {
      collisions.push(manifold);
    });
    detector.addColliders([first.collider, second.collider]);

    detector.detectCollisions();

    expect(collisions).toHaveLength(0);
    expect(first.triggerCollisionSpy).not.toHaveBeenCalled();
    expect(second.triggerCollisionSpy).not.toHaveBeenCalled();
  });

  it('respects the layer collision matrix', () => {
    const detector = new SimpleCollisionDetector(
      createLayerCollisionMatrix([
        [Layer.Default, [Layer.Terrain]],
        [Layer.Terrain, [Layer.Default]]
      ])
    );
    const first = createMockCollider({ x: 50, y: 50, layer: Layer.Default });
    const second = createMockCollider({ x: 60, y: 50, layer: Layer.Hostile });
    const collisions: CollisionManifold[] = [];

    detector.onCollisionDetected.subscribe((manifold): void => {
      collisions.push(manifold);
    });
    detector.addColliders([first.collider, second.collider]);

    detector.detectCollisions();

    expect(collisions).toHaveLength(0);
    expect(first.detectCollisionSpy).not.toHaveBeenCalled();
  });

  it('skips disabled colliders', () => {
    const detector = new SimpleCollisionDetector(
      createLayerCollisionMatrix([[Layer.Default, [Layer.Default]]])
    );
    const first = createMockCollider({ x: 50, y: 50, enabled: false });
    const second = createMockCollider({ x: 60, y: 50 });
    const collisions: CollisionManifold[] = [];

    detector.onCollisionDetected.subscribe((manifold): void => {
      collisions.push(manifold);
    });
    detector.addColliders([first.collider, second.collider]);

    detector.detectCollisions();

    expect(collisions).toHaveLength(0);
    expect(first.detectCollisionSpy).not.toHaveBeenCalled();
    expect(first.triggerCollisionSpy).not.toHaveBeenCalled();
  });

});
