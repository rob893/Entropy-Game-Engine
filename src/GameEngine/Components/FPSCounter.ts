import { Component } from "./Component";
import { Time } from "../Core/Time";
import { IRenderableGUI } from "../Core/Interfaces/IRenderableGUI";
import { RenderingEngine } from "../Core/RenderingEngine";

export class FPSCounter extends Component implements IRenderableGUI {

    private numFrames: number = 0;
    private timer: number = 0;
    private FPS: number = 0;


    public start(): void {
        RenderingEngine.instance.addRenderableGUIElement(this);
        RenderingEngine.instance.canvasContext.font = "20px Arial";
    }

    public renderGUI(context: CanvasRenderingContext2D): void {
        this.timer += Time.DeltaTime;
        this.numFrames++;

        if (this.timer >= 0.5) {
            this.FPS = this.numFrames / this.timer;
            this.timer = 0;
            this.numFrames = 0;
        }

        context.fillStyle = 'white';
        context.fillText("FPS: " + this.FPS.toFixed(2), 0, 20);
    }
}