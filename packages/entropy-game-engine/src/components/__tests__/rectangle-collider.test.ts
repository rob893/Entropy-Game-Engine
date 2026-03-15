import 'vitest-canvas-mock';
import { Layer } from '../../core/enums/Layer';
import { GameEngine } from '../../core/GameEngine';
import type { AssetPool } from '../../core/helpers/AssetPool';
import { CollisionManifold } from '../../core/helpers/CollisionManifold';
import { PhysicalMaterial } from '../../core/helpers/PhysicalMaterial';
import type { RectangleBackground } from '../../core/helpers/RectangleBackground';
import { Vector2 } from '../../core/helpers/Vector2';
import type { IGameObjectConstructionParams, IPrefabSettings, IScene } from '../../core/types';
import { GameObject } from '../../game-objects/GameObject';
import type { Component } from '../Component';
import { RectangleCollider } from '../RectangleCollider';
import { Rigidbody } from '../Rigidbody';

class TestGameObject extends GameObject {
  protected override buildInitialComponents(): Component[] {
    return [];
  }

  protected override getPrefabSettings(): IPrefabSettings {
    return {
      x: 0,
      y: 0,
      rotation: 0,
      name: 'test-object',
      tag: 'test-tag',
      layer: Layer.Default
    };
  }
}

const testScene: IScene = {
  name: 'ComponentTestScene',
  loadOrder: 1,
  terrainSpec: null,

  getSkybox(_gameEngine: GameEngine): RectangleBackground {
    return null!;
  },

  getStartingGameObjects(): GameObject[] {
    return [];
  },

  getAssetPool(): Promise<AssetPool> {
    return Promise.resolve(null!);
  }
};

let gameEngine: GameEngine = null!;

beforeAll(async (): Promise<void> => {
  const gameCanvas = document.createElement('canvas');
  gameEngine = new GameEngine({ gameCanvas });
  gameEngine.setScenes([testScene]);
  await gameEngine.loadScene(1);
});

function createTestGameObject(config: Partial<IGameObjectConstructionParams> = {}): TestGameObject {
  return new TestGameObject({
    gameEngine,
    ...config
  });
}

describe('RectangleCollider', () => {
  test('computes corners from position, size, and offset', () => {
    const collider = new RectangleCollider(createTestGameObject({ x: 10, y: 20 }), null, 8, 6, 2, 3);

    expect(collider.topLeft.x).toBe(8);
    expect(collider.topLeft.y).toBe(17);
    expect(collider.topRight.x).toBe(16);
    expect(collider.topRight.y).toBe(17);
    expect(collider.bottomLeft.x).toBe(8);
    expect(collider.bottomLeft.y).toBe(23);
    expect(collider.bottomRight.x).toBe(16);
    expect(collider.bottomRight.y).toBe(23);
  });

  test('returns the collider center point', () => {
    const collider = new RectangleCollider(createTestGameObject({ x: 10, y: 20 }), null, 8, 6, 2, 3);

    expect(collider.center.x).toBe(12);
    expect(collider.center.y).toBe(20);
  });

  test('publishes onResized when width, height, or offset change', () => {
    const collider = new RectangleCollider(createTestGameObject(), null, 8, 6);
    const onResizedHandler = vi.fn();

    collider.onResized.subscribe(onResizedHandler);

    collider.width = 10;
    collider.height = 12;
    collider.offset = new Vector2(4, 5);

    expect(collider.width).toBe(10);
    expect(collider.height).toBe(12);
    expect(collider.offset.x).toBe(4);
    expect(collider.offset.y).toBe(5);
    expect(onResizedHandler).toHaveBeenCalledTimes(3);
  });

  test('detects overlapping colliders', () => {
    const colliderA = new RectangleCollider(createTestGameObject({ x: 10, y: 10 }), null, 10, 10);
    const colliderB = new RectangleCollider(createTestGameObject({ x: 14, y: 8 }), null, 10, 10);

    expect(colliderA.detectCollision(colliderB)).toBe(true);
    expect(colliderB.detectCollision(colliderA)).toBe(true);
  });

  test('does not detect non-overlapping colliders', () => {
    const colliderA = new RectangleCollider(createTestGameObject({ x: 10, y: 10 }), null, 10, 10);
    const colliderB = new RectangleCollider(createTestGameObject({ x: 30, y: 10 }), null, 10, 10);

    expect(colliderA.detectCollision(colliderB)).toBe(false);
    expect(colliderB.detectCollision(colliderA)).toBe(false);
  });

  test('publishes onCollided when a collision is triggered', () => {
    const colliderA = new RectangleCollider(createTestGameObject(), null, 10, 10);
    const colliderB = new RectangleCollider(createTestGameObject({ x: 5 }), null, 10, 10);
    const collisionManifold = new CollisionManifold(colliderA, colliderB, 5, new Vector2(1, 0));
    const onCollidedHandler = vi.fn();

    colliderA.onCollided.subscribe(onCollidedHandler);
    colliderA.triggerCollision(collisionManifold);

    expect(onCollidedHandler).toHaveBeenCalledTimes(1);
    expect(onCollidedHandler).toHaveBeenCalledWith(collisionManifold);
  });

  test('supports configuring the trigger flag', () => {
    const collider = new RectangleCollider(createTestGameObject(), null, 10, 10);

    expect(collider.isTrigger).toBe(false);

    collider.isTrigger = true;

    expect(collider.isTrigger).toBe(true);
  });

  test('roundtrips serialized RectangleCollider state', () => {
    const gameObject = createTestGameObject();
    const rigidbody = gameObject.addComponent(new Rigidbody(gameObject, 3));
    const collider = new RectangleCollider(gameObject, rigidbody, 20, 30, 4, 6);
    collider.isTrigger = true;
    collider.physicalMaterial = new PhysicalMaterial(0.2, 0.4, 0.6);

    const serialized = collider.serialize();
    const restored = RectangleCollider.createFromSerialized(gameObject, serialized.data);

    expect(restored.width).toBe(20);
    expect(restored.height).toBe(30);
    expect(restored.offset.x).toBe(4);
    expect(restored.offset.y).toBe(6);
    expect(restored.isTrigger).toBe(true);
    expect(restored.attachedRigidbody).toBe(rigidbody);
    expect(restored.physicalMaterial.dynamicFriction).toBe(0.2);
    expect(restored.physicalMaterial.staticFriction).toBe(0.4);
    expect(restored.physicalMaterial.bounciness).toBe(0.6);
    expect(restored.serialize()).toEqual(serialized);
  });
});
