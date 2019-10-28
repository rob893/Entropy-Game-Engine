import { Component } from '../../../GameEngine/Components/Component';
import { GameObject } from '../../../GameEngine/Core/GameObject';
import { Animator } from '../../../GameEngine/Components/Animator';
import { Animation } from '../../../GameEngine/Core/Helpers/Animation';
import { CharacterAnimations } from '../../Interfaces/CharacterAnimations';

export class CharacterAnimator extends Component {
    
    private facingRight: boolean = true;
    private readonly animations: CharacterAnimations;
    private readonly animator: Animator;

    
    public constructor(gameObject: GameObject, animator: Animator, animations: CharacterAnimations) {
        super(gameObject);

        animations.leftAttackAnimations.forEach(anim => {
            anim.playToFinish = true;
            anim.loop = false;
        });

        animations.rightAttackAnimations.forEach(anim => {
            anim.playToFinish = true;
            anim.loop = false;
        });

        animations.dieLeftAnimation.playToFinish = true;
        animations.dieLeftAnimation.loop = false;
        animations.dieRightAnimation.playToFinish = true;
        animations.dieRightAnimation.loop = false;

        animations.jumpLeftAnimation.playToFinish = true;
        animations.jumpLeftAnimation.loop = false;
        animations.jumpRightAnimation.playToFinish = true;
        animations.jumpRightAnimation.loop = false;

        this.animator = animator;
        this.animations = animations;

        this.setAnimation(this.animations.idleRightAnimation);
    }

    public playRandomAttackAnimation(): void {
        if (this.facingRight) {
            const anim = this.animations.rightAttackAnimations[Math.floor(Math.random() * this.animations.rightAttackAnimations.length)];

            if (this.animator.currentAnimation !== anim) {
                anim.reset();
            }
            
            this.setAnimation(anim);
        }
        else {
            const anim = this.animations.leftAttackAnimations[Math.floor(Math.random() * this.animations.leftAttackAnimations.length)];
            
            if (this.animator.currentAnimation !== anim) {
                anim.reset();
            }

            this.setAnimation(anim);
        }
    }

    public playRunAnimation(runningRight?: boolean): void {
        if (runningRight !== undefined) {
            this.facingRight = runningRight;
        }
        
        if (this.facingRight) {
            this.setAnimation(this.animations.runRightAnimation);
        }
        else {
            this.setAnimation(this.animations.runLeftAnimation);
        }
    }

    public playIdleAnimation(): void {
        if (this.facingRight) {
            this.setAnimation(this.animations.idleRightAnimation);
        }
        else {
            this.setAnimation(this.animations.idleLeftAnimation);
        }
    }

    public playJumpAnimation(): void {
        if (this.facingRight) {
            this.animations.jumpRightAnimation.reset();
            this.setAnimation(this.animations.jumpRightAnimation);
        }
        else {
            this.animations.jumpLeftAnimation.reset();
            this.setAnimation(this.animations.jumpLeftAnimation);
        }
    }

    public playDeathAnimation(): void {
        if (this.facingRight) {
            this.animations.dieRightAnimation.reset();
            this.setAnimation(this.animations.dieRightAnimation);
        }
        else {
            this.animations.dieLeftAnimation.reset();
            this.setAnimation(this.animations.dieLeftAnimation);
        }
    }

    public faceRight(): void {
        this.facingRight = true;
    }

    public faceLeft(): void {
        this.facingRight = false;
    }

    private setAnimation(anim: Animation): void {
        if (this.animator.currentAnimation === anim) {
            return;
        }

        this.animator.setAnimation(anim);
    }
}