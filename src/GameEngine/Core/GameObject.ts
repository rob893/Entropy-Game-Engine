import { Transform } from '../Components/Transform';
import { Component } from '../Components/Component';

export abstract class GameObject {
    
    public id: string;
    public tag: string;

    protected readonly _transform: Transform;
    protected readonly components: Component[] = [];
    protected readonly componentMap: Map<string, Component[]> = new Map<string, Component[]>();

    private isEnabled: boolean;
    

    public constructor(id: string, x: number = 0, y: number = 0, tag: string = '') {
        this.id = id;
        this._transform = new Transform(this, x, y);
        this.isEnabled = true;
        this.tag = tag;
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

    public get enabled(): boolean {
        return this.isEnabled;
    }

    public get transform(): Transform {
        return this._transform;
    }

    public hasComponent<T extends Component>(component: new (...args: any[]) => T): boolean {
        return this.componentMap.has(component.name);
    }

    public getComponent<T extends Component>(component: new (...args: any[]) => T): T {
        const componentType = component.name;

        if (!this.componentMap.has(componentType)) {
            throw new Error(componentType + ' not found on the GameObject with id of ' + this.id + '!');
        }

        return this.componentMap.get(componentType)[0] as T;
    }

    public getComponents<T extends Component>(component: new (...args: any[]) => T): T[] {
        const componentType = component.name;

        if (!this.componentMap.has(componentType)) {
            throw new Error(componentType + ' not found on the GameObject with id of ' + this.id + '!');
        }

        return this.componentMap.get(componentType) as T[];
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