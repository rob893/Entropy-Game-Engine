import { RectangleCollider } from '../../../components/RectangleCollider';
import type { GameObject } from '../../../game-objects/GameObject';
import { Layer } from '../../enums/Layer';
import { CollisionManifold } from '../../helpers/CollisionManifold';
import { Vector2 } from '../../helpers/Vector2';
import { BaseCollisionDetector } from '../BaseCollisionDetector';

let nextGameObjectId = 0;

const createFakeGameObject = (x: number = 0, y: number = 10, layer: Layer = Layer.Default): GameObject => {
  const position = new Vector2(x, y);
  nextGameObjectId += 1;

  return {
    enabled: true,
    id: `detector-object-${nextGameObjectId}`,
    name: `detector-object-${nextGameObjectId}`,
    tag: 'test',
    layer,
    transform: {
      position,
      translate(translation: Vector2): void {
        position.add(translation);
      }
    }
  } as unknown as GameObject;
};

const createCollider = (x: number = 0, y: number = 10, width: number = 10, height: number = 10): RectangleCollider => {
  return new RectangleCollider(createFakeGameObject(x, y), null, width, height);
};

class TestCollisionDetector extends BaseCollisionDetector {
  public exposeBuildCollisionManifold(colliderA: RectangleCollider, colliderB: RectangleCollider): CollisionManifold {
    return this.buildCollisionManifold(colliderA, colliderB);
  }

  public emitCollision(manifold: CollisionManifold): void {
    this._onCollisionDetected.publish(manifold);
  }

  public detectCollisions(): void {}
}

const createDetector = (): TestCollisionDetector => {
  return new TestCollisionDetector(new Map([[Layer.Default, new Set([Layer.Default])]]));
};

describe('BaseCollisionDetector', () => {
  it('adds a collider to the colliders array', () => {
    const detector = createDetector();
    const collider = createCollider();

    detector.addCollider(collider);

    expect(detector.colliders).toEqual([collider]);
  });

  it('removes a collider from the colliders array', () => {
    const detector = createDetector();
    const colliderA = createCollider();
    const colliderB = createCollider(20, 10);

    detector.addColliders([colliderA, colliderB]);
    detector.removeCollider(colliderA);

    expect(detector.colliders).toEqual([colliderB]);
  });

  it('adds multiple colliders at once', () => {
    const detector = createDetector();
    const colliderA = createCollider();
    const colliderB = createCollider(20, 10);

    detector.addColliders([colliderA, colliderB]);

    expect(detector.colliders).toEqual([colliderA, colliderB]);
  });

  it('exposes a subscribable collision stream', () => {
    const detector = createDetector();
    const colliderA = createCollider();
    const colliderB = createCollider(8, 10);
    const manifold = new CollisionManifold(colliderA, colliderB, 2, new Vector2(-1, 0));
    const handler = vi.fn();

    detector.onCollisionDetected.subscribe(handler);
    detector.emitCollision(manifold);

    expect(handler).toHaveBeenCalledWith(manifold);
  });

  it('builds a horizontal collision manifold with the expected penetration depth and normal', () => {
    const detector = createDetector();
    const colliderA = createCollider(0, 10, 10, 10);
    const colliderB = createCollider(8, 10, 10, 10);

    const manifold = detector.exposeBuildCollisionManifold(colliderA, colliderB);

    expect(manifold.colliderA).toBe(colliderA);
    expect(manifold.colliderB).toBe(colliderB);
    expect(manifold.penetrationDepth).toBeCloseTo(2);
    expect(manifold.collisionNormal.x).toBe(-1);
    expect(manifold.collisionNormal.y).toBe(0);
  });

  it('builds a vertical collision manifold with the expected penetration depth and normal', () => {
    const detector = createDetector();
    const colliderA = createCollider(0, 10, 10, 10);
    const colliderB = createCollider(0, 12, 10, 10);

    const manifold = detector.exposeBuildCollisionManifold(colliderA, colliderB);

    expect(manifold.penetrationDepth).toBeCloseTo(8);
    expect(manifold.collisionNormal.x).toBe(0);
    expect(manifold.collisionNormal.y).toBe(-1);
  });
});
