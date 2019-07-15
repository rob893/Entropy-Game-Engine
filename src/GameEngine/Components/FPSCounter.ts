import { Component } from "./Component";
import { Time } from "../Core/Time";
import { GameEngine } from "../Core/GameEngine";

export class FPSCounter extends Component {

    private numFrames: number = 0;
    private timer: number = 0;
    private FPS: number = 0;
    private canvasContext: CanvasRenderingContext2D;


    public start(): void {
        this.canvasContext = GameEngine.Instance.getGameCanvasContext();
        this.canvasContext.font = "20px Arial";
    }

    public update(): void {
        this.timer += Time.DeltaTime;
        this.numFrames++;

        if (this.timer >= 0.5) {
            this.FPS = this.numFrames / this.timer;
            this.timer = 0;
            this.numFrames = 0;
        }

        this.canvasContext.fillText("FPS: " + this.FPS.toFixed(2), 0, 20);
    }
}