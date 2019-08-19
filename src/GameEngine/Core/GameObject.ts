import { Transform } from '../Components/Transform';
import { Component } from '../Components/Component';
import { GameEngine } from './GameEngine';
import { Layer } from './Enums/Layer';
import { Renderable } from './Interfaces/Renderable';
import { PrefabSettings } from './Interfaces/PrefabSettings';
import { Rigidbody } from '../Components/Rigidbody';
import { RectangleCollider } from '../Components/RectangleCollider';
import { RenderableGUI } from './Interfaces/RenderableGUI';
import { RenderableGizmo } from './Interfaces/RenderableGizmo';

export abstract class GameObject {

    public id: string;
    public readonly tag: string;
    public readonly layer: Layer;
    public readonly transform: Transform;

    private isEnabled: boolean;
    private readonly updatableComponents: Component[] = [];
    private readonly componentMap: Map<string, Component[]> = new Map<string, Component[]>();
    private readonly gameEngine: GameEngine;


    public constructor(gameEngine: GameEngine, id?: string, x?: number, y?: number, rotation?: number, tag?: string, layer?: Layer) {
        this.gameEngine = gameEngine;
        this.isEnabled = true;

        const prefabSettings = this.getPrefabSettings();
        
        this.id = id ? id : prefabSettings.id;
        this.transform = new Transform(this, x ? x : prefabSettings.x, y ? y : prefabSettings.y);
        this.transform.rotation = rotation ? rotation : prefabSettings.rotation;
        this.tag = tag ? tag : prefabSettings.tag;
        this.layer = layer ? layer : prefabSettings.layer;

        const initialComponents = this.buildInitialComponents(gameEngine);
        initialComponents.push(this.transform);

        this.setComponents(initialComponents);
        this.buildChildGameObjects(gameEngine);
    }

    public get enabled(): boolean {
        return this.isEnabled;
    }

    public set enabled(enabled: boolean) {
        if (enabled === this.isEnabled) {
            return;
        }

        this.isEnabled = enabled;

        for (const component of this.updatableComponents) {
            if (component.enabled) {
                enabled ? component.onEnabled() : component.onDisable();
            }
        }
    }

    public start(): void {
        this.updatableComponents.forEach(c => c.start());
    }

    public update(): void {
        for (const component of this.updatableComponents) {
            if (component.enabled) {
                component.update();
            }
        }
    }

    /**
     * Use this function to remove one of a game object's components from the update loop. This is used by empty update functions to reduce 
     * the amount of update calls per frame (no point in calling empty update functions).
     * 
     * @param component the component to be removed from this game object's update loop. It MUST be one of the game object's components.
     */
    public removeComponentFromUpdate(component: Component): void {
        if (!this.componentMap.has(component.constructor.name)) {
            throw new Error('This game object does not have a component of type ' + component.constructor.name);
        }

        if (!this.updatableComponents.includes(component)) {
            throw new Error('This game object does not have the component being removed.');
        }

        this.updatableComponents.splice(this.updatableComponents.indexOf(component), 1);
    }

    public hasComponent<T extends Component>(component: new (...args: any[]) => T): boolean {
        return this.componentMap.has(component.name);
    }

    public getComponent<T extends Component>(component: new (...args: any[]) => T): T {
        const componentType = component.name;

        if (!this.componentMap.has(componentType)) {
            return null;
        }

        return this.componentMap.get(componentType)[0] as T;
    }

    public getComponents<T extends Component>(component: new (...args: any[]) => T): T[] {
        const componentType = component.name;

        if (!this.componentMap.has(componentType)) {
            return [];
        }

        return [...this.componentMap.get(componentType)] as T[];
    }

    public getComponentInParent<T extends Component>(component: new (...args: any[]) => T): T {
        let parent = this.transform.parent;

        while (parent !== null) {
            if (parent.gameObject.hasComponent(component)) {
                return parent.gameObject.getComponent(component);
            }

            parent = parent.parent;
        }
        
        return null;
    }

    public getComponentsInParent<T extends Component>(component: new (...args: any[]) => T): T[] {
        let parent = this.transform.parent;
        const components: T[] = [];

        while (parent !== null) {
            if (parent.gameObject.hasComponent(component)) {
                components.push(parent.gameObject.getComponent(component));
            }

            parent = parent.parent;
        }
        
        return components;
    }

    public getComponentInChildren<T extends Component>(component: new (...args: any[]) => T): T {
        const children: Transform[] = this.transform.children;

        while (children.length > 0) {
            const child = children.pop();

            if (child.gameObject.hasComponent(component)) {
                return child.gameObject.getComponent(component);
            }

            for (const childsChild of child.children) {
                children.push(childsChild);
            }
        }
        
        return null;
    }

    public getComponentsInChildren<T extends Component>(component: new (...args: any[]) => T): T[] {
        const children: Transform[] = this.transform.children;
        const components: T[] = [];

        while (children.length > 0) {
            const child = children.pop();

            if (child.gameObject.hasComponent(component)) {
                components.push(child.gameObject.getComponent(component));
            }

            for (const childsChild of child.children) {
                children.push(childsChild);
            }
        }
        
        return components;
    }

    public addComponent<T extends Component>(newComponent: Component): T {
        if (this.componentMap.has(newComponent.constructor.name)) {
            this.componentMap.get(newComponent.constructor.name).push(newComponent);
        }
        else {
            this.componentMap.set(newComponent.constructor.name, [newComponent]);
        }

        this.extractRenderablesCollidersAndRigidbodies(newComponent);
        
        newComponent.enabled = true;
        newComponent.start();

        return newComponent as T;
    }

    public removeComponent(component: Component): void {
        if (!this.componentMap.has(component.constructor.name)) {
            throw new Error('This object does not have a ' + component.constructor.name + ' component!');
        }

        this.updatableComponents.splice(this.updatableComponents.indexOf(component), 1);
        this.componentMap.delete(component.constructor.name);
        component.onDestroy();
    }

    /**
     * This function is meant to be overridden by subclasses that require child game objects. Not making abstract as not all subclasses need it.
     * 
     * @param gameEngine The game engine
     */
    protected buildChildGameObjects(gameEngine: GameEngine): void {}

    /**
     * Meant to be overridden by subclasses to define prefab settings. These settings are overridden by 
     * non-default constructor values.
     */
    protected getPrefabSettings(): PrefabSettings { 
        return {
            x: 0,
            y: 0,
            rotation: 0,
            id: '',
            tag: '',
            layer: Layer.Default
        }; 
    }

    private setComponents(components: Component[]): void {
        for (const component of components) {
            this.updatableComponents.push(component);
            
            if (this.componentMap.has(component.constructor.name)) {
                this.componentMap.get(component.constructor.name).push(component);
            }
            else {
                this.componentMap.set(component.constructor.name, [component]);
            }

            this.extractRenderablesCollidersAndRigidbodies(component);
        }
    }

    private extractRenderablesCollidersAndRigidbodies(component: Component): void {
        if (component instanceof Rigidbody) {
            this.gameEngine.physicsEngine.addRigidbody(component);
        }
        else if (component instanceof RectangleCollider) {
            this.gameEngine.physicsEngine.addCollider(component);
        }

        if (typeof (component as unknown as Renderable).render === 'function') {
            this.gameEngine.renderingEngine.addRenderableObject(component as unknown as Renderable);
        }
        else if (typeof (component as unknown as RenderableGUI).renderGUI === 'function') {
            this.gameEngine.renderingEngine.addRenderableGUIElement(component as unknown as RenderableGUI);
        }
        else if (typeof (component as unknown as RenderableGizmo).renderGizmo === 'function') {
            this.gameEngine.renderingEngine.addRenderableGizmo(component as unknown as RenderableGizmo);
        }
    }

    protected abstract buildInitialComponents(gameEngine: GameEngine): Component[];
}