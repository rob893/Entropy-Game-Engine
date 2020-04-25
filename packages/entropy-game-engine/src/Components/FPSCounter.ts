import { Component } from './Component';
import { RenderableGUI } from '../Core/Interfaces/RenderableGUI';

export class FPSCounter extends Component implements RenderableGUI {
  public zIndex: number = 0;

  private numFrames: number = 0;
  private timer: number = 0;
  private FPS: number = 0;

  public renderGUI(context: CanvasRenderingContext2D): void {
    this.timer += this.time.deltaTime;
    this.numFrames++;

    if (this.timer >= 0.5) {
      this.FPS = this.numFrames / this.timer;
      this.timer = 0;
      this.numFrames = 0;
    }

    context.font = '20px Arial';
    context.fillStyle = 'white';
    context.fillText('FPS: ' + this.FPS.toFixed(2), 0, 20);
  }
}
