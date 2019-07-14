import { Component } from "./Component";
export class Animator extends Component {
    constructor(gameObject, spriteSheetURL, numberOfFrames, numberOfRows) {
        super(gameObject);
        this.frameWidth = 0;
        this.frameHeight = 0;
        this.numberOfFrames = 0;
        this.numberOfRows = 0;
        this.frameIndex = 0;
        this.framesPerAnimationFrame = 10;
        this.animationFrameCount = 0;
        this.spriteReady = false;
        this.spriteSheet = new Image();
        this.spriteSheet.src = spriteSheetURL;
        this.spriteSheet.onload = () => { this.spriteReady = true; };
        this.numberOfFrames = numberOfFrames;
        this.numberOfRows = numberOfRows;
    }
    start() {
        this.canvasContext = this.gameObject.getGameCanvas().getContext("2d");
        this.transform = this.gameObject.getTransform();
    }
    update() {
        this.drawSprite();
    }
    setAnimationSpeed(numberOfFramesPerAnimationFrame) {
        this.framesPerAnimationFrame = numberOfFramesPerAnimationFrame;
    }
    drawSprite() {
        if (!this.spriteReady) {
            return;
        }
        this.animationFrameCount++;
        if (this.animationFrameCount >= this.framesPerAnimationFrame) {
            this.frameIndex = (this.frameIndex + 1) % this.numberOfFrames;
            this.animationFrameCount = 0;
        }
        this.frameHeight = this.spriteSheet.height / this.numberOfRows;
        this.frameWidth = this.spriteSheet.width / this.numberOfFrames;
        this.canvasContext.drawImage(this.spriteSheet, this.frameIndex * this.frameWidth, 0, this.frameWidth, this.frameHeight, this.transform.position.x, this.transform.position.y, this.transform.width, this.transform.height);
    }
}
//# sourceMappingURL=Animator.js.map