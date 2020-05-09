import { PhysicsEngine } from '../PhysicsEngine';
import { RenderingEngine } from '../RenderingEngine';
import { Component } from '../../components/Component';
import { Rigidbody } from '../../components/Rigidbody';
import { RectangleCollider } from '../../components/RectangleCollider';
import { Renderable } from '../interfaces/Renderable';
import { RenderableGUI } from '../interfaces/RenderableGUI';
import { RenderableGizmo } from '../interfaces/RenderableGizmo';

export class ComponentAnalyzer {
  private readonly physicsEngine: PhysicsEngine;
  private readonly renderingEngine: RenderingEngine;

  public constructor(physicsEngine: PhysicsEngine, renderingEngine: RenderingEngine) {
    this.physicsEngine = physicsEngine;
    this.renderingEngine = renderingEngine;
  }

  public extractRenderablesCollidersAndRigidbodies(component: Component): void {
    if (component instanceof Rigidbody) {
      this.physicsEngine.addRigidbody(component);
    } else if (component instanceof RectangleCollider) {
      this.physicsEngine.addCollider(component);
    }

    if (typeof ((component as unknown) as Renderable).render === 'function') {
      this.renderingEngine.addRenderableObject((component as unknown) as Renderable);
    } else if (typeof ((component as unknown) as RenderableGUI).renderGUI === 'function') {
      this.renderingEngine.addRenderableGUIElement((component as unknown) as RenderableGUI);
    } else if (typeof ((component as unknown) as RenderableGizmo).renderGizmo === 'function') {
      this.renderingEngine.addRenderableGizmo((component as unknown) as RenderableGizmo);
    }
  }
}
