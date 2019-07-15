import { Component } from "./Component";
export class Animator extends Component {
    constructor(gameObject, initialAnimation) {
        super(gameObject);
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
        this.canvasContext.drawImage(this.animation.currentFrame, this.transform.position.x, this.transform.position.y, this.transform.width, this.transform.height);
        this.animation.updateAnimation();
    }
}
//# sourceMappingURL=Animator.js.map