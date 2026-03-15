import { Renderable } from './interfaces/Renderable';
import { RenderableGizmo } from './interfaces/RenderableGizmo';
import { RenderableGUI } from './interfaces/RenderableGUI';
import { RenderableBackground } from './interfaces/RenderableBackground';
import { Unsubscribable } from './helpers';
import { Terrain } from '../game-objects/Terrain';
import { Camera } from '../components/Camera';
import { Component } from '../components/Component';

export class RenderingEngine {
  public renderGizmos: boolean;

  private _background: RenderableBackground | null;
  private _terrain: Terrain | null;
  private _mainCamera: Camera | null;
  private readonly renderableObjects: Renderable[];
  private readonly renderableGizmos: RenderableGizmo[];
  private readonly renderableGUIElements: RenderableGUI[];
  private readonly _canvasContext: CanvasRenderingContext2D;
  private mainCameraDestroyedSubscription: Unsubscribable | null;

  public constructor(context: CanvasRenderingContext2D) {
    this._canvasContext = context;
    this.renderableObjects = [];
    this.renderableGizmos = [];
    this.renderableGUIElements = [];
    this.renderGizmos = false;
    this._terrain = null;
    this._background = null;
    this._mainCamera = null;
    this.mainCameraDestroyedSubscription = null;
  }

  public set terrain(terrain: Terrain) {
    this._terrain = terrain;
  }

  public set background(background: RenderableBackground) {
    this._background = background;
  }

  public get canvasContext(): CanvasRenderingContext2D {
    return this._canvasContext;
  }

  public get mainCamera(): Camera | null {
    return this._mainCamera;
  }

  public set mainCamera(camera: Camera | null) {
    this.mainCameraDestroyedSubscription?.unsubscribe();
    this.mainCameraDestroyedSubscription = null;
    this._mainCamera = camera;

    if (camera !== null) {
      this.mainCameraDestroyedSubscription = camera.onDestroyed.subscribe(() => {
        if (this._mainCamera === camera) {
          this._mainCamera = null;
          this.mainCameraDestroyedSubscription = null;
        }
      });
    }
  }

  public addRenderableObject(object: Renderable): void {
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

  public addRenderableGizmo(gizmo: RenderableGizmo): void {
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

  public addRenderableGUIElement(guiElement: RenderableGUI): void {
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
    this._canvasContext.clearRect(0, 0, this._canvasContext.canvas.width, this._canvasContext.canvas.height);

    if (this._background !== null) {
      this._background.renderBackground(this._canvasContext);
    }

    const camera = this._mainCamera !== null && this._mainCamera.enabled ? this._mainCamera : null;

    if (camera !== null) {
      camera.viewportWidth = this._canvasContext.canvas.width;
      camera.viewportHeight = this._canvasContext.canvas.height;
      camera.applyTransform(this._canvasContext);
    }

    try {
      if (this._terrain !== null) {
        this._terrain.renderBackground(this._canvasContext);
      }

      for (const object of this.renderableObjects) {
        if (object.enabled) {
          object.render(this._canvasContext);
        }
      }

      if (this.renderGizmos) {
        for (const gizmo of this.renderableGizmos) {
          if (gizmo.enabled) {
            gizmo.renderGizmo(this._canvasContext);
          }
        }
      }
    } finally {
      if (camera !== null) {
        camera.restoreTransform(this._canvasContext);
      }
    }

    for (const guiElement of this.renderableGUIElements) {
      if (guiElement.enabled) {
        guiElement.renderGUI(this._canvasContext);
      }
    }
  }
}
