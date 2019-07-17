import { Component } from "./Component";
export class RectangleRenderer extends Component {
    constructor(gameObject, renderWidth, renderHeight, color) {
        super(gameObject);
        this.renderWidth = renderWidth;
        this.renderHeight = renderHeight;
        this.transform = gameObject.getTransform();
        this.color = color;
    }
    start() {
        this.gameCanvas = this.gameObject.getGameCanvas();
        this.canvasContext = this.gameCanvas.getContext("2d");
    }
    update() {
        this.render();
    }
    setColor(color) {
        this.color = color;
    }
    render() {
        this.canvasContext.fillStyle = this.color;
        this.canvasContext.fillRect(this.transform.position.x - (this.renderWidth / 2), this.transform.position.y - this.renderHeight, this.renderWidth, this.renderHeight);
    }
}
//# sourceMappingURL=RectangleRenderer.js.map