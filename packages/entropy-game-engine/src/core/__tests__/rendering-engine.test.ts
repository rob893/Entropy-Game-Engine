import 'vitest-canvas-mock';
import { Camera } from '../../components/Camera';
import { Component } from '../../components/Component';
import { GameObject } from '../../game-objects/GameObject';
import type { Terrain } from '../../game-objects/Terrain';
import { Layer } from '../enums/Layer';
import { GameEngine } from '../GameEngine';
import { RenderingEngine } from '../RenderingEngine';
import type { IPrefabSettings, IRenderable, IRenderableBackground, IRenderableGUI, IRenderableGizmo } from '../types';

class EmptyGameObject extends GameObject {
  protected override buildInitialComponents(): Component[] {
    return [];
  }

  protected override getPrefabSettings(): IPrefabSettings {
    return {
      x: 0,
      y: 0,
      rotation: 0,
      id: 'empty',
      name: 'empty',
      tag: 'empty',
      layer: Layer.Default
    };
  }
}

const createCanvasContext = (): CanvasRenderingContext2D => {
  const canvas = document.createElement('canvas');
  canvas.width = 320;
  canvas.height = 180;

  const context = canvas.getContext('2d');
  if (context === null) {
    throw new Error('Expected a 2d canvas context.');
  }

  return context;
};

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

const createCamera = (): Camera => {
  const gameEngine = createGameEngine();
  const cameraGameObject = new EmptyGameObject({ gameEngine, id: 'camera', tag: 'camera' });

  return cameraGameObject.addComponent<Camera>(new Camera(cameraGameObject));
};

describe('RenderingEngine', () => {
  it('accepts a canvas rendering context in the constructor', () => {
    const context = createCanvasContext();
    const renderingEngine = new RenderingEngine(context);

    expect(renderingEngine.canvasContext).toBe(context);
  });

  it('stores renderable objects and renders them during renderScene', () => {
    const context = createCanvasContext();
    const renderingEngine = new RenderingEngine(context);
    const renderFirst = vi.fn();
    const renderSecond = vi.fn();
    const firstRenderable: IRenderable = { enabled: true, render: renderFirst };
    const secondRenderable: IRenderable = { enabled: true, render: renderSecond };

    renderingEngine.addRenderableObject(firstRenderable);
    renderingEngine.addRenderableObject(secondRenderable);

    const renderableObjects = Reflect.get(renderingEngine as object, 'renderableObjects') as IRenderable[];

    expect(renderableObjects).toEqual([firstRenderable, secondRenderable]);

    renderingEngine.renderScene();

    expect(renderFirst).toHaveBeenCalledWith(context);
    expect(renderSecond).toHaveBeenCalledWith(context);
  });

  it('stores renderable gizmos and only renders them when enabled', () => {
    const context = createCanvasContext();
    const renderingEngine = new RenderingEngine(context);
    const renderGizmo = vi.fn();
    const gizmo: IRenderableGizmo = { enabled: true, renderGizmo };

    renderingEngine.addRenderableGizmo(gizmo);

    const renderableGizmos = Reflect.get(renderingEngine as object, 'renderableGizmos') as IRenderableGizmo[];

    expect(renderableGizmos).toEqual([gizmo]);

    renderingEngine.renderScene();
    expect(renderGizmo).not.toHaveBeenCalled();

    renderingEngine.renderGizmos = true;
    renderingEngine.renderScene();

    expect(renderGizmo).toHaveBeenCalledTimes(1);
    expect(renderGizmo).toHaveBeenCalledWith(context);
  });

  it('stores renderable gui elements and renders them during renderScene', () => {
    const context = createCanvasContext();
    const renderingEngine = new RenderingEngine(context);
    const renderGUI = vi.fn();
    const guiElement: IRenderableGUI = { enabled: true, zIndex: 0, renderGUI };

    renderingEngine.addRenderableGUIElement(guiElement);

    const renderableGUIElements = Reflect.get(renderingEngine as object, 'renderableGUIElements') as IRenderableGUI[];

    expect(renderableGUIElements).toEqual([guiElement]);

    renderingEngine.renderScene();

    expect(renderGUI).toHaveBeenCalledTimes(1);
    expect(renderGUI).toHaveBeenCalledWith(context);
  });

  it('stores the main camera and clears it when the camera is destroyed', () => {
    const context = createCanvasContext();
    const renderingEngine = new RenderingEngine(context);
    const camera = createCamera();

    renderingEngine.mainCamera = camera;
    expect(renderingEngine.mainCamera).toBe(camera);

    camera.onDestroy();

    expect(renderingEngine.mainCamera).toBeNull();
  });

  it('stores terrain and background renderers for renderScene', () => {
    const context = createCanvasContext();
    const renderingEngine = new RenderingEngine(context);
    const renderBackground = vi.fn();
    const renderTerrain = vi.fn();
    const background: IRenderableBackground = { renderBackground };
    const terrain = { renderBackground: renderTerrain } as unknown as Terrain;

    renderingEngine.background = background;
    renderingEngine.terrain = terrain;
    renderingEngine.renderScene();

    expect(renderBackground).toHaveBeenCalledTimes(1);
    expect(renderBackground).toHaveBeenCalledWith(context);
    expect(renderTerrain).toHaveBeenCalledTimes(1);
    expect(renderTerrain).toHaveBeenCalledWith(context);
  });
});
