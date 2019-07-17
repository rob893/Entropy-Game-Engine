import { IRenderable } from "./Interfaces/IRenderable";
import { IRenderableGizmo } from "./Interfaces/IRenderableGizmo";
import { IRenderableGUI } from "./Interfaces/IRenderableGUI";

export class RenderingEngine {

    private static _instance: RenderingEngine;

    public renderGizmos: boolean;

    private _background: IRenderable;
    private renderableObjects: IRenderable[];
    private renderableGizmos: IRenderableGizmo[];
    private renderableGUIElements: IRenderableGUI[];
    private _canvasContext: CanvasRenderingContext2D;
    

    public constructor() {
        this.renderableObjects = [];
        this.renderableGizmos = [];
        this.renderableGUIElements = [];
        this.renderGizmos = false;
    }

    public static get instance(): RenderingEngine {
        return this._instance || (this._instance = new RenderingEngine());
    }

    public set background(background: IRenderable) {
        this._background = background;
    }

    public set canvasContext(context: CanvasRenderingContext2D) {
        this._canvasContext = context;
    }

    public get canvasContext(): CanvasRenderingContext2D {
        return this._canvasContext;
    }

    public addRenderableObject(object: IRenderable): void {
        this.renderableObjects.push(object);
    }

    public addRenderableGizmo(gizmo: IRenderableGizmo): void {
        this.renderableGizmos.push(gizmo);
    }

    public addRenderableGUIElement(guiElement: IRenderableGUI) {
        this.renderableGUIElements.push(guiElement);
    }

    public renderScene(): void {
        this._background.render(this._canvasContext);
        this.renderableObjects.forEach(o => o.render(this._canvasContext));

        if (this.renderGizmos) {
            this.renderableGizmos.forEach(g => g.renderGizmo(this._canvasContext));
        }
        
        this.renderableGUIElements.forEach(gui => gui.renderGUI(this._canvasContext));
    }
}