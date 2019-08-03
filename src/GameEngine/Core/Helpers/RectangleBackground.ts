import { RenderableBackground } from '../Interfaces/RenderableBackground';

export class RectangleBackground implements RenderableBackground {
    
    private readonly gameCanvas: HTMLCanvasElement;
    private readonly color: string;


    public constructor(gameCanvas: HTMLCanvasElement, color: string) {
        this.color = color;
        this.gameCanvas = gameCanvas;
    }
    
    public renderBackground(context: CanvasRenderingContext2D): void {
        context.clearRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);
        context.fillStyle = this.color;
        context.fillRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);
    }
}