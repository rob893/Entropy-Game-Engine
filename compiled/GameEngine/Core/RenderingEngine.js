export class RenderingEngine {
    constructor() {
        this.renderableObjects = [];
        this.renderableGizmos = [];
        this.renderableGUIElements = [];
        this.renderGizmos = false;
    }
    static get instance() {
        return this._instance || (this._instance = new RenderingEngine());
    }
    set background(background) {
        this._background = background;
    }
    set canvasContext(context) {
        this._canvasContext = context;
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
        this._background.render(this._canvasContext);
        this.renderableObjects.forEach(o => o.render(this._canvasContext));
        if (this.renderGizmos) {
            this.renderableGizmos.forEach(g => g.renderGizmo(this._canvasContext));
        }
        this.renderableGUIElements.forEach(gui => gui.renderGUI(this._canvasContext));
    }
}
//# sourceMappingURL=RenderingEngine.js.map