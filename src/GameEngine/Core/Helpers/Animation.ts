export class Animation {

    public loop: boolean = true;
    
    private frameIndex: number = 0;
    private timer: number;
    private readonly frames: HTMLImageElement[];
    private readonly timeBetweenFrames: number;
    
    
    public constructor(frames: HTMLImageElement[], timeBetweenFrames: number = 0) {        
        this.frames = frames;
        this.timeBetweenFrames = timeBetweenFrames;
        this.timer = timeBetweenFrames;
    }

    public get currentFrame(): HTMLImageElement {
        return this.frames[this.frameIndex];
    }

    public updateAnimation(deltaTime: number): void {
        if (!this.loop && this.frameIndex === this.frames.length - 1) {
            return;
        }

        this.timer += deltaTime;

        if (this.timer < this.timeBetweenFrames) {
            return;
        }

        this.timer = 0;

        this.frameIndex = (this.frameIndex + 1) % this.frames.length;
    }
}