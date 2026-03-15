import 'vitest-canvas-mock';
import { Camera } from '../../components/Camera';
import { Component } from '../../components/Component';
import { GameObject } from '../../game-objects/GameObject';
import { GameEngine } from '../GameEngine';
import { RenderingEngine } from '../RenderingEngine';
import { Layer } from '../enums/Layer';
import { PrefabSettings } from '../interfaces/PrefabSettings';

class EmptyGameObject extends GameObject {
  protected override buildInitialComponents(): Component[] {
    return [];
  }

  protected override getPrefabSettings(): PrefabSettings {
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

class WorldRenderComponent extends Component {
  public constructor(gameObject: GameObject, private readonly events: string[]) {
    super(gameObject);
  }

  public render(_context: CanvasRenderingContext2D): void {
    this.events.push('world');
  }
}

class GuiRenderComponent extends Component {
  public readonly zIndex: number = 0;

  public constructor(gameObject: GameObject, private readonly events: string[]) {
    super(gameObject);
  }

  public renderGUI(_context: CanvasRenderingContext2D): void {
    this.events.push('gui');
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

const getRenderingEngine = (gameEngine: GameEngine): RenderingEngine => {
  return Reflect.get(gameEngine as object, 'renderingEngine') as RenderingEngine;
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Camera', () => {
  it('registers and clears the main camera through the rendering engine', () => {
    const gameEngine = createGameEngine();
    const cameraGameObject = new EmptyGameObject({ gameEngine, id: 'camera', tag: 'camera' });
    const camera = cameraGameObject.addComponent<Camera>(new Camera(cameraGameObject));
    const renderingEngine = getRenderingEngine(gameEngine);

    expect(renderingEngine.mainCamera).toBe(camera);

    cameraGameObject.removeComponent(camera);

    expect(renderingEngine.mainCamera).toBeNull();
  });

  it('follows targets, clamps bounds, and converts coordinates', () => {
    const gameEngine = createGameEngine();
    const cameraGameObject = new EmptyGameObject({ gameEngine, id: 'camera', tag: 'camera' });
    const target = new EmptyGameObject({ gameEngine, id: 'target', tag: 'target' });
    const camera = cameraGameObject.addComponent<Camera>(new Camera(cameraGameObject));

    gameEngine.time.updateTime(0);
    gameEngine.time.updateTime(100);

    camera.followTarget = target.transform;
    camera.smoothSpeed = 10;
    target.transform.setPosition(100, 80);
    camera.update();

    expect(camera.transform.position.x).toBeCloseTo(63.212055882855765);
    expect(camera.transform.position.y).toBeCloseTo(50.56964470628461);

    camera.zoom = 0.05;
    expect(camera.zoom).toBe(0.1);

    camera.followTarget = null;
    camera.viewportWidth = 100;
    camera.viewportHeight = 60;
    camera.zoom = 1;
    camera.setBounds(0, 0, 120, 80);
    camera.transform.setPosition(200, 200);
    camera.update();

    expect(camera.transform.position.x).toBe(70);
    expect(camera.transform.position.y).toBe(50);

    camera.viewportWidth = 200;
    camera.viewportHeight = 100;
    camera.zoom = 2;

    const screenPosition = camera.worldToScreen(80, 60);
    const worldPosition = camera.screenToWorld(screenPosition.x, screenPosition.y);

    expect(screenPosition.x).toBe(120);
    expect(screenPosition.y).toBe(70);
    expect(worldPosition.x).toBe(80);
    expect(worldPosition.y).toBe(60);

    camera.clearBounds();
    camera.smoothSpeed = -1;
    expect(camera.smoothSpeed).toBe(0);
  });

  it('applies the camera transform to world rendering and restores before gui rendering', () => {
    const events: string[] = [];
    const gameEngine = createGameEngine();
    const cameraGameObject = new EmptyGameObject({ gameEngine, id: 'camera', tag: 'camera' });
    const worldGameObject = new EmptyGameObject({ gameEngine, id: 'world', tag: 'world' });
    const guiGameObject = new EmptyGameObject({ gameEngine, id: 'gui', tag: 'gui' });
    const camera = cameraGameObject.addComponent<Camera>(new Camera(cameraGameObject));
    const renderingEngine = getRenderingEngine(gameEngine);
    const originalApplyTransform = camera.applyTransform.bind(camera);
    const originalRestoreTransform = camera.restoreTransform.bind(camera);

    worldGameObject.addComponent<WorldRenderComponent>(new WorldRenderComponent(worldGameObject, events));
    guiGameObject.addComponent<GuiRenderComponent>(new GuiRenderComponent(guiGameObject, events));

    vi.spyOn(camera, 'applyTransform').mockImplementation((context: CanvasRenderingContext2D): void => {
      events.push('apply');
      originalApplyTransform(context);
    });
    vi.spyOn(camera, 'restoreTransform').mockImplementation((context: CanvasRenderingContext2D): void => {
      events.push('restore');
      originalRestoreTransform(context);
    });

    renderingEngine.renderScene();

    expect(camera.viewportWidth).toBe(320);
    expect(camera.viewportHeight).toBe(180);
    expect(events).toEqual(['apply', 'world', 'restore', 'gui']);
  });
});
