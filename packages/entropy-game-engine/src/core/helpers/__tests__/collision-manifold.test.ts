import type { RectangleCollider } from '../../../components/RectangleCollider';
import { CollisionManifold } from '../CollisionManifold';
import { Vector2 } from '../Vector2';

const createMockRectangleCollider = (id: string): RectangleCollider => {
  return { gameObject: { id } } as unknown as RectangleCollider;
};

describe('CollisionManifold', () => {
  it('stores constructor properties', () => {
    const colliderA = createMockRectangleCollider('a');
    const colliderB = createMockRectangleCollider('b');
    const collisionNormal = new Vector2(0, 1);
    const manifold = new CollisionManifold(colliderA, colliderB, 3, collisionNormal);

    expect(manifold.colliderA).toBe(colliderA);
    expect(manifold.colliderB).toBe(colliderB);
    expect(manifold.penetrationDepth).toBe(3);
    expect(manifold.collisionNormal).toBe(collisionNormal);
  });

  it('returns the opposite collider from getOtherCollider', () => {
    const colliderA = createMockRectangleCollider('a');
    const colliderB = createMockRectangleCollider('b');
    const manifold = new CollisionManifold(colliderA, colliderB, 1, new Vector2(1, 0));

    expect(manifold.getOtherCollider(colliderA)).toBe(colliderB);
    expect(manifold.getOtherCollider(colliderB)).toBe(colliderA);
  });

  it('returns the stored collision normal for colliderA and a negated normal for colliderB', () => {
    const colliderA = createMockRectangleCollider('a');
    const colliderB = createMockRectangleCollider('b');
    const collisionNormal = new Vector2(3, -4);
    const manifold = new CollisionManifold(colliderA, colliderB, 1, collisionNormal);

    const normalForA = manifold.getCollisionNormalForCollider(colliderA);
    const normalForB = manifold.getCollisionNormalForCollider(colliderB);

    expect(normalForA).toEqual(new Vector2(3, -4));
    expect(normalForA).not.toBe(collisionNormal);
    expect(normalForB).toEqual(new Vector2(-3, 4));
    expect(normalForB).not.toBe(collisionNormal);
  });

  it('returns colliderA when getOtherCollider is called with an unknown collider', () => {
    const colliderA = createMockRectangleCollider('a');
    const colliderB = createMockRectangleCollider('b');
    const unknownCollider = createMockRectangleCollider('unknown');
    const manifold = new CollisionManifold(colliderA, colliderB, 1, new Vector2(0, 1));

    expect(manifold.getOtherCollider(unknownCollider)).toBe(colliderA);
  });
});
