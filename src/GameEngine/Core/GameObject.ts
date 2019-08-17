import { Transform } from '../Components/Transform';
import { Component } from '../Components/Component';
import { GameEngine } from './GameEngine';
import { Layer } from './Enums/Layer';
import { Vector2 } from './Helpers/Vector2';

export abstract class GameObject {

    public id: string;
    public readonly tag: string;
    public readonly layer: Layer;

    private isEnabled: boolean;
    private readonly _transform: Transform;
    private readonly components: Component[] = [];
    private readonly componentMap: Map<string, Component[]> = new Map<string, Component[]>();
    

    public constructor(id: string, x: number = 0, y: number = 0, tag: string = '', layer: Layer = Layer.Default) {
        this.id = id;
        this._transform = new Transform(this, x, y);
        this.isEnabled = true;
        this.tag = tag;
        this.layer = layer;

        this.setComponents([this._transform]);
    }

    public static findGameObjectById(id: string): GameObject {
        return GameEngine.instance.findGameObjectById(id);
    }

    public static findGameObjectWithTag(tag: string): GameObject {
        return GameEngine.instance.findGameObjectWithTag(tag);
    }

    public static findGameObjectsWithTag(tag: string): GameObject[] {
        return GameEngine.instance.findGameObjectsWithTag(tag);
    }

    public static instantiate(newGameObject: GameObject, position: Vector2 = Vector2.zero, rotation: number = 0, parent: Transform = null): GameObject {
        newGameObject.transform.setPosition(position.x, position.y);
        newGameObject.transform.rotation = rotation;
        newGameObject.transform.parent = parent;
        
        return GameEngine.instance.instantiate(newGameObject);
    }

    public get enabled(): boolean {
        return this.isEnabled;
    }

    public set enabled(enabled: boolean) {
        if (enabled === this.isEnabled) {
            return;
        }

        this.isEnabled = enabled;

        for (const component of this.components) {
            if (component.enabled) {
                enabled ? component.onEnabled() : component.onDisable();
            }
        }
    }

    public get transform(): Transform {
        return this._transform;
    }

    public start(): void {
        this.components.forEach(c => c.start());
    }

    public update(): void {
        for (const component of this.components) {
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

        if (!this.components.includes(component)) {
            throw new Error('This game object does not have the component being removed.');
        }

        this.components.splice(this.components.indexOf(component), 1);
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

        return this.componentMap.get(componentType) as T[];
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
        
        newComponent.enabled = true;
        newComponent.start();

        return newComponent as T;
    }

    public removeComponent(component: Component): void {
        if (!this.componentMap.has(component.constructor.name)) {
            throw new Error('This object does not have a ' + component.constructor.name + ' component!');
        }

        this.components.splice(this.components.indexOf(component), 1);
        this.componentMap.delete(component.constructor.name);
        component.onDestroy();
    }

    protected setComponents(components: Component[]): void {
        for (const component of components) {
            this.components.push(component);
            
            if (this.componentMap.has(component.constructor.name)) {
                this.componentMap.get(component.constructor.name).push(component);
            }
            else {
                this.componentMap.set(component.constructor.name, [component]);
            }
        }
    }
}