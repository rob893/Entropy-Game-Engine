import { Transform } from "./Transform";
import { Component } from "./Component";
import { GameObject } from "../Core/GameObject";
import { Animation } from "../Core/Animation";
import { IRenderable } from "../Core/Interfaces/IRenderable";
import { RenderingEngine } from "../Core/RenderingEngine";

export class Animator extends Component implements IRenderable {

    private transform: Transform;
    private animation: Animation;
    private renderHeight: number;
    private renderWidth: number;


    public constructor(gameObject: GameObject, renderWidth: number, renderHeight: number, initialAnimation: Animation) {
        super(gameObject);
        
        this.renderWidth = renderWidth;
        this.renderHeight = renderHeight;
        this.animation = initialAnimation;

        RenderingEngine.instance.addRenderableObject(this);
    }

    public start(): void {
        this.transform = this.gameObject.getTransform();
    }

    public setAnimation(animation: Animation): void {
        this.animation = animation;
    }

    public render(context: CanvasRenderingContext2D): void {
        if (!this.animation.animationReady) {
            return;
        }

        context.drawImage(this.animation.currentFrame, this.transform.position.x - (this.renderWidth / 2), 
            this.transform.position.y - this.renderHeight, this.renderWidth, this.renderHeight);
        this.animation.updateAnimation();
    }
}