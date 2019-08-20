import { Component } from './Component';
import { Time } from '../Core/Time';
import { RenderableGUI } from '../Core/Interfaces/RenderableGUI';
import { GameObject } from '../Core/GameObject';


export class FPSCounter extends Component implements RenderableGUI {

    private numFrames: number = 0;
    private timer: number = 0;
    private FPS: number = 0;
    private readonly time: Time;
    

    public constructor(gameObject: GameObject, time: Time) {
        super(gameObject);
        
        this.time = time;
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
        context.fillText('FPS: ' + this.FPS.toFixed(2), 0, 20);
    }
}