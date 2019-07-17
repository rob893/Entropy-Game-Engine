export class RectangleBackground {
    constructor(gameCanvas, color) {
        this.color = color;
        this.gameCanvas = gameCanvas;
    }
    render(context) {
        context.clearRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);
        context.fillStyle = this.color;
        context.fillRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);
    }
}
//# sourceMappingURL=RectangleBackground.js.map