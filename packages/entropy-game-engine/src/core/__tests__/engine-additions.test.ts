import 'vitest-canvas-mock';
import { Component } from '../../components/Component';
import { GridOverlayGizmo } from '../../components/GridOverlayGizmo';
import { GameObject } from '../../game-objects/GameObject';
import { Layer } from '../enums/Layer';
import { GameEngine } from '../GameEngine';
import type { IPrefabSettings, IRenderableGizmo } from '../types';

class EmptyGameObject extends GameObject {
  protected override buildInitialComponents(): Component[] {
    return [];
  }

  protected override getPrefabSettings(): IPrefabSettings {
    return {
      x: 0,
      y: 0,
      rotation: 0,
      id: 'test',
      name: 'test',
      tag: 'test',
      layer: Layer.Default
    };
  }
}

const createGameEngine = (): GameEngine => {
  const gameCanvas = document.createElement('canvas');
  gameCanvas.width = 320;
  gameCanvas.height = 180;

  const gameEngine = new GameEngine({ gameCanvas });
  const createEnginesAndAPIs = Reflect.get(gameEngine as object, 'createEnginesAndAPIs') as (() => void) | undefined;

  if (createEnginesAndAPIs === undefined) {
    throw new Error('Unable to initialize test GameEngine internals.');
  }

  createEnginesAndAPIs.call(gameEngine);

  return gameEngine;
};

describe('GameEngine.renderFrame', () => {
  it('calls renderScene on the rendering engine', () => {
    const gameEngine = createGameEngine();
    const renderingEngine = Reflect.get(gameEngine as object, 'renderingEngine') as { renderScene: () => void };
    const renderSpy = vi.spyOn(renderingEngine, 'renderScene');

    gameEngine.renderFrame();

    expect(renderSpy).toHaveBeenCalledOnce();
  });
});

describe('GridOverlayGizmo', () => {
  it('implements IRenderableGizmo with renderGizmo method', () => {
    const gameEngine = createGameEngine();
    const gameObject = new EmptyGameObject({ gameEngine, id: 'grid-test', tag: 'grid-test' });
    const gizmo = new GridOverlayGizmo(gameObject, 16, 16, 10, 10);

    expect(gizmo).toBeDefined();
    expect(typeof (gizmo as IRenderableGizmo).renderGizmo).toBe('function');
  });

  it('draws grid lines on the canvas context', () => {
    const gameEngine = createGameEngine();
    const gameObject = new EmptyGameObject({ gameEngine, id: 'grid-test2', tag: 'grid-test2' });
    const gizmo = new GridOverlayGizmo(gameObject, 16, 16, 5, 5);

    const canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 180;
    const context = canvas.getContext('2d')!;

    const beginPathSpy = vi.spyOn(context, 'beginPath');
    const strokeSpy = vi.spyOn(context, 'stroke');

    gizmo.renderGizmo(context);

    expect(beginPathSpy).toHaveBeenCalled();
    expect(strokeSpy).toHaveBeenCalled();
  });
});
