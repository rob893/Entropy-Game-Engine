import { Camera } from '../../components/Camera';
import type { Component } from '../../components/Component';
import { RectangleCollider } from '../../components/RectangleCollider';
import { Rigidbody } from '../../components/Rigidbody';
import type { PhysicsEngine } from '../PhysicsEngine';
import type { RenderingEngine } from '../RenderingEngine';
import type { IRenderable } from '../types';
import type { IRenderableGUI } from '../types';
import type { IRenderableGizmo } from '../types';

function isRenderable(component: Component): component is Component & IRenderable {
  return 'render' in component && typeof (component as Record<string, unknown>).render === 'function';
}

function isRenderableGUI(component: Component): component is Component & IRenderableGUI {
  return 'renderGUI' in component && typeof (component as Record<string, unknown>).renderGUI === 'function';
}

function isRenderableGizmo(component: Component): component is Component & IRenderableGizmo {
  return 'renderGizmo' in component && typeof (component as Record<string, unknown>).renderGizmo === 'function';
}

export class ComponentAnalyzer {
  private readonly physicsEngine: PhysicsEngine;

  private readonly renderingEngine: RenderingEngine;

  public constructor(physicsEngine: PhysicsEngine, renderingEngine: RenderingEngine) {
    this.physicsEngine = physicsEngine;
    this.renderingEngine = renderingEngine;
  }

  public extractRenderablesCollidersAndRigidbodies(component: Component): void {
    if (component instanceof Camera) {
      this.renderingEngine.mainCamera = component;
    }

    if (component instanceof Rigidbody) {
      this.physicsEngine.addRigidbody(component);
    } else if (component instanceof RectangleCollider) {
      this.physicsEngine.addCollider(component);
    }

    if (isRenderable(component)) {
      this.renderingEngine.addRenderableObject(component);
    } else if (isRenderableGUI(component)) {
      this.renderingEngine.addRenderableGUIElement(component);
    } else if (isRenderableGizmo(component)) {
      this.renderingEngine.addRenderableGizmo(component);
    }
  }
}
