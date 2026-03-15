import 'vitest-canvas-mock';
import { Layer } from '../../core/enums/Layer';
import { GameEngine } from '../../core/GameEngine';
import type { AssetPool } from '../../core/helpers/AssetPool';
import type { RectangleBackground } from '../../core/helpers/RectangleBackground';
import { Vector2 } from '../../core/helpers/Vector2';
import type { IGameObjectConstructionParams, IPrefabSettings, IScene } from '../../core/types';
import { GameObject } from '../../game-objects/GameObject';
import type { Component } from '../Component';
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

describe('Rigidbody', () => {
  test('addForce applies to velocity during the next physics update', () => {
    const rigidbody = new Rigidbody(createTestGameObject(), 2);

    rigidbody.addForce(new Vector2(4, 6));

    expect(rigidbody.velocity.x).toBe(0);
    expect(rigidbody.velocity.y).toBe(0);

    rigidbody.updatePhysics(1);

    expect(rigidbody.velocity.x).toBe(2);
    expect(rigidbody.velocity.y).toBe(3);
    expect(rigidbody.transform.position.x).toBe(2);
    expect(rigidbody.transform.position.y).toBe(3);
  });

  test('accumulates multiple forces before a physics update', () => {
    const rigidbody = new Rigidbody(createTestGameObject(), 2);

    rigidbody.addForce(new Vector2(4, 0));
    rigidbody.addForce(new Vector2(2, 6));

    rigidbody.updatePhysics(1);

    expect(rigidbody.velocity.x).toBe(3);
    expect(rigidbody.velocity.y).toBe(3);
    expect(rigidbody.transform.position.x).toBe(3);
    expect(rigidbody.transform.position.y).toBe(3);
  });


  test('updates inverseMass when mass changes', () => {
    const rigidbody = new Rigidbody(createTestGameObject(), 2);

    rigidbody.mass = 4;

    expect(rigidbody.mass).toBe(4);
    expect(rigidbody.inverseMass).toBe(0.25);
  });

  test('sets inverseMass to zero and returns Infinity when mass is zero', () => {
    const rigidbody = new Rigidbody(createTestGameObject(), 2);

    rigidbody.mass = 0;

    expect(rigidbody.inverseMass).toBe(0);
    expect(rigidbody.mass).toBe(Infinity);
  });

  test('publishes becameKinematic and becameNonKinematic events when toggled', () => {
    const rigidbody = new Rigidbody(createTestGameObject());
    const becameKinematicHandler = vi.fn();
    const becameNonKinematicHandler = vi.fn();

    rigidbody.becameKinematic.subscribe(becameKinematicHandler);
    rigidbody.becameNonKinematic.subscribe(becameNonKinematicHandler);

    rigidbody.isKinematic = true;

    expect(rigidbody.isKinematic).toBe(true);
    expect(becameKinematicHandler).toHaveBeenCalledTimes(1);
    expect(becameKinematicHandler).toHaveBeenCalledWith(rigidbody);
    expect(becameNonKinematicHandler).not.toHaveBeenCalled();

    rigidbody.isKinematic = false;

    expect(rigidbody.isKinematic).toBe(false);
    expect(becameNonKinematicHandler).toHaveBeenCalledTimes(1);
    expect(becameNonKinematicHandler).toHaveBeenCalledWith(rigidbody);
  });

  test('reduces velocity over time when drag is applied', () => {
    const rigidbody = new Rigidbody(createTestGameObject(), 1);
    rigidbody.drag = 0.5;
    rigidbody.velocity.x = 10;
    rigidbody.velocity.y = 0;

    rigidbody.updatePhysics(1);

    expect(rigidbody.velocity.x).toBeLessThan(10);
    expect(rigidbody.velocity.x).toBeGreaterThan(0);
  });

  test('roundtrips serialized Rigidbody state', () => {
    const rigidbody = new Rigidbody(createTestGameObject(), 5, true);
    rigidbody.velocity.x = 3;
    rigidbody.velocity.y = -4;
    rigidbody.useGravity = true;
    rigidbody.drag = 0.25;

    const serialized = rigidbody.serialize();
    const restored = Rigidbody.createFromSerialized(createTestGameObject(), serialized.data);

    expect(restored.velocity.x).toBe(3);
    expect(restored.velocity.y).toBe(-4);
    expect(restored.mass).toBe(5);
    expect(restored.inverseMass).toBe(0.2);
    expect(restored.useGravity).toBe(true);
    expect(restored.drag).toBe(0.25);
    expect(restored.isKinematic).toBe(true);
    expect(restored.serialize()).toEqual(serialized);
  });
});
