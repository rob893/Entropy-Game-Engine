var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import FloorTileImage from "../../assets/images/DungeonTileset.png";
import { LevelBuilder } from "./Helpers/LevelBuilder";
import { LevelSpec } from "./Helpers/LevelSpec";
export class RenderingEngine {
    constructor(context) {
        this.ready = false;
        this._canvasContext = context;
        this.backgroundObjects = [];
        this.renderableObjects = [];
        this.renderableGizmos = [];
        this.renderableGUIElements = [];
        this.renderGizmos = false;
        this.setThing();
    }
    setThing() {
        return __awaiter(this, void 0, void 0, function* () {
            const builder = new LevelBuilder();
            yield builder.using(FloorTileImage);
            this.test = yield builder.buildMap(LevelSpec.getSpec(), 2);
            this.ready = true;
        });
    }
    static get instance() {
        if (this._instance === null || this._instance === undefined) {
            throw new Error('The instance has not been created yet. Call the buildRenderingEngine() function first.');
        }
        return this._instance;
    }
    static buildRenderingEngine(context) {
        this._instance = new RenderingEngine(context);
        return this._instance;
    }
    set background(background) {
        this._background = background;
    }
    get canvasContext() {
        return this._canvasContext;
    }
    addRenderableObject(object) {
        this.renderableObjects.push(object);
    }
    addRenderableGizmo(gizmo) {
        this.renderableGizmos.push(gizmo);
    }
    addRenderableGUIElement(guiElement) {
        this.renderableGUIElements.push(guiElement);
    }
    renderScene() {
        this._background.renderBackground(this._canvasContext);
        if (this.ready) {
            this._canvasContext.drawImage(this.test.terrainImage, 0, 0);
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
//# sourceMappingURL=RenderingEngine.js.map