import { Time } from '../Time';

export class Animation {

    public loop: boolean = true;
    public animationReady: boolean = false;
    
    private readonly frames: HTMLImageElement[] = [];
    private frameIndex: number = 0;
    private readonly delay: number = 0;
    private timer: number = 0;
    

    public constructor(spriteSheetUrl: string, numFrames: number, numRows: number, delay: number = 0, specificRows: number[] = null, trimEdgesBy: number = 0) {        
        this.delay = delay;

        const spriteSheet = new Image();
        spriteSheet.src = spriteSheetUrl;
        spriteSheet.onload = () => {
            const spriteWidth = spriteSheet.width / numFrames;
            const spriteHeight = spriteSheet.height / numRows;

            if (specificRows !== null) {
                for (const row of specificRows) {
                    if (row < 1 || row > numRows) {
                        throw new Error('Invalid specificRow argument. It must be greater than 0 and less than or equal to numRows.');
                    }

                    for (let i = 0; i < numFrames; i++) {
                        this.animationReady = false;
                        const canvas = document.createElement('canvas');
                        
                        canvas.width = spriteWidth;
                        canvas.height = spriteHeight;
    
                        const context = canvas.getContext('2d');
                        context.drawImage(spriteSheet, (i * spriteWidth) + trimEdgesBy, ((row - 1) * spriteHeight) + trimEdgesBy, spriteWidth - trimEdgesBy, spriteHeight - trimEdgesBy, 0, 0, canvas.width, canvas.height);
                        const frame = new Image();
                        frame.src = canvas.toDataURL();
                        frame.onload = () => {
                            this.frames.push(frame);
                            this.animationReady = true;
                        };
                    }
                }
            }
            else {
                for (let i = 0; i < numRows; i++) {
                    for (let j = 0; j < numFrames; j++) {
                        this.animationReady = false;
                        const canvas = document.createElement('canvas');
                        
                        canvas.width = spriteWidth;
                        canvas.height = spriteHeight;
    
                        const context = canvas.getContext('2d');
                        context.drawImage(spriteSheet, (j * spriteWidth) + trimEdgesBy, (i * spriteHeight) + trimEdgesBy, spriteWidth - trimEdgesBy, spriteHeight - trimEdgesBy, 0, 0, canvas.width, canvas.height);
                        const frame = new Image();
                        frame.src = canvas.toDataURL();
                        frame.onload = () => {
                            this.frames.push(frame);
                            this.animationReady = true;
                        };
                    }
                }
            }
        };        
    }

    public get currentFrame(): HTMLImageElement {
        return this.frames[this.frameIndex];
    }

    public updateAnimation(): void {
        if (!this.loop && this.frameIndex === this.frames.length - 1) {
            return;
        }

        this.timer += Time.DeltaTime;

        if (this.timer < this.delay) {
            return;
        }

        this.timer = 0;

        this.frameIndex = (this.frameIndex + 1) % this.frames.length;
    }
}