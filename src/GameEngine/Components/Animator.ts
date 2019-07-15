import { Transform } from "./Transform";
import { Component } from "./Component";
import { GameObject } from "../Core/GameObject";
import { Animation } from "../Core/Animation";

export class Animator extends Component {

  
    private canvasContext: CanvasRenderingContext2D;
    private transform: Transform;
    private animation: Animation;


    public constructor(gameObject: GameObject, initialAnimation: Animation) {
        super(gameObject);
        
        this.animation = initialAnimation;
    }

    public start(): void {
        this.canvasContext = this.gameObject.getGameCanvas().getContext("2d");
        this.transform = this.gameObject.getTransform();
    }

    public update(): void {
        this.drawSprite();
    }

    public setAnimation(animation: Animation): void {
        this.animation = animation;
    }

    private drawSprite(): void {
        if (!this.animation.animationReady) {
            return;
        }

        this.canvasContext.drawImage(this.animation.currentFrame, this.transform.position.x, this.transform.position.y, this.transform.width, this.transform.height);
        this.animation.updateAnimation();
    }
}