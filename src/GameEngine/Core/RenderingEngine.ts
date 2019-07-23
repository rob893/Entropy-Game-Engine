import { IRenderable } from "./Interfaces/IRenderable";
import { IRenderableGizmo } from "./Interfaces/IRenderableGizmo";
import { IRenderableGUI } from "./Interfaces/IRenderableGUI";
import { IRenderableBackground } from "./Interfaces/IRenderableBackground";
import { FloorTile } from "./FloorTile";
import { Sprite } from "./Sprite";
import { Vector2 } from "./Vector2";
import FloorTileImage from "../../assets/images/DungeonTileset.png";
import { LevelBuilder } from "./LevelBuilder";

export class RenderingEngine {

    private static _instance: RenderingEngine;

    public renderGizmos: boolean;

    private _background: IRenderableBackground;
    private backgroundObjects: IRenderableBackground[];
    private renderableObjects: IRenderable[];
    private renderableGizmos: IRenderableGizmo[];
    private renderableGUIElements: IRenderableGUI[];
    private readonly _canvasContext: CanvasRenderingContext2D;
    private test: HTMLImageElement;
    private ready = false;
    

    public constructor(context: CanvasRenderingContext2D) {
        this._canvasContext = context;
        this.backgroundObjects = [];
        this.renderableObjects = [];
        this.renderableGizmos = [];
        this.renderableGUIElements = [];
        this.renderGizmos = false;

        // for (let x = 0; x < 700; x += 20) {
        //     for (let y = 0; y < 400; y += 20) {
        //         this.backgroundObjects.push(new FloorTile(new Sprite(FloorTileImage, 16, 64, 16, 16), 20, new Vector2(x, y)));
        //     }
        // }
        this.setThing();
    }

    private async setThing() {
        this.test = await LevelBuilder.combineImages(FloorTileImage, 16, 64, 16, 16, 50, 50);
        this.ready = true;

    }

    public static get instance(): RenderingEngine {
        if (this._instance === null || this._instance === undefined) {
            throw new Error('The instance has not been created yet. Call the buildRenderingEngine() function first.');
        }

        return this._instance;
    }

    public static buildRenderingEngine(context: CanvasRenderingContext2D): RenderingEngine {
        this._instance = new RenderingEngine(context);

        return this._instance;
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

        if (this.ready) {
            this._canvasContext.drawImage(this.test, 0, 0);
        }
        
        // for (let object of this.backgroundObjects) {
        //     object.renderBackground(this._canvasContext);
        // }

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