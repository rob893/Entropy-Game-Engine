import { Topic } from './Topic';
import { Subscribable } from './types';

export class Animation {
  public loop: boolean = true;
  public playToFinish: boolean = false;

  private frameIndex: number = 0;
  private timer: number = 0;
  private computedTimeBetweenFrames: number;
  private finalFrameComplete: boolean = false;
  private readonly frames: HTMLImageElement[];
  private readonly timeBetweenFrames: number;
  private readonly onCompleted = new Topic<void>();

  public constructor(frames: HTMLImageElement[], timeBetweenFrames: number = 0) {
    this.frames = frames;
    this.timeBetweenFrames = timeBetweenFrames;
    this.computedTimeBetweenFrames = timeBetweenFrames;
  }

  public get onAnimationComplete(): Subscribable<void> {
    return this.onCompleted;
  }

  // test
  public get currentFrame(): HTMLImageElement {
    return this.frames[this.frameIndex];
  }

  public get isComplete(): boolean {
    return !this.loop && this.finalFrameComplete;
  }

  public get speedPercentage(): number {
    return (this.timeBetweenFrames / this.computedTimeBetweenFrames) * 100;
  }

  public set speedPercentage(percentage: number) {
    this.computedTimeBetweenFrames = (100 / percentage) * this.timeBetweenFrames;
  }

  public reset(): void {
    this.frameIndex = 0;
    this.timer = 0;
    this.finalFrameComplete = false;
  }

  public updateAnimation(deltaTime: number): void {
    if (this.isComplete) {
      this.onCompleted.publish();
      return;
    }

    this.timer += deltaTime;

    if (this.timer < this.computedTimeBetweenFrames) {
      return;
    }

    this.timer = 0;

    if (!this.loop && this.frameIndex === this.frames.length - 1) {
      this.finalFrameComplete = true;
      return;
    }

    this.frameIndex = (this.frameIndex + 1) % this.frames.length;
  }
}
