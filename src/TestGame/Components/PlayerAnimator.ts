import { Component } from '../../GameEngine/Components/Component';
import { GameObject } from '../../GameEngine/Core/GameObject';
import { Animator } from '../../GameEngine/Components/Animator';
import { SpriteSheet } from '../../GameEngine/Core/Helpers/SpriteSheet';
import { Animation } from '../../GameEngine/Core/Helpers/Animation';

export class PlayerAnimator extends Component {
    
    private facingRight: boolean = true;
    private readonly animator: Animator;
    private readonly rightAttackAnimations: Animation[];
    private readonly leftAttackAnimations: Animation[];
    private readonly runRightAnimation: Animation;
    private readonly runLeftAnimation: Animation;
    private readonly idleRightAnimation: Animation;
    private readonly idleLeftAnimation: Animation;
    private readonly jumpRightAnimation: Animation;
    private readonly jumpLeftAnimation: Animation;
    private readonly dieRightAnimation: Animation;
    private readonly dieLeftAnimation: Animation;

    
    public constructor(gameObject: GameObject, animator: Animator) {
        super(gameObject);

        this.animator = animator;

        const knightSheet = this.assetPool.getAsset<SpriteSheet>('knightSpriteSheet');

        const rightAttackAnimation1 = new Animation(knightSheet.getFrames(2), 0.075);
        rightAttackAnimation1.loop = false;
        rightAttackAnimation1.playToFinish = true;
        const rightAttackAnimation2 = new Animation(knightSheet.getFrames(4), 0.075);
        rightAttackAnimation2.loop = false;
        rightAttackAnimation2.playToFinish = true;
        this.rightAttackAnimations = [rightAttackAnimation1, rightAttackAnimation2];

        const leftAttackAnimation1 = new Animation(knightSheet.getFrames(1), 0.075);
        leftAttackAnimation1.loop = false;
        leftAttackAnimation1.playToFinish = true;
        const leftAttackAnimation2 = new Animation(knightSheet.getFrames(3), 0.075);
        leftAttackAnimation2.loop = false;
        leftAttackAnimation2.playToFinish = true;
        this.leftAttackAnimations = [leftAttackAnimation1, leftAttackAnimation2];

        this.runRightAnimation = new Animation(knightSheet.getFrames(14), 0.075);
        this.runLeftAnimation = new Animation(knightSheet.getFrames(13), 0.075);

        this.idleRightAnimation = new Animation(knightSheet.getFrames(9), 0.2);
        this.idleLeftAnimation = new Animation(knightSheet.getFrames(10), 0.2);

        this.jumpLeftAnimation = new Animation(knightSheet.getFrames(11), 0.5);
        this.jumpLeftAnimation.loop = false;
        this.jumpLeftAnimation.playToFinish = true;
        this.jumpRightAnimation = new Animation(knightSheet.getFrames(12), 0.5);
        this.jumpRightAnimation.loop = false;
        this.jumpRightAnimation.playToFinish = true;

        this.dieLeftAnimation = new Animation(knightSheet.getFrames(5), 0.075);
        this.dieRightAnimation = new Animation(knightSheet.getFrames(6), 0.075);

        this.setAnimation(this.idleRightAnimation);
    }

    public playRandomAttackAnimation(): void {
        if (this.facingRight) {
            const anim = this.rightAttackAnimations[Math.floor(Math.random() * this.rightAttackAnimations.length)];
            anim.reset();
            this.setAnimation(anim);
        }
        else {
            const anim = this.leftAttackAnimations[Math.floor(Math.random() * this.leftAttackAnimations.length)];
            anim.reset();
            this.setAnimation(anim);
        }
    }

    public playRunAnimation(runningRight?: boolean): void {
        if (runningRight !== undefined) {
            this.facingRight = runningRight;
        }
        
        if (this.facingRight) {
            this.setAnimation(this.runRightAnimation);
        }
        else {
            this.setAnimation(this.runLeftAnimation);
        }
    }

    public playIdleAnimation(): void {
        if (this.facingRight) {
            this.setAnimation(this.idleRightAnimation);
        }
        else {
            this.setAnimation(this.idleLeftAnimation);
        }
    }

    public playJumpAnimation(): void {
        if (this.facingRight) {
            this.jumpRightAnimation.reset();
            this.setAnimation(this.jumpRightAnimation);
        }
        else {
            this.jumpLeftAnimation.reset();
            this.setAnimation(this.jumpLeftAnimation);
        }
    }

    public playDeathAnimation(): void {
        if (this.facingRight) {
            this.setAnimation(this.dieRightAnimation);
        }
        else {
            this.setAnimation(this.dieLeftAnimation);
        }
    }

    private setAnimation(anim: Animation): void {
        if (this.animator.currentAnimation === anim) {
            return;
        }

        this.animator.setAnimation(anim);
    }
}