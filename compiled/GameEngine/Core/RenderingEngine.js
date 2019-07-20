export class RenderingEngine {
    constructor(context) {
        this._canvasContext = context;
        this.renderableObjects = [];
        this.renderableGizmos = [];
        this.renderableGUIElements = [];
        this.renderGizmos = false;
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