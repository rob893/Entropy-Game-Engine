export class RectangleBackground {
    constructor(gameCanvas, color) {
        this.color = color;
        this.canvasContext = gameCanvas.getContext("2d");
        this.gameCanvas = gameCanvas;
    }
    render() {
        this.canvasContext.clearRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);
        this.canvasContext.fillStyle = this.color;
        this.canvasContext.fillRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);
    }
}
//# sourceMappingURL=RectangleBackground.js.map