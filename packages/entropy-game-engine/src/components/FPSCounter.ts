import { Component } from './Component';
import { RenderableGUI } from '../core/interfaces/RenderableGUI';
import { GameObject } from '../game-objects/GameObject';
import { SerializedComponent } from '../core';
import { readNumber } from '../core/helpers/Serialization';

export class FPSCounter extends Component implements RenderableGUI {
  public static override readonly typeName: string = 'FPSCounter';
  public zIndex: number = 0;

  private numFrames: number = 0;
  private timer: number = 0;
  private FPS: number = 0;

  public static createFromSerialized(gameObject: GameObject, data: Record<string, unknown>): FPSCounter {
    const fpsCounter = new FPSCounter(gameObject);
    fpsCounter.deserialize(data);
    return fpsCounter;
  }

  public override serialize(): SerializedComponent {
    return {
      typeName: this.typeName,
      data: {
        zIndex: this.zIndex
      }
    };
  }

  public override deserialize(data: Record<string, unknown>): void {
    const zIndex = readNumber(data.zIndex);
    if (zIndex !== null) {
      this.zIndex = zIndex;
    }
  }

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
    context.fillText(`FPS: ${this.FPS.toFixed(2)}`, 0, 20);
  }
}
