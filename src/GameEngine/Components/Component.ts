import { GameObject } from '../GameObjects/GameObject';
import { Transform } from './Transform';
import { LiteEvent } from '../Core/Helpers/LiteEvent';
import { CustomLiteEvent } from '../Core/Interfaces/CustomLiteEvent';
import { Input } from '../Core/Helpers/Input';
import { Time } from '../Core/Time';
import { AssetPool } from '../Core/Helpers/AssetPool';
import { SceneManager } from '../Core/Helpers/SceneManager';
import { Physics } from '../Core/Physics/Physics';
import { GameEngine } from '../Core/GameEngine';
import { Vector2 } from '../Core/Helpers/Vector2';
import { Terrain } from '../GameObjects/Terrain';
import { GameObjectConstructionParams } from '../Core/Interfaces/GameObjectConstructionParams';

export abstract class Component {
    public readonly gameObject: GameObject;

    private isEnabled: boolean = true;
    private readonly _onDestroyed = new LiteEvent<Component>();

    public constructor(gameObject: GameObject, enabled: boolean = true) {
        this.gameObject = gameObject;
        this.enabled = enabled;
    }

    public set enabled(enabled: boolean) {
        if (enabled === this.isEnabled) {
            return;
        }

        this.isEnabled = enabled;

        if (enabled) {
            this.onEnabled();
        } else {
            this.onDisable();
        }
    }

    public get enabled(): boolean {
        if (!this.gameObject.enabled) {
            return false;
        }

        return this.isEnabled;
    }

    public get tag(): string {
        return this.gameObject.tag;
    }

    public get id(): string {
        return this.gameObject.id;
    }

    public get transform(): Transform {
        return this.gameObject.transform;
    }

    public get onDestroyed(): CustomLiteEvent<Component> {
        return this._onDestroyed.expose();
    }

    public onEnabled(): void {}

    public start(): void {}

    /**
     * This function is called once every frame. Override this function in derived components if accessing the update loop is needed.
     * Do not call super() as the original implementaiton will remove itself from the update loop for performance reasons (no point in invoking a bunch of empty update methods).
     */
    public update(): void {
        this.gameObject.removeComponentFromUpdate(this);
    }

    public onDisable(): void {}

    public onDestroy(): void {
        this._onDestroyed.trigger(this);
    }

    //These are simply short cut methods to access the gameObject's functionality from a component quicker.
    public hasComponent<T extends Component>(component: new (...args: any[]) => T): boolean {
        return this.gameObject.hasComponent(component);
    }

    public getComponent<T extends Component>(component: new (...args: any[]) => T): T | null {
        return this.gameObject.getComponent(component);
    }

    public getComponents<T extends Component>(component: new (...args: any[]) => T): T[] {
        return this.gameObject.getComponents(component);
    }

    public getComponentInParent<T extends Component>(component: new (...args: any[]) => T): T | null {
        return this.gameObject.getComponentInParent(component);
    }

    public getComponentsInParent<T extends Component>(component: new (...args: any[]) => T): T[] {
        return this.gameObject.getComponentsInParent(component);
    }

    public getComponentInChildren<T extends Component>(component: new (...args: any[]) => T): T | null {
        return this.gameObject.getComponentInChildren(component);
    }

    public getComponentsInChildren<T extends Component>(component: new (...args: any[]) => T): T[] {
        return this.gameObject.getComponentsInChildren(component);
    }

    public addComponent<T extends Component>(newComponent: Component): T {
        return this.gameObject.addComponent(newComponent);
    }

    public removeComponent(component: Component): void {
        this.gameObject.removeComponent(component);
    }

    protected get input(): Input {
        return this.gameObject.input;
    }

    protected get time(): Time {
        return this.gameObject.time;
    }

    protected get assetPool(): AssetPool {
        return this.gameObject.assetPool;
    }

    protected get sceneManager(): SceneManager {
        return this.gameObject.sceneManager;
    }

    protected get physics(): Physics {
        return this.gameObject.physics;
    }

    protected get gameCanvas(): HTMLCanvasElement {
        return this.gameObject.gameCanvas;
    }

    protected get terrain(): Terrain {
        return this.gameObject.terrain;
    }

    protected findGameObjectById(id: string): GameObject | null {
        return this.gameObject.findGameObjectById(id);
    }

    protected findGameObjectWithTag(tag: string): GameObject | null {
        return this.gameObject.findGameObjectWithTag(tag);
    }

    protected findGameObjectsWithTag(tag: string): GameObject[] {
        return this.gameObject.findGameObjectsWithTag(tag);
    }

    protected instantiate<T extends GameObject>(
        type: new (constructionParams: GameObjectConstructionParams) => T,
        position?: Vector2,
        rotation?: number,
        parent?: Transform
    ): GameObject {
        return this.gameObject.instantiate(type, position, rotation, parent);
    }

    protected destroy(object: GameObject, time: number = 0): void {
        this.gameObject.destroy(object, time);
    }

    protected invoke(funcToInvoke: () => void, time: number): void {
        this.gameObject.invoke(funcToInvoke, time);
    }

    protected invokeRepeating(funcToInvoke: () => void, repeatRate: number, cancelToken?: { cancel: boolean }): void {
        this.gameObject.invokeRepeating(funcToInvoke, repeatRate, cancelToken);
    }
}
