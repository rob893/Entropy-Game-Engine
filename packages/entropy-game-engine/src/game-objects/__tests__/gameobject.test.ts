import 'jest-canvas-mock';
import { Component } from '../../components/Component';
import { GameObject } from '../GameObject';
import { PrefabSettings } from '../../core/interfaces/PrefabSettings';
import { GameObjectConstructionParams } from '../../core/interfaces/GameObjectConstructionParams';
import { RectangleBackground } from '../../core/helpers/RectangleBackground';
import { GameEngine } from '../../core/GameEngine';
import { Scene } from '../../core/interfaces/Scene';
import { Layer } from '../../core/enums/Layer';
import { AssetPool } from '../../core/helpers/AssetPool';
import { Transform } from '../../components/Transform';
import { Vector2 } from '../../core/helpers/Vector2';
import { Rigidbody } from '../../components/Rigidbody';

class TestComponent extends Component {}

class TestComponent2 extends Component {
  public testData: number = 0;

  public start(): void {
    this.testData++;
  }

  public update(): void {
    this.testData++;
  }
}

class TestGameObject extends GameObject {
  protected buildInitialComponents(): Component[] {
    return [new TestComponent(this)];
  }

  protected getPrefabSettings(): PrefabSettings {
    return {
      x: 0,
      y: 0,
      rotation: 0,
      id: 'test1',
      tag: '',
      layer: Layer.Default
    };
  }
}

class TestGameObject2 extends GameObject {
  protected buildInitialComponents(): Component[] {
    return [new TestComponent2(this)];
  }

  protected buildAndReturnChildGameObjects(config: GameObjectConstructionParams): GameObject[] {
    return [new TestGameObject(config)];
  }

  protected getPrefabSettings(): PrefabSettings {
    return {
      x: 50,
      y: 75,
      rotation: 0,
      id: 'test',
      tag: 'testTag',
      layer: Layer.Friendly
    };
  }
}

const scene1: Scene = {
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
        id: 'test2',
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
    return await null!;
  }
};

let testGameObject: GameObject = null!;
let testGameObject2: GameObject = null!;
let testGameObject3: GameObject = null!;

beforeAll(async () => {
  const gameCanvas = document.createElement('canvas');

  const gameEngine = new GameEngine({ gameCanvas });
  gameEngine.setScenes([scene1]);
  await gameEngine.loadScene(1);

  testGameObject = gameEngine.findGameObjectById('test1')!;
  testGameObject2 = gameEngine.findGameObjectById('test')!;
  testGameObject3 = gameEngine.findGameObjectById('test2')!;

  if (testGameObject === null || testGameObject2 === null || testGameObject3 === null) {
    throw new Error('Error setting up game objects.');
  }
});

describe('GameObject', () => {
  describe('constructor', () => {
    it('should create a game object', () => {
      expect(testGameObject).toBeInstanceOf(GameObject);
      expect(testGameObject.id).toBe('test1');
      expect(testGameObject.tag).toBe('');
      expect(testGameObject.enabled).toBe(true);
      expect(testGameObject.layer).toBe(Layer.Default);
      expect(testGameObject.transform).toBeInstanceOf(Transform);
      expect(testGameObject.transform.position).toBeInstanceOf(Vector2);
      expect(testGameObject.transform.position.x).toBe(0);
      expect(testGameObject.transform.position.y).toBe(0);
      expect(testGameObject.transform.rotation).toBe(0);

      expect(testGameObject2).toBeInstanceOf(GameObject);
      expect(testGameObject2.id).toBe('test');
      expect(testGameObject2.tag).toBe('testTag');
      expect(testGameObject2.enabled).toBe(true);
      expect(testGameObject2.layer).toBe(Layer.Friendly);
      expect(testGameObject2.transform).toBeInstanceOf(Transform);
      expect(testGameObject2.transform.position).toBeInstanceOf(Vector2);
      expect(testGameObject2.transform.position.x).toBe(50);
      expect(testGameObject2.transform.position.y).toBe(75);
      expect(testGameObject2.transform.rotation).toBe(0);

      expect(testGameObject3).toBeInstanceOf(GameObject);
      expect(testGameObject3.id).toBe('test2');
      expect(testGameObject3.tag).toBe('testTag2');
      expect(testGameObject3.enabled).toBe(true);
      expect(testGameObject3.layer).toBe(Layer.Water);
      expect(testGameObject3.transform).toBeInstanceOf(Transform);
      expect(testGameObject3.transform.position).toBeInstanceOf(Vector2);
      expect(testGameObject3.transform.position.x).toBe(5);
      expect(testGameObject3.transform.position.y).toBe(5);
      expect(testGameObject3.transform.rotation).toBe(5);
    });

    it('should allow for nested game objects', () => {
      expect(testGameObject.transform.children.length).toBe(0);
      expect(testGameObject2.transform.children.length).toBe(1);

      expect(testGameObject.transform.parent).toBe(null);
      expect(testGameObject2.transform.parent).toBe(null);
      expect(testGameObject2.transform.children[0].parent).toBe(testGameObject2.transform);
    });
  });

  describe('hasComponent', () => {
    it('should return true if the game object has a component of a given type', () => {
      expect(testGameObject.hasComponent(TestComponent)).toBe(true);
    });

    it('should return false if the game object does not have a component of a given type', () => {
      expect(testGameObject.hasComponent(Rigidbody)).toBe(false);
    });
  });

  describe('getComponent', () => {
    it('should return a component of a given type', () => {
      expect(testGameObject.getComponent(TestComponent)).toBeInstanceOf(TestComponent);
    });

    it('should return null if game object does not have the component', () => {
      expect(testGameObject.getComponent(Rigidbody)).toBeNull();
    });
  });

  describe('getComponentInChildren', () => {
    it('should return a component of a given type', () => {
      expect(testGameObject2.getComponentInChildren(TestComponent)).toBeInstanceOf(TestComponent);
    });

    it('should return null if game object does not have the component', () => {
      expect(testGameObject2.getComponentInChildren(TestComponent2)).toBe(null);
    });
  });

  describe('getComponentInParent', () => {
    it('should return a component of a given type', () => {
      const childGameObject = testGameObject2.transform.children[0].gameObject;

      expect(childGameObject.getComponentInParent(TestComponent2)).toBeInstanceOf(TestComponent2);
      expect(childGameObject.getComponentInParent(TestComponent2)).toBe(testGameObject2.getComponent(TestComponent2));
    });
  });

  describe('addComponent', () => {
    it('should add a component to the game object', () => {
      class AddComponentTest extends Component {}

      const newComponent = new AddComponentTest(testGameObject);

      expect(testGameObject.hasComponent(AddComponentTest)).toBe(false);

      testGameObject.addComponent(newComponent);

      expect(testGameObject.hasComponent(AddComponentTest)).toBe(true);
      testGameObject.removeComponent(newComponent);
    });
  });

  describe('removeComponent', () => {
    it('should remove a component from the game object', () => {
      class AddComponentTest extends Component {}

      const newComponent = new AddComponentTest(testGameObject);

      expect(testGameObject.hasComponent(AddComponentTest)).toBe(false);

      testGameObject.addComponent(newComponent);

      expect(testGameObject.hasComponent(AddComponentTest)).toBe(true);

      testGameObject.removeComponent(newComponent);

      expect(testGameObject.hasComponent(AddComponentTest)).toBe(false);
    });

    it('should only remove the provided instance from the game object', () => {
      class AddComponentTest extends Component {}

      const newComponent = new AddComponentTest(testGameObject);
      const newComponent2 = new AddComponentTest(testGameObject);

      expect(testGameObject.hasComponent(AddComponentTest)).toBe(false);

      testGameObject.addComponent(newComponent);
      testGameObject.addComponent(newComponent2);

      expect(testGameObject.hasComponent(AddComponentTest)).toBe(true);

      testGameObject.removeComponent(newComponent);

      expect(testGameObject.hasComponent(AddComponentTest)).toBe(true);
      expect(testGameObject.getComponent(AddComponentTest)).toBe(newComponent2);
    });
  });
});
