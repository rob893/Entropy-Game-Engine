import { GameObject } from '../Core/GameObject';
import { Transform } from './Transform';
import { LiteEvent } from '../Core/Helpers/LiteEvent';
import { CustomLiteEvent } from '../Core/Interfaces/CustomLiteEvent';

export abstract class Component {

    public readonly gameObject: GameObject;

    private isEnabled: boolean;
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
        }
        else {
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
}