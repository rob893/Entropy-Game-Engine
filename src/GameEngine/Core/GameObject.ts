import { Transform } from '../Components/Transform';
import { Component } from '../Components/Component';
import { GameEngine } from './GameEngine';
import { Layer } from './Enums/Layer';
import { PrefabSettings } from './Interfaces/PrefabSettings';
import { ComponentAnalyzer } from './Helpers/ComponentAnalyzer';
import { Input } from './Helpers/Input';
import { Physics } from './Physics/Physics';
import { SceneManager } from './Helpers/SceneManager';
import { AssetPool } from './Helpers/AssetPool';
import { Time } from './Time';
import { Vector2 } from './Helpers/Vector2';
import { Terrain } from './Helpers/Terrain';


export abstract class GameObject {

    public id: string;
    public readonly tag: string;
    public readonly layer: Layer;
    public readonly transform: Transform;

    private isEnabled: boolean;
    private readonly updatableComponents: Component[] = [];
    private readonly componentMap: Map<string, Component[]> = new Map<string, Component[]>();
    private readonly componentAnalyzer: ComponentAnalyzer;
    private readonly gameEngine: GameEngine;


    public constructor(gameEngine: GameEngine, id?: string, x?: number, y?: number, rotation?: number, tag?: string, layer?: Layer) {
        this.gameEngine = gameEngine;
        this.isEnabled = true;
        this.componentAnalyzer = gameEngine.componentAnalyzer;

        const prefabSettings = this.getPrefabSettings();
        
        this.id = id ? id : prefabSettings.id;
        this.transform = new Transform(this, x ? x : prefabSettings.x, y ? y : prefabSettings.y);
        this.transform.rotation = rotation ? rotation : prefabSettings.rotation;
        this.tag = tag ? tag : prefabSettings.tag;
        this.layer = layer ? layer : prefabSettings.layer;

        const initialComponents = this.buildInitialComponents(); //move this into prefab settings
        initialComponents.push(this.transform);

        this.setComponents(initialComponents);

        const childGameObjects = this.buildAndReturnChildGameObjects(gameEngine);

        for (const child of childGameObjects) {
            child.transform.parent = this.transform;
        }
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

    public get input(): Input {
        return this.gameEngine.input;
    }

    public get physics(): Physics {
        return this.gameEngine.physics;
    }

    public get sceneManager(): SceneManager {
        return this.gameEngine.sceneManager;
    }

    public get assetPool(): AssetPool {
        return this.gameEngine.assetPool;
    }

    public get time(): Time {
        return this.gameEngine.time;
    }

    public get gameCanvas(): HTMLCanvasElement {
        return this.gameEngine.gameCanvas;
    }

    public get terrain(): Terrain {
        return this.gameEngine.terrain;
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

    public findGameObjectById(id: string): GameObject {
        return this.gameEngine.findGameObjectById(id);
    }

    public findGameObjectWithTag(tag: string): GameObject {
        return this.gameEngine.findGameObjectWithTag(tag);
    }

    public findGameObjectsWithTag(tag: string): GameObject[] {
        return this.gameEngine.findGameObjectsWithTag(tag);
    }

    public instantiate<T extends GameObject>(type: new (gameEngine: GameEngine) => T, position?: Vector2, rotation?: number, parent?: Transform): GameObject {
        return this.gameEngine.instantiate(type, position, rotation, parent);
    }

    public destroy(object: GameObject, time: number = 0): void {
        this.gameEngine.destroy(object, time);
    }

    /**
     * Use this function to remove one of a game object's components from the update loop. This is used by empty update functions to reduce 
     * the amount of update calls per frame (no point in calling empty update functions).
     * 
     * @param component the component to be removed from this game object's update loop. It MUST be one of the game object's components.
     */
    public removeComponentFromUpdate(component: Component): void {
        if (!this.componentMap.has(component.constructor.name)) {
            throw new Error(`This game object does not have a component of type ${component.constructor.name}`);
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

        this.componentAnalyzer.extractRenderablesCollidersAndRigidbodies(newComponent);
        
        newComponent.enabled = true;
        newComponent.start();

        return newComponent as T;
    }

    public removeComponent(component: Component): void {
        if (!this.componentMap.has(component.constructor.name)) {
            throw new Error(`This object does not have a ${component.constructor.name} component!`);
        }

        this.updatableComponents.splice(this.updatableComponents.indexOf(component), 1);
        this.componentMap.delete(component.constructor.name);
        component.onDestroy();
    }

    public onDestroy(): void {
        for (const componentType of this.componentMap.values()) {
            for (const component of componentType) {
                component.onDestroy();
            }
        }
    }

    /**
     * This function is meant to be overridden by subclasses that require child game objects. Not making abstract as not all subclasses need it.
     * 
     * @param gameEngine The game engine
     */
    protected buildAndReturnChildGameObjects(gameEngine: GameEngine): GameObject[] { return []; }

    private setComponents(components: Component[]): void {
        for (const component of components) {
            this.updatableComponents.push(component);
            
            if (this.componentMap.has(component.constructor.name)) {
                this.componentMap.get(component.constructor.name).push(component);
            }
            else {
                this.componentMap.set(component.constructor.name, [component]);
            }

            this.componentAnalyzer.extractRenderablesCollidersAndRigidbodies(component);
        }
    }

    /**
     * These settings are overridden by non-default constructor values.
     */
    protected abstract getPrefabSettings(): PrefabSettings;
    protected abstract buildInitialComponents(): Component[];
}