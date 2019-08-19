import { PhysicsEngine } from '../PhysicsEngine';
import { RenderingEngine } from '../RenderingEngine';
import { Component } from '../../Components/Component';
import { Rigidbody } from '../../Components/Rigidbody';
import { RectangleCollider } from '../../Components/RectangleCollider';
import { Renderable } from '../Interfaces/Renderable';
import { RenderableGUI } from '../Interfaces/RenderableGUI';
import { RenderableGizmo } from '../Interfaces/RenderableGizmo';

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
        }
        else if (component instanceof RectangleCollider) {
            this.physicsEngine.addCollider(component);
        }

        if (typeof (component as unknown as Renderable).render === 'function') {
            this.renderingEngine.addRenderableObject(component as unknown as Renderable);
        }
        else if (typeof (component as unknown as RenderableGUI).renderGUI === 'function') {
            this.renderingEngine.addRenderableGUIElement(component as unknown as RenderableGUI);
        }
        else if (typeof (component as unknown as RenderableGizmo).renderGizmo === 'function') {
            this.renderingEngine.addRenderableGizmo(component as unknown as RenderableGizmo);
        }
    }
}