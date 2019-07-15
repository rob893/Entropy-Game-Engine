import { Time } from "./Time";
export class Animation {
    constructor(spriteSheetUrl, numFrames, numRows, delay = 0) {
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
            for (let i = 0; i < numRows; i++) {
                for (let j = 0; j < numFrames; j++) {
                    this.animationReady = false;
                    let canvas = document.createElement('canvas');
                    canvas.width = spriteWidth;
                    canvas.height = spriteHeight;
                    let context = canvas.getContext('2d');
                    context.drawImage(spriteSheet, j * spriteWidth, i * spriteHeight, spriteWidth, spriteHeight, 0, 0, canvas.width, canvas.height);
                    let frame = new Image();
                    frame.src = canvas.toDataURL();
                    frame.onload = () => {
                        this.frames.push(frame);
                        this.animationReady = true;
                    };
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