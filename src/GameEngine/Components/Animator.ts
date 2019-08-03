import { Component } from './Component';
import { GameObject } from '../Core/GameObject';
import { Animation } from '../Core/Helpers/Animation';
import { Renderable } from '../Core/Interfaces/Renderable';
import { GameEngine } from '../Core/GameEngine';

export class Animator extends Component implements Renderable {

    private animation: Animation;
    private readonly renderHeight: number;
    private readonly renderWidth: number;


    public constructor(gameObject: GameObject, renderWidth: number, renderHeight: number, initialAnimation: Animation) {
        super(gameObject);
        
        this.renderWidth = renderWidth;
        this.renderHeight = renderHeight;
        this.animation = initialAnimation;

        GameEngine.instance.renderingEngine.addRenderableObject(this);
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