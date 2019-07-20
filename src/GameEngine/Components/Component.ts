import { GameObject } from "../Core/GameObject";
import { Transform } from "./Transform";

export abstract class Component {

    public readonly gameObject: GameObject;

    private isEnabled: boolean;


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

    public get transform(): Transform {
        return this.gameObject.transform;
    }

    public onEnabled(): void {}

    public start(): void {}

    public update(): void {}

    public onDisable(): void {}

    public onDestroy(): void {}
}