import { Component, GameObject, NavAgent, Transform, Vector2 } from '@entropy-engine/entropy-game-engine';
import { CharacterAnimator } from '../CharacterAnimator';

export class EnemyMotor extends Component {
  private playerTransform: Transform | null = null;
  private timer: number = 0;
  private readonly navAgent: NavAgent;
  private readonly animator: CharacterAnimator;

  public constructor(gameObject: GameObject, navAgent: NavAgent, animator: CharacterAnimator) {
    super(gameObject);

    this.navAgent = navAgent;
    this.animator = animator;

    this.navAgent.onDirectionChanged.subscribe(newDirection => this.changeAnimation(newDirection));
    this.navAgent.onPathCompleted.subscribe(() => this.animator.playIdleAnimation());
  }

  public start(): void {
    const player = this.findGameObjectById('player');

    if (player === null) {
      throw new Error('player not found');
    }
    this.playerTransform = player.transform;
  }

  public update(): void {
    if (this.playerTransform === null) {
      return;
    }

    this.timer += this.time.deltaTime;

    if (this.timer > 1) {
      if (Vector2.distance(this.transform.position, this.playerTransform.position) < 75) {
        this.navAgent.resetPath();
        this.animator.playRandomAttackAnimation();
        return;
      }

      this.navAgent.setDestination(this.playerTransform.position);
      this.timer = 0;
    }
  }

  private changeAnimation(newDirection: Vector2 | undefined): void {
    if (newDirection === undefined) {
      throw new Error('Error');
    }

    let xVelocity: -1 | 0 | 1 = 0;
    let yVelocity: -1 | 0 | 1 = 0;
    // if (Math.abs(newDirection.x) > Math.abs(newDirection.y)) {
    if (newDirection.x > 0.5) {
      xVelocity = 1;
    } else if (newDirection.x < -0.5) {
      xVelocity = -1;
    }
    // } else {
    if (newDirection.y > 0.5) {
      yVelocity = 1;
    } else if (newDirection.y < -0.5) {
      yVelocity = -1;
    }
    this.animator.playRunAnimation(xVelocity, yVelocity);
    // }
  }
}
