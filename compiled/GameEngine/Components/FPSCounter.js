import { Component } from "./Component";
import { Time } from "../Core/Time";
import { GameEngine } from "../Core/GameEngine";
export class FPSCounter extends Component {
    constructor() {
        super(...arguments);
        this.numFrames = 0;
        this.timer = 0;
        this.FPS = 0;
    }
    start() {
        this.canvasContext = GameEngine.Instance.getGameCanvasContext();
        this.canvasContext.font = "20px Arial";
    }
    update() {
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
//# sourceMappingURL=FPSCounter.js.map