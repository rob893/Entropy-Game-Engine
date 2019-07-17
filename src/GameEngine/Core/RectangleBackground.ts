import { IRenderable } from "./Interfaces/IRenderable";

export class RectangleBackground implements IRenderable {
    
    private gameCanvas: HTMLCanvasElement;
    private color: string;


    public constructor(gameCanvas: HTMLCanvasElement, color: string) {
        this.color = color;
        this.gameCanvas = gameCanvas;
    }
    
    public render(context: CanvasRenderingContext2D): void {
        context.clearRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);
        context.fillStyle = this.color;
        context.fillRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);
    }
}