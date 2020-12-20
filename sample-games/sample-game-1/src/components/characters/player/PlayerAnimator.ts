import { Animation, Animator, Component, GameObject } from '@entropy-engine/entropy-game-engine';
import { CharacterAnimations, PlayerAnimations } from '../../../interfaces/CharacterAnimations';

export class PlayerAnimator extends Component {
  private facingRight: boolean = true;
  private readonly animations: PlayerAnimations;
  private animator!: Animator;

  public constructor(gameObject: GameObject, animator: Animator, animations: PlayerAnimations) {
    super(gameObject);

    animations.attackAnimations.forEach(attackAnims => {
      attackAnims.animations.forEach(anim => {
        anim.playToFinish = true;
        anim.loop = false;
      });
    });

    animations.dieLeftAnimation.playToFinish = true;
    animations.dieLeftAnimation.loop = false;
    animations.dieRightAnimation.playToFinish = true;
    animations.dieRightAnimation.loop = false;

    animations.jumpLeftAnimation.playToFinish = true;
    animations.jumpLeftAnimation.loop = false;
    animations.jumpRightAnimation.playToFinish = true;
    animations.jumpRightAnimation.loop = false;

    //this.animator = animator;
    this.animations = animations;
  }

  public start(): void {
    const does = this.getComponent(Animator);
    debugger;
    this.animator = does!;
    this.setAnimation(this.animations.idleRightAnimation);
  }

  public playRandomAttackAnimation(): void {
    if (this.facingRight) {
      const anim = this.animations.attackAnimations[
        Math.floor(Math.random() * this.animations.attackAnimations.length)
      ].getDirectionalAnimation(1, 0);

      if (this.animator.currentAnimation !== anim) {
        anim.reset();
      }

      this.setAnimation(anim);
    } else {
      const anim = this.animations.attackAnimations[
        Math.floor(Math.random() * this.animations.attackAnimations.length)
      ].getDirectionalAnimation(-1, 0);

      if (this.animator.currentAnimation !== anim) {
        anim.reset();
      }

      this.setAnimation(anim);
    }
  }

  public playRunAnimation(xVelocity: -1 | 0 | 1, yVelocity: -1 | 0 | 1): void {
    const runAnimation = this.animations.runAnimations.getDirectionalAnimation(xVelocity, yVelocity);
    this.setAnimation(runAnimation);
  }

  public playIdleAnimation(): void {
    if (this.facingRight) {
      this.setAnimation(this.animations.idleRightAnimation);
    } else {
      this.setAnimation(this.animations.idleLeftAnimation);
    }
  }

  public playJumpAnimation(): void {
    if (this.facingRight) {
      this.animations.jumpRightAnimation.reset();
      this.setAnimation(this.animations.jumpRightAnimation);
    } else {
      this.animations.jumpLeftAnimation.reset();
      this.setAnimation(this.animations.jumpLeftAnimation);
    }
  }

  public playDeathAnimation(): void {
    if (this.facingRight) {
      this.animations.dieRightAnimation.reset();
      this.setAnimation(this.animations.dieRightAnimation);
    } else {
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
