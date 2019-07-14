import { Component } from "./Component";
export class RectangleRenderer extends Component {
    constructor(gameObject, color) {
        super(gameObject);
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
        this.canvasContext.fillRect(this.transform.position.x, this.transform.position.y, this.transform.width, this.transform.height);
    }
}
//# sourceMappingURL=RectangleRenderer.js.map