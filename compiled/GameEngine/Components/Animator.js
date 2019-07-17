import { Component } from "./Component";
export class Animator extends Component {
    constructor(gameObject, renderWidth, renderHeight, initialAnimation) {
        super(gameObject);
        this.renderWidth = renderWidth;
        this.renderHeight = renderHeight;
        this.animation = initialAnimation;
    }
    start() {
        this.canvasContext = this.gameObject.getGameCanvas().getContext("2d");
        this.transform = this.gameObject.getTransform();
    }
    update() {
        this.drawSprite();
    }
    setAnimation(animation) {
        this.animation = animation;
    }
    drawSprite() {
        if (!this.animation.animationReady) {
            return;
        }
        this.canvasContext.drawImage(this.animation.currentFrame, this.transform.position.x - (this.renderWidth / 2), this.transform.position.y - this.renderHeight, this.renderWidth, this.renderHeight);
        this.animation.updateAnimation();
    }
}
//# sourceMappingURL=Animator.js.map