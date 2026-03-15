import type { PhysicsEngine } from '../PhysicsEngine';
import type { RenderingEngine } from '../RenderingEngine';
import type { Component } from '../../components/Component';
import { Camera } from '../../components/Camera';
import { Rigidbody } from '../../components/Rigidbody';
import { RectangleCollider } from '../../components/RectangleCollider';
import type { IRenderable } from '../types';
import type { IRenderableGUI } from '../types';
import type { IRenderableGizmo } from '../types';

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

    if (typeof (component as unknown as IRenderable).render === 'function') {
      this.renderingEngine.addRenderableObject(component as unknown as IRenderable);
    } else if (typeof (component as unknown as IRenderableGUI).renderGUI === 'function') {
      this.renderingEngine.addRenderableGUIElement(component as unknown as IRenderableGUI);
    } else if (typeof (component as unknown as IRenderableGizmo).renderGizmo === 'function') {
      this.renderingEngine.addRenderableGizmo(component as unknown as IRenderableGizmo);
    }
  }
}
