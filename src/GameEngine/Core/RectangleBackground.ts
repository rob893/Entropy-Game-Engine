import { IBackground } from "./Interfaces/IBackground";

export class RectangleBackground implements IBackground {
    
    private gameCanvas: HTMLCanvasElement;
    private canvasContext: CanvasRenderingContext2D;
    private color: string;


    public constructor(gameCanvas: HTMLCanvasElement, color: string) {
        this.color = color;
        this.canvasContext = gameCanvas.getContext("2d");
        this.gameCanvas = gameCanvas;
    }
    
    public render(): void {
        this.canvasContext.clearRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);
        this.canvasContext.fillStyle = this.color;
        this.canvasContext.fillRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);
    }
}