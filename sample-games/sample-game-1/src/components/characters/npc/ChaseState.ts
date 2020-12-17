import { Component, GameObject, NavAgent, Vector2 } from '@entropy-engine/entropy-game-engine';
import { State } from '../../../interfaces/State';
import { CharacterStats } from '../CharacterStats';
import { CharacterAnimator } from '../CharacterAnimator';
import { NPCController } from './NPCController';

export class ChaseState extends Component implements State {
  private readonly navAgent: NavAgent;
  private readonly animator: CharacterAnimator;
  private readonly myStats: CharacterStats;
  private timer: number = 0;
  private targetStats: CharacterStats | null = null;

  public constructor(gameObject: GameObject, navAgent: NavAgent, animator: CharacterAnimator, myStats: CharacterStats) {
    super(gameObject);

    this.navAgent = navAgent;
    this.animator = animator;
    this.myStats = myStats;

    this.navAgent.onDirectionChanged.subscribe(newDirection => this.changeAnimation(newDirection));
    this.navAgent.onPathCompleted.subscribe(() => this.animator.playIdleAnimation());
  }

  public performBehavior(context: NPCController): void {
    if (context.currentTarget === null || this.targetStats === null || this.targetStats.isDead) {
      context.setState(context.searchingState);
      return;
    }

    if (Vector2.distance(this.transform.position, context.currentTarget.position) < this.myStats.attackRange) {
      context.setState(context.attackState);
      return;
    }

    this.timer += this.time.deltaTime;

    if (this.timer < 1) {
      return;
    }

    this.timer = 0;

    this.navAgent.setDestination(context.currentTarget.position);
  }

  public onEnter(context: NPCController): void {
    const target = context.currentTarget;

    if (target === null) {
      context.setState(context.searchingState);
      return;
    }

    this.targetStats = target.getComponent(CharacterStats);
  }

  public onExit(context: NPCController): void {
    this.targetStats = null;
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
