import 'vitest-canvas-mock';
import { Layer } from '../../core/enums/Layer';
import { GameEngine } from '../../core/GameEngine';
import { Vector2 } from '../../core/helpers/Vector2';
import type { IGameObjectConstructionParams, IPrefabSettings } from '../../core/types';
import { GameObject } from '../../game-objects/GameObject';
import { Component } from '../Component';
import { Transform } from '../Transform';

class TestGameObject extends GameObject {
  protected override buildInitialComponents(): Component[] {
    return [];
  }

  protected override getPrefabSettings(): IPrefabSettings {
    return {
      x: 0,
      y: 0,
      rotation: 0,
      name: 'test-game-object',
      tag: 'test',
      layer: Layer.Default
    };
  }
}

const createGameEngine = (): GameEngine => {
  const gameCanvas = document.createElement('canvas');
  const gameEngine = new GameEngine({ gameCanvas });
  const createEnginesAndAPIs = Reflect.get(gameEngine as object, 'createEnginesAndAPIs') as (() => void) | undefined;

  if (createEnginesAndAPIs === undefined) {
    throw new Error('Unable to initialize test GameEngine internals.');
  }

  createEnginesAndAPIs.call(gameEngine);

  return gameEngine;
};

const createTestGameObject = (
  gameEngine: GameEngine,
  config: Omit<IGameObjectConstructionParams, 'gameEngine'> = {}
): TestGameObject => {
  return new TestGameObject({ gameEngine, ...config });
};

const registerGameObject = (gameEngine: GameEngine, gameObject: GameObject): void => {
  const registry = Reflect.get(gameEngine as object, 'registry') as
    | { registerGameObject?: (go: GameObject) => void }
    | undefined;

  if (registry === undefined || registry.registerGameObject === undefined) {
    throw new Error('Unable to register test GameObject.');
  }

  const registerFn = Reflect.get(registry as object, 'registerGameObject') as ((go: GameObject) => void) | undefined;

  if (registerFn === undefined) {
    throw new Error('Unable to register test GameObject.');
  }

  registerFn.call(registry, gameObject);
};

describe('Transform', () => {
  let gameEngine: GameEngine = null!;

  beforeEach((): void => {
    gameEngine = createGameEngine();
  });

  it('sets default position, rotation, and scale in the constructor', (): void => {
    const transform = createTestGameObject(gameEngine).transform;

    expect(transform).toBeInstanceOf(Transform);
    expect(transform.position.x).toBe(0);
    expect(transform.position.y).toBe(0);
    expect(transform.rotation).toBe(0);
    expect(transform.scale.x).toBe(1);
    expect(transform.scale.y).toBe(1);
  });

  it('translates position by the given vector', (): void => {
    const transform = createTestGameObject(gameEngine).transform;

    transform.translate(new Vector2(4, -3));

    expect(transform.position.x).toBe(4);
    expect(transform.position.y).toBe(-3);
  });

  it('sets an exact position', (): void => {
    const transform = createTestGameObject(gameEngine).transform;

    transform.setPosition(12, 18);

    expect(transform.position.x).toBe(12);
    expect(transform.position.y).toBe(18);
  });

  it('rotates to face the target point with lookAt', (): void => {
    const transform = createTestGameObject(gameEngine, { x: 5, y: 10 }).transform;
    const target = new Vector2(17, 22);

    transform.lookAt(target);

    expect(transform.rotation).toBeCloseTo(Math.atan2(target.y - 10, target.x - 5) - Math.PI / 2);
  });

  it('manages parent-child relationships and protects the internal children array', (): void => {
    const parent = createTestGameObject(gameEngine, { name: 'parent' }).transform;
    const child = createTestGameObject(gameEngine, { x: 3, y: 4, name: 'child' }).transform;
    const nonParent = createTestGameObject(gameEngine, { name: 'non-parent' }).transform;

    child.parent = parent;

    expect(parent.children).toEqual([child]);
    expect(child.parent).toBe(parent);
    expect(child.isChildOf(parent)).toBe(true);
    expect(child.isChildOf(nonParent)).toBe(false);

    const children = parent.children;
    children.pop();

    expect(parent.children).toEqual([child]);

    child.parent = null;

    expect(child.parent).toBeNull();
    expect(parent.children).toEqual([]);
  });

  it('fires onMoved when position changes via translate or setPosition', (): void => {
    const transform = createTestGameObject(gameEngine).transform;
    let movedCount = 0;
    const subscription = transform.onMoved.subscribe((): void => {
      movedCount++;
    });

    transform.translate(new Vector2(1, 2));
    transform.setPosition(5, 6);

    expect(movedCount).toBe(2);

    subscription.unsubscribe();
  });

  it('updates child position when the parent moves', (): void => {
    const parent = createTestGameObject(gameEngine, { x: 10, y: 20, name: 'parent' }).transform;
    const child = createTestGameObject(gameEngine, { x: 15, y: 27, name: 'child' }).transform;

    child.parent = parent;
    parent.setPosition(30, 35);

    expect(child.position.x).toBe(35);
    expect(child.position.y).toBe(42);
  });

  it('serializes and deserializes as a roundtrip', (): void => {
    const parent = createTestGameObject(gameEngine, { id: 'parent', name: 'parent' });
    registerGameObject(gameEngine, parent);

    const original = createTestGameObject(gameEngine, { x: 13, y: 21, rotation: Math.PI / 4, name: 'original' });
    original.transform.parent = parent.transform;
    original.transform.scale.x = 2;
    original.transform.scale.y = 3;

    const serialized = JSON.parse(JSON.stringify(original.transform.serialize())) as ReturnType<Transform['serialize']>;
    const restored = createTestGameObject(gameEngine, { name: 'restored' });

    restored.transform.deserialize(serialized.data);

    expect(restored.transform.parent).toBe(parent.transform);
    expect(restored.transform.serialize()).toEqual(serialized);
  });
});
