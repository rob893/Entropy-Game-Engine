import { vi } from 'vitest';
import type { RectangleCollider } from '../../../components/RectangleCollider';
import { Layer } from '../../enums/Layer';
import type { CollisionManifold } from '../../helpers/CollisionManifold';
import { Topic } from '../../helpers/Topic';
import { Vector2 } from '../../helpers/Vector2';

const allLayers: readonly Layer[] = [
  Layer.Default,
  Layer.Terrain,
  Layer.Water,
  Layer.Hostile,
  Layer.Neutral,
  Layer.Friendly,
  Layer.UI
];

type MockColliderOptions = {
  readonly x: number;
  readonly y: number;
  readonly width?: number;
  readonly height?: number;
  readonly layer?: Layer;
  readonly enabled?: boolean;
  readonly gameObjectEnabled?: boolean;
  readonly isTrigger?: boolean;
};

type MockCollider = {
  readonly collider: RectangleCollider;
  readonly detectCollisionSpy: ReturnType<typeof vi.fn>;
  readonly triggerCollisionSpy: ReturnType<typeof vi.fn>;
};

const isOverlapping = (collider: RectangleCollider, other: RectangleCollider): boolean => {
  return !(
    other.topLeft.x > collider.topRight.x ||
    other.topRight.x < collider.topLeft.x ||
    other.topLeft.y > collider.bottomLeft.y ||
    other.bottomLeft.y < collider.topLeft.y
  );
};

export const createLayerCollisionMatrix = (
  entries: ReadonlyArray<readonly [Layer, ReadonlyArray<Layer>]>
): Map<Layer, Set<Layer>> => {
  const matrix = new Map<Layer, Set<Layer>>();

  allLayers.forEach((layer): void => {
    matrix.set(layer, new Set<Layer>());
  });

  entries.forEach(([layer, collidingLayers]): void => {
    matrix.set(layer, new Set(collidingLayers));
  });

  return matrix;
};

export const createMockCollider = (options: MockColliderOptions): MockCollider => {
  const width = options.width ?? 20;
  const height = options.height ?? 20;
  const position = new Vector2(options.x, options.y);
  const colliderEnabled = options.enabled ?? true;
  const gameObject = {
    enabled: options.gameObjectEnabled ?? true,
    layer: options.layer ?? Layer.Default
  };
  const onMoved = new Topic<void>();
  const onResized = new Topic<void>();

  const triggerCollisionSpy = vi.fn((_manifold: CollisionManifold): void => {});

  const collider = {
    attachedRigidbody: null,
    gameObject,
    isTrigger: options.isTrigger ?? false,
    onResized,
    transform: {
      onMoved,
      position
    },
    get enabled(): boolean {
      return colliderEnabled && gameObject.enabled;
    },
    get width(): number {
      return width;
    },
    get height(): number {
      return height;
    },
    get topLeft(): Vector2 {
      return new Vector2(position.x - width / 2, position.y - height);
    },
    get topRight(): Vector2 {
      return new Vector2(position.x + width / 2, position.y - height);
    },
    get bottomLeft(): Vector2 {
      return new Vector2(position.x - width / 2, position.y);
    },
    get bottomRight(): Vector2 {
      return new Vector2(position.x + width / 2, position.y);
    },
    get center(): Vector2 {
      return new Vector2(position.x, position.y - height / 2);
    },
    detectCollision(other: RectangleCollider): boolean {
      return isOverlapping(collider, other);
    },
    triggerCollision: triggerCollisionSpy
  } as unknown as RectangleCollider;
  const detectCollisionSpy = vi.spyOn(collider, 'detectCollision');

  return {
    collider,
    detectCollisionSpy,
    triggerCollisionSpy
  };
};
