import { IRenderable } from "./Interfaces/IRenderable";
import { IRenderableGizmo } from "./Interfaces/IRenderableGizmo";
import { IRenderableGUI } from "./Interfaces/IRenderableGUI";
import { IRenderableBackground } from "./Interfaces/IRenderableBackground";
import { Terrain } from "./Helpers/Terrain";


export class RenderingEngine {

    public renderGizmos: boolean;

    private _background: IRenderableBackground;
    private _terrain: Terrain;
    private renderableObjects: IRenderable[];
    private renderableGizmos: IRenderableGizmo[];
    private renderableGUIElements: IRenderableGUI[];
    private readonly _canvasContext: CanvasRenderingContext2D;
    

    public constructor(context: CanvasRenderingContext2D) {
        this._canvasContext = context;
        this.renderableObjects = [];
        this.renderableGizmos = [];
        this.renderableGUIElements = [];
        this.renderGizmos = false;
        this._terrain = null;
    }

    public set terrain(terrain: Terrain) {
        this._terrain = terrain;
    }

    public set background(background: IRenderableBackground) {
        this._background = background;
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
        this._background.renderBackground(this._canvasContext);

        if (this._terrain !== null) {
            this._terrain.renderBackground(this._canvasContext);
        }

        for (let object of this.renderableObjects) {
            if (object.enabled) {
                object.render(this._canvasContext);
            }
        }

        if (this.renderGizmos) {
            for (let gizmo of this.renderableGizmos) {
                if (gizmo.enabled) {
                    gizmo.renderGizmo(this._canvasContext);
                }
            }
        }

        for (let guiElement of this.renderableGUIElements) {
            if (guiElement.enabled) {
                guiElement.renderGUI(this._canvasContext);
            }
        }
    }
}