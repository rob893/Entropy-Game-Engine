import { IBackground } from "./Interfaces/IBackground";

export class ImageBackground implements IBackground {
    
    private gameCanvas: HTMLCanvasElement;
    private canvasContext: CanvasRenderingContext2D;
    private image: HTMLImageElement;


    public constructor(gameCanvas: HTMLCanvasElement, imageSrc: string) {
        this.image = new Image(gameCanvas.width, gameCanvas.height);
        this.image.src = imageSrc;
        this.canvasContext = gameCanvas.getContext("2d");
        this.gameCanvas = gameCanvas;
    }
    
    public render(): void {
        this.canvasContext.drawImage(this.image, 0, 0, this.gameCanvas.width, this.gameCanvas.height);
    }
}