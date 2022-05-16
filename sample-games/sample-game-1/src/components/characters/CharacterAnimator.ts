import { Animation, Animator, Component, GameObject } from '@entropy-engine/entropy-game-engine';
import { CharacterAnimations } from '../../interfaces/CharacterAnimations';

export class CharacterAnimator extends Component {
  private facingRight: boolean = true;
  private readonly animations: CharacterAnimations;
  private readonly animator: Animator;
  private readonly runAnimations: Map<-1 | 0 | 1, Map<-1 | 0 | 1, Animation>>;

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

    this.runAnimations = new Map([
      [
        -1,
        new Map([
          [-1, animations.runUpLeftAnimation],
          [0, animations.runLeftAnimation],
          [1, animations.runDownLeftAnimation]
        ])
      ],
      [
        0,
        new Map([
          [-1, animations.runUpAnimation],
          [0, animations.idleLeftAnimation],
          [1, animations.runDownAnimation]
        ])
      ],
      [
        1,
        new Map([
          [-1, animations.runUpRightAnimation],
          [0, animations.runRightAnimation],
          [1, animations.runDownRightAnimation]
        ])
      ]
    ]);

    this.animator = animator;
    this.animations = animations;

    this.setAnimation(this.animations.idleRightAnimation);
  }

  public playRandomAttackAnimation(): void {
    if (this.facingRight) {
      const anim =
        this.animations.rightAttackAnimations[Math.floor(Math.random() * this.animations.rightAttackAnimations.length)];

      if (this.animator.currentAnimation !== anim) {
        anim.reset();
      }

      this.setAnimation(anim);
    } else {
      const anim =
        this.animations.leftAttackAnimations[Math.floor(Math.random() * this.animations.leftAttackAnimations.length)];

      if (this.animator.currentAnimation !== anim) {
        anim.reset();
      }

      this.setAnimation(anim);
    }
  }

  public playRunAnimation(xVelocity: -1 | 0 | 1, yVelocity: -1 | 0 | 1): void {
    const runAnimation = this.runAnimations.get(xVelocity)?.get(yVelocity);

    if (!runAnimation) {
      throw new Error('No animation');
    }

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
