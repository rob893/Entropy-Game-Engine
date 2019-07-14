export class ImageBackground {
    constructor(gameCanvas, imageSrc) {
        this.image = new Image(gameCanvas.width, gameCanvas.height);
        this.image.src = imageSrc;
        this.canvasContext = gameCanvas.getContext("2d");
        this.gameCanvas = gameCanvas;
    }
    render() {
        this.canvasContext.drawImage(this.image, 0, 0, this.gameCanvas.width, this.gameCanvas.height);
    }
}
//# sourceMappingURL=ImageBackground.js.map