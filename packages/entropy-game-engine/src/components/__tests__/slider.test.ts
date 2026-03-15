import 'vitest-canvas-mock';
import { Color } from '../../core/enums/Color';
import { Layer } from '../../core/enums/Layer';
import { GameEngine } from '../../core/GameEngine';
import { AssetPool } from '../../core/helpers/AssetPool';
import type { IPrefabSettings } from '../../core/types';
import type { IScene } from '../../core/types';
import { GameObject } from '../../game-objects/GameObject';
import type { Component } from '../Component';
import { Slider } from '../Slider';

class TestGameObject extends GameObject {
  protected override buildInitialComponents(): Component[] {
    return [];
  }

  protected override getPrefabSettings(): IPrefabSettings {
    return {
      x: 0,
      y: 0,
      rotation: 0,
      name: 'slider-object',
      tag: 'slider-tag',
      layer: Layer.Default
    };
  }
}

function createEmptyAssetPool(): AssetPool {
  return new AssetPool(new Map<string, unknown>());
}

const sliderScene: IScene = {
  name: 'SliderScene',
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
  gameEngine.setScenes([sliderScene]);
  await gameEngine.loadScene(1);
});

function createSlider(): Slider {
  const gameObject = new TestGameObject({ gameEngine });
  return new Slider(gameObject, 200, 20, Color.Green, Color.Red);
}

describe('Slider', () => {
  test('fillAmount getter returns value set by setter', () => {
    const slider = createSlider();

    slider.fillAmount = 0.75;

    expect(slider.fillAmount).toBe(0.75);
  });

  test('fillAmount clamps to 0 when set below 0', () => {
    const slider = createSlider();

    slider.fillAmount = -0.25;

    expect(slider.fillAmount).toBe(0);
  });

  test('fillAmount clamps to 100 when set above 100', () => {
    const slider = createSlider();

    slider.fillAmount = 125;

    expect(slider.fillAmount).toBe(100);
  });

  test('fillAmount allows values between 0 and 1', () => {
    const slider = createSlider();

    slider.fillAmount = 0.4;

    expect(slider.fillAmount).toBe(0.4);
  });

  test('serialize and deserialize roundtrip', () => {
    const slider = createSlider();
    slider.fillAmount = 0.42;
    slider.zIndex = 5;

    const serialized = slider.serialize();
    const restored = new Slider(new TestGameObject({ gameEngine }), 10, 10, Color.White, Color.Black);
    restored.deserialize(serialized.data);

    expect(restored.serialize()).toEqual(serialized);
  });
});
