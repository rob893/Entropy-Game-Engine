import { Component } from "./Component";
import { GameEngine } from "../Core/GameEngine";
export class RectangleRenderer extends Component {
    constructor(gameObject, renderWidth, renderHeight, color) {
        super(gameObject);
        this.renderWidth = renderWidth;
        this.renderHeight = renderHeight;
        this.color = color;
        GameEngine.instance.renderingEngine.addRenderableObject(this);
    }
    setColor(color) {
        this.color = color;
    }
    render(context) {
        context.fillStyle = this.color;
        context.fillRect(this.transform.position.x - (this.renderWidth / 2), this.transform.position.y - this.renderHeight, this.renderWidth, this.renderHeight);
    }
}
//# sourceMappingURL=RectangleRenderer.js.map