import 'vitest-canvas-mock';
import { Component } from '../../components/Component';
import { Rigidbody } from '../../components/Rigidbody';
import { Transform } from '../../components/Transform';
import { Layer } from '../../core/enums/Layer';
import { GameEngine } from '../../core/GameEngine';
import type { AssetPool } from '../../core/helpers/AssetPool';
import type { RectangleBackground } from '../../core/helpers/RectangleBackground';
import { Vector2 } from '../../core/helpers/Vector2';
import type { IPrefabSettings } from '../../core/types';
import type { IGameObjectConstructionParams } from '../../core/types';
import type { IScene } from '../../core/types';
import { GameObject } from '../GameObject';

class TestComponent extends Component {}

class TestComponent2 extends Component {
  public testData: number = 0;

  public override start(): void {
    this.testData++;
  }

  public override update(): void {
    this.testData++;
  }
}

class DestroyTrackingComponent extends Component {
  public destroyCount: number = 0;

  public override onDestroy(): void {
    this.destroyCount++;
    super.onDestroy();
  }
}

class TestGameObject extends GameObject {
  protected buildInitialComponents(): Component[] {
    return [new TestComponent(this)];
  }

  protected getPrefabSettings(): IPrefabSettings {
    return {
      x: 0,
      y: 0,
      rotation: 0,
      name: 'test1',
      tag: 'testTag1',
      layer: Layer.Default
    };
  }
}

class TestGameObject2 extends GameObject {
  protected buildInitialComponents(): Component[] {
    return [new TestComponent2(this)];
  }

  protected override buildAndReturnChildGameObjects(config: IGameObjectConstructionParams): GameObject[] {
    return [new TestGameObject({ gameEngine: config.gameEngine, name: 'test-child' })];
  }

  protected getPrefabSettings(): IPrefabSettings {
    return {
      x: 50,
      y: 75,
      rotation: 0,
      name: 'test',
      tag: 'testTag',
      layer: Layer.Friendly
    };
  }
}

const scene1: IScene = {
  name: 'Scene1',
  loadOrder: 1,
  terrainSpec: null,

  getSkybox(_gameEngine: GameEngine): RectangleBackground {
    return null!;
  },

  getStartingGameObjects(gameEngine: GameEngine): GameObject[] {
    return [
      new TestGameObject({ gameEngine }),
      new TestGameObject({
        gameEngine,
        name: 'test2',
        x: 5,
        y: 5,
        rotation: 5,
        tag: 'testTag2',
        layer: Layer.Water
      }),
      new TestGameObject2({ gameEngine })
    ];
  },

  async getAssetPool(): Promise<AssetPool> {
    return Promise.resolve(null!);
  }
};

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

let testGameEngine: GameEngine = null!;
let testGameObject: GameObject = null!;
let testGameObject2: GameObject = null!;
let testGameObject3: GameObject = null!;

beforeAll(async () => {
  const gameCanvas = document.createElement('canvas');

  testGameEngine = new GameEngine({ gameCanvas });
  testGameEngine.setScenes([scene1]);
  await testGameEngine.loadScene(1);

  testGameObject = testGameEngine.findGameObjectWithTag('testTag1')!;
  testGameObject2 = testGameEngine.findGameObjectWithTag('testTag')!;
  testGameObject3 = testGameEngine.findGameObjectWithTag('testTag2')!;

  if (testGameObject === null || testGameObject2 === null || testGameObject3 === null) {
    throw new Error('Error setting up game objects.');
  }
});

test('Tests the creation of a game object.', () => {
  expect(testGameObject).toBeInstanceOf(GameObject);
  expect(testGameObject.id).toMatch(uuidPattern);
  expect(testGameObject.name).toBe('test1');
  expect(testGameObject.tag).toBe('testTag1');
  expect(testGameObject.enabled).toBe(true);
  expect(testGameObject.layer).toBe(Layer.Default);
  expect(testGameObject.transform).toBeInstanceOf(Transform);
  expect(testGameObject.transform.position).toBeInstanceOf(Vector2);
  expect(testGameObject.transform.position.x).toBe(0);
  expect(testGameObject.transform.position.y).toBe(0);
  expect(testGameObject.transform.rotation).toBe(0);
  expect(testGameEngine.findGameObjectById(testGameObject.id)).toBe(testGameObject);

  expect(testGameObject2).toBeInstanceOf(GameObject);
  expect(testGameObject2.id).toMatch(uuidPattern);
  expect(testGameObject2.name).toBe('test');
  expect(testGameObject2.tag).toBe('testTag');
  expect(testGameObject2.enabled).toBe(true);
  expect(testGameObject2.layer).toBe(Layer.Friendly);
  expect(testGameObject2.transform).toBeInstanceOf(Transform);
  expect(testGameObject2.transform.position).toBeInstanceOf(Vector2);
  expect(testGameObject2.transform.position.x).toBe(50);
  expect(testGameObject2.transform.position.y).toBe(75);
  expect(testGameObject2.transform.rotation).toBe(0);
  expect(testGameEngine.findGameObjectById(testGameObject2.id)).toBe(testGameObject2);

  expect(testGameObject3).toBeInstanceOf(GameObject);
  expect(testGameObject3.id).toMatch(uuidPattern);
  expect(testGameObject3.name).toBe('test2');
  expect(testGameObject3.tag).toBe('testTag2');
  expect(testGameObject3.enabled).toBe(true);
  expect(testGameObject3.layer).toBe(Layer.Water);
  expect(testGameObject3.transform).toBeInstanceOf(Transform);
  expect(testGameObject3.transform.position).toBeInstanceOf(Vector2);
  expect(testGameObject3.transform.position.x).toBe(5);
  expect(testGameObject3.transform.position.y).toBe(5);
  expect(testGameObject3.transform.rotation).toBe(5);
  expect(testGameEngine.findGameObjectById(testGameObject3.id)).toBe(testGameObject3);

  expect(testGameObject.id).not.toBe(testGameObject2.id);
  expect(testGameObject2.id).not.toBe(testGameObject3.id);
});

test('Tests nesting of game objects', () => {
  expect(testGameObject.transform.children.length).toBe(0);
  expect(testGameObject2.transform.children.length).toBe(1);

  expect(testGameObject.transform.parent).toBe(null);
  expect(testGameObject2.transform.parent).toBe(null);
  expect(testGameObject2.transform.children[0].parent).toBe(testGameObject2.transform);
});

test('Tests various GameObject functions', () => {
  expect(testGameObject.hasComponent(TestComponent)).toBe(true);
  expect(testGameObject.hasComponent(Rigidbody)).toBe(false);
  expect(testGameObject.getComponent(TestComponent)).toBeInstanceOf(TestComponent);
  expect(testGameObject.getComponent(Rigidbody)).toBe(null);

  expect(testGameObject2.getComponentInChildren(TestComponent)).toBeInstanceOf(TestComponent);
  expect(testGameObject2.getComponentInChildren(TestComponent2)).toBe(testGameObject2.getComponent(TestComponent2));
  expect(testGameObject2.getComponentsInChildren(TestComponent2)).toEqual([
    testGameObject2.getComponent(TestComponent2)
  ]);

  const childGameObject = testGameObject2.transform.children[0].gameObject;

  expect(childGameObject.getComponentInParent(TestComponent2)).toBeInstanceOf(TestComponent2);
  expect(childGameObject.getComponentInParent(TestComponent2)).toBe(testGameObject2.getComponent(TestComponent2));
  expect(childGameObject.getComponentsInParent(TestComponent2)).toEqual([testGameObject2.getComponent(TestComponent2)]);
});

test('Tests targeted component removal for duplicate component types', () => {
  const gameObject = new TestGameObject({ gameEngine: testGameEngine });
  const firstComponent = gameObject.addComponent<DestroyTrackingComponent>(new DestroyTrackingComponent(gameObject));
  const secondComponent = gameObject.addComponent<DestroyTrackingComponent>(new DestroyTrackingComponent(gameObject));

  expect(gameObject.getComponents(DestroyTrackingComponent)).toEqual([firstComponent, secondComponent]);

  gameObject.removeComponent(firstComponent);

  expect(firstComponent.destroyCount).toBe(1);
  expect(secondComponent.destroyCount).toBe(0);
  expect(gameObject.hasComponent(DestroyTrackingComponent)).toBe(true);
  expect(gameObject.getComponents(DestroyTrackingComponent)).toEqual([secondComponent]);
  expect(gameObject.getComponent(DestroyTrackingComponent)).toBe(secondComponent);
  expect(() => gameObject.removeComponent(firstComponent)).toThrowError(
    'This specific DestroyTrackingComponent component is not attached to this object!'
  );

  gameObject.removeComponent(secondComponent);

  expect(secondComponent.destroyCount).toBe(1);
  expect(gameObject.hasComponent(DestroyTrackingComponent)).toBe(false);
  expect(gameObject.getComponents(DestroyTrackingComponent)).toEqual([]);
});
