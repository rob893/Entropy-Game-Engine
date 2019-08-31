import { Time } from '../Time';

export class Animation {

    public loop: boolean = true;
    public animationReady: boolean = false;
    
    private frameIndex: number = 0;
    private timer: number = 0;
    private readonly frames: HTMLImageElement[] = [];
    private readonly timeBetweenFrames: number = 0;
    
    /**
     * @param spriteSheetUrl The location of the sprite sheet (import it as a variable and then use that)
     * @param framesPerRow Number of frames per row (if the sprite sheet is 5 by 5 (5 rows with 5 frames per row), then this should be 5)
     * @param numRows Number of rows the sprite sheet has.
     * @param timeBetweenFrames Time (in seconds) between each frame
     * @param rowsToAnimate The specific row(s) to animate. For example, the sprite sheet contains 5 rows of sprites but only the second row should be animated, pass in 2. 
     * @param trimEdgesBy How many pixals to trim the sprite sheet down by. This is applied to each side.
     */
    public constructor(spriteSheetUrl: string, framesPerRow: number, numRows: number, timeBetweenFrames: number = 0, rowsToAnimate: number[] | number = null, trimEdgesBy: number = 0) {        
        this.timeBetweenFrames = timeBetweenFrames;
        this.timer = timeBetweenFrames;

        const spriteSheet = new Image();
        spriteSheet.src = spriteSheetUrl;
        spriteSheet.onload = () => {
            const spriteWidth = spriteSheet.width / framesPerRow;
            const spriteHeight = spriteSheet.height / numRows;

            if (typeof rowsToAnimate === 'number') {
                rowsToAnimate = [rowsToAnimate];
            }

            if (rowsToAnimate !== null) {
                for (const row of rowsToAnimate) {
                    if (row < 1 || row > numRows) {
                        throw new Error('Invalid specificRow argument. It must be greater than 0 and less than or equal to numRows.');
                    }

                    for (let i = 0; i < framesPerRow; i++) {
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
                    for (let j = 0; j < framesPerRow; j++) {
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