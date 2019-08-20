import { Component } from './Component';
import { GameObject } from '../Core/GameObject';
import { Animation } from '../Core/Helpers/Animation';
import { Renderable } from '../Core/Interfaces/Renderable';
import { GameEngine } from '../Core/GameEngine';
import { Time } from '../Core/Time';

export class Animator extends Component implements Renderable {

    private animation: Animation;
    private readonly renderWidth: number;
    private readonly renderHeight: number;
    private readonly halfRWidth: number;
    private readonly halfRHeight: number;
    private readonly time: Time;


    public constructor(gameObject: GameObject, renderWidth: number, renderHeight: number, initialAnimation: Animation, time: Time) {
        super(gameObject);

        this.time = time;
        
        this.renderWidth = renderWidth;
        this.halfRWidth = renderWidth / 2;
        this.renderHeight = renderHeight;
        this.halfRHeight = renderHeight / 2;
        this.animation = initialAnimation;
    }

    public setAnimation(animation: Animation): void {
        this.animation = animation;
    }

    public render(context: CanvasRenderingContext2D): void {
        if (!this.animation.animationReady) {
            return;
        }

        context.translate(this.transform.position.x, this.transform.position.y - this.halfRHeight);
        context.rotate(this.transform.rotation);

        context.drawImage(this.animation.currentFrame, 0 - this.halfRWidth, 
            0 - this.halfRHeight, this.renderWidth, this.renderHeight);

        context.rotate(-this.transform.rotation);
        context.translate(-this.transform.position.x, -(this.transform.position.y - this.halfRHeight));
        this.animation.updateAnimation(this.time.deltaTime);
    }
}