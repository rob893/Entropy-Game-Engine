import type { Camera } from '../components/Camera';
import { Component } from '../components/Component';
import type { Terrain } from '../game-objects/Terrain';
import type { IUnsubscribable } from './helpers';
import type { IRenderable } from './types';
import type { IRenderableGizmo } from './types';
import type { IRenderableGUI } from './types';
import type { IRenderableBackground } from './types';

export class RenderingEngine {
  public renderGizmos: boolean;

  private readonly renderableObjects: IRenderable[];

  private readonly renderableGizmos: IRenderableGizmo[];

  private readonly renderableGUIElements: IRenderableGUI[];

  private mainCameraDestroyedSubscription: IUnsubscribable | null;

  #background: IRenderableBackground | null;

  #terrain: Terrain | null;

  #mainCamera: Camera | null;

  readonly #canvasContext: CanvasRenderingContext2D;

  public constructor(context: CanvasRenderingContext2D) {
    this.#canvasContext = context;
    this.renderableObjects = [];
    this.renderableGizmos = [];
    this.renderableGUIElements = [];
    this.renderGizmos = false;
    this.#terrain = null;
    this.#background = null;
    this.#mainCamera = null;
    this.mainCameraDestroyedSubscription = null;
  }

  public set terrain(terrain: Terrain) {
    this.#terrain = terrain;
  }

  public set background(background: IRenderableBackground) {
    this.#background = background;
  }

  public get canvasContext(): CanvasRenderingContext2D {
    return this.#canvasContext;
  }

  public get mainCamera(): Camera | null {
    return this.#mainCamera;
  }

  public set mainCamera(camera: Camera | null) {
    this.mainCameraDestroyedSubscription?.unsubscribe();
    this.mainCameraDestroyedSubscription = null;
    this.#mainCamera = camera;

    if (camera !== null) {
      this.mainCameraDestroyedSubscription = camera.onDestroyed.subscribe(() => {
        if (this.#mainCamera === camera) {
          this.#mainCamera = null;
          this.mainCameraDestroyedSubscription = null;
        }
      });
    }
  }

  public addRenderableObject(object: IRenderable): void {
    this.renderableObjects.push(object);

    if (object instanceof Component) {
      object.onDestroyed.subscribe(() => {
        const index = this.renderableObjects.indexOf(object);

        if (index !== -1) {
          this.renderableObjects.splice(index, 1);
        }
      });
    }
  }

  public addRenderableGizmo(gizmo: IRenderableGizmo): void {
    this.renderableGizmos.push(gizmo);

    if (gizmo instanceof Component) {
      gizmo.onDestroyed.subscribe(() => {
        const index = this.renderableGizmos.indexOf(gizmo);

        if (index !== -1) {
          this.renderableGizmos.splice(index, 1);
        }
      });
    }
  }

  public addRenderableGUIElement(guiElement: IRenderableGUI): void {
    this.renderableGUIElements.push(guiElement);
    this.renderableGUIElements.sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

    if (guiElement instanceof Component) {
      guiElement.onDestroyed.subscribe(() => {
        const index = this.renderableGUIElements.indexOf(guiElement);

        if (index !== -1) {
          this.renderableGUIElements.splice(index, 1);
        }
      });
    }
  }

  public renderScene(): void {
    this.#canvasContext.clearRect(0, 0, this.#canvasContext.canvas.width, this.#canvasContext.canvas.height);

    if (this.#background !== null) {
      this.#background.renderBackground(this.#canvasContext);
    }

    const camera = this.#mainCamera !== null && this.#mainCamera.enabled ? this.#mainCamera : null;

    if (camera !== null) {
      camera.viewportWidth = this.#canvasContext.canvas.width;
      camera.viewportHeight = this.#canvasContext.canvas.height;
      camera.applyTransform(this.#canvasContext);
    }

    try {
      if (this.#terrain !== null) {
        this.#terrain.renderBackground(this.#canvasContext);
      }

      for (const object of this.renderableObjects) {
        if (object.enabled) {
          object.render(this.#canvasContext);
        }
      }

      if (this.renderGizmos) {
        for (const gizmo of this.renderableGizmos) {
          if (gizmo.enabled) {
            gizmo.renderGizmo(this.#canvasContext);
          }
        }
      }

      // GUI elements parented to world objects render in world space
      for (const guiElement of this.renderableGUIElements) {
        if (guiElement.enabled && this.isWorldSpaceGUI(guiElement)) {
          guiElement.renderGUI(this.#canvasContext);
        }
      }
    } catch (error) {
      console.error('Rendering error:', error);
    } finally {
      if (camera !== null) {
        camera.restoreTransform(this.#canvasContext);
      }
    }

    // Screen-space GUI elements render without camera transform
    for (const guiElement of this.renderableGUIElements) {
      if (guiElement.enabled && !this.isWorldSpaceGUI(guiElement)) {
        guiElement.renderGUI(this.#canvasContext);
      }
    }
  }

  private isWorldSpaceGUI(guiElement: IRenderableGUI): boolean {
    return guiElement instanceof Component && guiElement.transform.parent !== null;
  }
}
