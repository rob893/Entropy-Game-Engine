export class ImageBackground {
    constructor(gameCanvas, imageSrc) {
        this.image = new Image(gameCanvas.width, gameCanvas.height);
        this.image.src = imageSrc;
        this.gameCanvas = gameCanvas;
    }
    renderBackground(context) {
        context.drawImage(this.image, 0, 0, this.gameCanvas.width, this.gameCanvas.height);
    }
}
//# sourceMappingURL=ImageBackground.js.map