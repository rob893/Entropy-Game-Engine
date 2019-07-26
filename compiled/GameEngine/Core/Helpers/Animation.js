import { Time } from "../Time";
export class Animation {
    constructor(spriteSheetUrl, numFrames, numRows, delay = 0, specificRows = null, trimEdgesBy = 0) {
        this.loop = true;
        this.animationReady = false;
        this.frames = [];
        this.frameIndex = 0;
        this.delay = 0;
        this.timer = 0;
        this.delay = delay;
        let spriteSheet = new Image();
        spriteSheet.src = spriteSheetUrl;
        spriteSheet.onload = () => {
            let spriteWidth = spriteSheet.width / numFrames;
            let spriteHeight = spriteSheet.height / numRows;
            if (specificRows !== null) {
                for (let row of specificRows) {
                    if (row < 1 || row > numRows) {
                        throw new Error("Invalid specificRow argument. It must be greater than 0 and less than or equal to numRows.");
                    }
                    for (let i = 0; i < numFrames; i++) {
                        this.animationReady = false;
                        let canvas = document.createElement('canvas');
                        canvas.width = spriteWidth;
                        canvas.height = spriteHeight;
                        let context = canvas.getContext('2d');
                        context.drawImage(spriteSheet, (i * spriteWidth) + trimEdgesBy, ((row - 1) * spriteHeight) + trimEdgesBy, spriteWidth - trimEdgesBy, spriteHeight - trimEdgesBy, 0, 0, canvas.width, canvas.height);
                        let frame = new Image();
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
                        let canvas = document.createElement('canvas');
                        canvas.width = spriteWidth;
                        canvas.height = spriteHeight;
                        let context = canvas.getContext('2d');
                        context.drawImage(spriteSheet, (j * spriteWidth) + trimEdgesBy, (i * spriteHeight) + trimEdgesBy, spriteWidth - trimEdgesBy, spriteHeight - trimEdgesBy, 0, 0, canvas.width, canvas.height);
                        let frame = new Image();
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
    get currentFrame() {
        return this.frames[this.frameIndex];
    }
    updateAnimation() {
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
//# sourceMappingURL=Animation.js.map