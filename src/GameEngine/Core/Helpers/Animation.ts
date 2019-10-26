import { LiteEvent } from './LiteEvent';
import { CustomLiteEvent } from '../Interfaces/CustomLiteEvent';

export class Animation {

    public loop: boolean = true;
    public playToFinish: boolean = false;
    
    private frameIndex: number = 0;
    private timer: number;
    private computedTimeBetweenFrames: number;
    private obtainedFinalFrame: boolean = false;
    private readonly frames: HTMLImageElement[];
    private readonly timeBetweenFrames: number;
    private readonly onCompleted = new LiteEvent<void>();
    
    
    public constructor(frames: HTMLImageElement[], timeBetweenFrames: number = 0) {        
        this.frames = frames;
        this.timeBetweenFrames = timeBetweenFrames;
        this.computedTimeBetweenFrames = timeBetweenFrames;
        this.timer = this.computedTimeBetweenFrames;
    }

    public get onAnimationComplete(): CustomLiteEvent<void> {
        return this.onCompleted.expose();
    }

    public get currentFrame(): HTMLImageElement {
        if (this.frameIndex === this.frames.length - 1) {
            this.obtainedFinalFrame = true;
        }

        return this.frames[this.frameIndex];
    }

    public get isComplete(): boolean {
        return !this.loop && this.frameIndex === this.frames.length - 1 && this.obtainedFinalFrame;
    }

    public get speedPercentage(): number {
        return (this.timeBetweenFrames / this.computedTimeBetweenFrames) * 100;
    }

    public set speedPercentage(percentage: number) {
        this.computedTimeBetweenFrames = (100 / percentage) * this.timeBetweenFrames;
    }

    public reset(): void {
        this.frameIndex = 0;
        this.timer = this.computedTimeBetweenFrames;
        this.obtainedFinalFrame = false;
    }

    public updateAnimation(deltaTime: number): void {
        if (this.isComplete) {
            this.onCompleted.trigger();
            return;
        }

        this.timer += deltaTime;

        if (this.timer < this.computedTimeBetweenFrames) {
            return;
        }

        this.timer = 0;

        this.frameIndex = (this.frameIndex + 1) % this.frames.length;
    }
}