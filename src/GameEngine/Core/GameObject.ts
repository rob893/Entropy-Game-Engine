import { Transform } from "../Components/Transform";
import { Component } from "../Components/Component";
import { GameEngine } from "./GameEngine";

export abstract class GameObject {
    
    public id: string;

    protected transform: Transform;
    protected gameCanvas: HTMLCanvasElement;
    protected canvasContext: CanvasRenderingContext2D;
    protected components: Component[] = [];
    protected componentMap: Map<string, Component> = new Map<string, Component>();
    

    public constructor(id: string, x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
        this.id = id;
        this.transform = new Transform(this, x, y, width, height);
    }

    public start(): void {
        this.gameCanvas = GameEngine.Instance.getGameCanvas();
        this.canvasContext = this.gameCanvas.getContext("2d");

        for(let i: number = 0; i < this.components.length; i++) {
            this.components[i].start();
        }
    }

    public update(): void {
        for(let i: number = 0; i < this.components.length; i++) {
            this.components[i].update();
        }
    }

    public getTransform(): Transform {
        return this.transform;
    }

    public getGameCanvas(): HTMLCanvasElement {
        return this.gameCanvas;
    }

    public getComponent<T extends Component>(component: new (...args: any[]) => T): T {
        let componentType = component.name;

        if (!this.componentMap.has(componentType)) {
            throw new Error(componentType + " not found on the GameObject with id of " + this.id + "!");
        }

        return <T>this.componentMap.get(componentType);
    }

    public addComponent<T extends Component>(newComponent: Component): T {
        if (this.componentMap.has(newComponent.constructor.name)) {
            throw new Error("There is already a component of type " + newComponent.constructor.name + " on this object!");
        }

        this.components.push(newComponent);
        this.componentMap.set(newComponent.constructor.name, newComponent);
        newComponent.start();

        return <T>newComponent;
    }

    protected setComponents(components: Component[]): void {
        this.components = components;

        for (let component of components) {
            if (this.componentMap.has(component.constructor.name)) {
                throw new Error("There is already a component of type " + component.constructor.name + " on this object!");
            }

            this.componentMap.set(component.constructor.name, component);
        }
    }
}