import 'vitest-canvas-mock';
import { Layer } from '../../core/enums/Layer';
import { GameEngine } from '../../core/GameEngine';
import { AssetPool } from '../../core/helpers/AssetPool';
import type { IPrefabSettings } from '../../core/types';
import type { IScene } from '../../core/types';
import { GameObject } from '../../game-objects/GameObject';
import { Component } from '../Component';

class TestComponent extends Component {}

class TestGameObject extends GameObject {
  protected override buildInitialComponents(): Component[] {
    return [];
  }

  protected override getPrefabSettings(): IPrefabSettings {
    return {
      x: 0,
      y: 0,
      rotation: 0,
      name: 'component-object',
      tag: 'component-tag',
      layer: Layer.Default
    };
  }
}

function createEmptyAssetPool(): AssetPool {
  return new AssetPool(new Map<string, unknown>());
}

const componentScene: IScene = {
  name: 'ComponentScene',
  loadOrder: 1,
  terrainSpec: null,
  getStartingGameObjects: () => [],
  getAssetPool: () => Promise.resolve(createEmptyAssetPool())
};

let gameEngine: GameEngine = null!;

beforeAll(async (): Promise<void> => {
  const gameCanvas = document.createElement('canvas');
  gameCanvas.width = 800;
  gameCanvas.height = 600;

  gameEngine = new GameEngine({ gameCanvas });
  gameEngine.setScenes([componentScene]);
  await gameEngine.loadScene(1);
});

function createGameObject(): TestGameObject {
  return new TestGameObject({ gameEngine });
}

describe('Component', () => {
  test('enabled defaults to true', () => {
    const component = new TestComponent(createGameObject());

    expect(component.enabled).toBe(true);
  });

  test('setting enabled false calls onDisable()', () => {
    const component = new TestComponent(createGameObject());
    const onDisable = vi.spyOn(component, 'onDisable');

    component.enabled = false;

    expect(onDisable).toHaveBeenCalledOnce();
  });

  test('setting enabled true when disabled calls onEnabled()', () => {
    const component = new TestComponent(createGameObject());
    const onEnabled = vi.spyOn(component, 'onEnabled');

    component.enabled = false;
    component.enabled = true;

    expect(onEnabled).toHaveBeenCalledOnce();
  });

  test('onDestroyed event fires when component is destroyed via removeComponent', () => {
    const gameObject = createGameObject();
    const component = gameObject.addComponent(new TestComponent(gameObject));
    const onDestroyed = vi.fn();

    component.onDestroyed.subscribe(onDestroyed);
    gameObject.removeComponent(component);

    expect(onDestroyed).toHaveBeenCalledOnce();
    expect(onDestroyed).toHaveBeenCalledWith(component);
  });

  test('gameObject property returns the owning GameObject', () => {
    const gameObject = createGameObject();
    const component = new TestComponent(gameObject);

    expect(component.gameObject).toBe(gameObject);
  });

  test('typeName static property exists', () => {
    expect(TestComponent.typeName).toBeDefined();
    expect(Component.getTypeName(TestComponent)).toBe('TestComponent');
  });

  test('delegation getters return values from gameObject', () => {
    const gameObject = new TestGameObject({
      gameEngine,
      name: 'delegated-name',
      tag: 'delegated-tag'
    });
    const component = new TestComponent(gameObject);

    expect(component.tag).toBe(gameObject.tag);
    expect(component.id).toBe(gameObject.id);
    expect(component.name).toBe(gameObject.name);
    expect(component.transform).toBe(gameObject.transform);
  });
});
