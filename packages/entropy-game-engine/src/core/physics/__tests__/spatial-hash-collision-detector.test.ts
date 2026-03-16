import { Layer } from '../../enums/Layer';
import type { CollisionManifold } from '../../helpers/CollisionManifold';
import { SpatialHashCollisionDetector } from '../SpatialHashCollisionDetector';
import { createLayerCollisionMatrix, createMockCollider } from './collision-test-utils';

describe('SpatialHashCollisionDetector', () => {
  it('adds and removes colliders', () => {
    const detector = new SpatialHashCollisionDetector(
      300,
      300,
      createLayerCollisionMatrix([[Layer.Default, [Layer.Default]]]),
      50
    );
    const first = createMockCollider({ x: 50, y: 50 });
    const second = createMockCollider({ x: 60, y: 50 });
    const collisions: CollisionManifold[] = [];

    detector.addCollider(first.collider);
    detector.addCollider(second.collider);
    detector.removeCollider(second.collider);
    detector.onCollisionDetected.subscribe((manifold): void => {
      collisions.push(manifold);
    });

    detector.detectCollisions();

    expect(detector.colliders).toEqual([first.collider]);
    expect(collisions).toHaveLength(0);
  });

  it('detects a collision for overlapping colliders in the same cell', () => {
    const detector = new SpatialHashCollisionDetector(
      300,
      300,
      createLayerCollisionMatrix([[Layer.Default, [Layer.Default]]]),
      100
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
    expect(first.triggerCollisionSpy).toHaveBeenCalledTimes(1);
    expect(second.triggerCollisionSpy).toHaveBeenCalledTimes(1);
  });

  it('does not detect collisions for colliders in distant cells', () => {
    const detector = new SpatialHashCollisionDetector(
      400,
      400,
      createLayerCollisionMatrix([[Layer.Default, [Layer.Default]]]),
      50
    );
    const first = createMockCollider({ x: 25, y: 50 });
    const second = createMockCollider({ x: 225, y: 50 });
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

  it('filters collisions using the layer collision matrix', () => {
    const detector = new SpatialHashCollisionDetector(
      300,
      300,
      createLayerCollisionMatrix([
        [Layer.Default, [Layer.Terrain]],
        [Layer.Terrain, [Layer.Default]]
      ]),
      100
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

  it('fires onCollisionDetected with the expected manifold', () => {
    const detector = new SpatialHashCollisionDetector(
      300,
      300,
      createLayerCollisionMatrix([[Layer.Default, [Layer.Default]]]),
      100
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
    expect(collisions[0].penetrationDepth).toBe(10);
    expect(collisions[0].collisionNormal.equals(-1, 0)).toBe(true);
  });
});
