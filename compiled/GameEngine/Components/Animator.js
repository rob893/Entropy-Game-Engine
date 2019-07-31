import { Component } from "./Component";
import { GameEngine } from "../Core/GameEngine";
export class Animator extends Component {
    constructor(gameObject, renderWidth, renderHeight, initialAnimation) {
        super(gameObject);
        this.renderWidth = renderWidth;
        this.renderHeight = renderHeight;
        this.animation = initialAnimation;
        GameEngine.instance.renderingEngine.addRenderableObject(this);
    }
    setAnimation(animation) {
        this.animation = animation;
    }
    render(context) {
        if (!this.animation.animationReady) {
            return;
        }
        context.drawImage(this.animation.currentFrame, this.transform.position.x - (this.renderWidth / 2), this.transform.position.y - this.renderHeight, this.renderWidth, this.renderHeight);
        this.animation.updateAnimation();
    }
}
//# sourceMappingURL=Animator.js.map