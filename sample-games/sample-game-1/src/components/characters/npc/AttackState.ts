import { Component, GameObject, Transform, Vector2 } from '@entropy-engine/entropy-game-engine';
import { State } from '../../../interfaces/State';
import { CharacterStats } from '../CharacterStats';
import { CharacterAnimator } from '../CharacterAnimator';
import { NPCController } from './NPCController';

export class AttackState extends Component implements State {
  private targetStats: CharacterStats | null = null;
  private attackTimer: number = 0;
  private readonly animator: CharacterAnimator;
  private readonly myStats: CharacterStats;

  public constructor(gameObject: GameObject, animator: CharacterAnimator, myStats: CharacterStats) {
    super(gameObject);

    this.animator = animator;
    this.myStats = myStats;
  }

  public performBehavior(context: NPCController): void {
    if (context.currentTarget === null || this.targetStats === null || this.targetStats.isDead) {
      context.setState(context.searchingState);
      return;
    }

    if (Vector2.distance(this.transform.position, context.currentTarget.position) > this.myStats.attackRange) {
      context.setState(context.chaseState);
      return;
    }

    this.attackTimer += this.time.deltaTime;

    if (this.attackTimer < this.myStats.attackSpeed) {
      this.animator.playIdleAnimation();
      return;
    }

    this.faceTarget(context.currentTarget);
    this.attackTimer = 0;
    this.animator.playRandomAttackAnimation();
    this.targetStats.takeDamage(this.myStats.attackPower);
  }

  public onEnter(context: NPCController): void {
    this.attackTimer = 0;
    const target = context.currentTarget;

    if (target === null) {
      context.setState(context.searchingState);
      return;
    }

    const targetStats = target.getComponent(CharacterStats);

    if (targetStats === null) {
      context.setState(context.searchingState);
      return;
    }

    this.targetStats = targetStats;
  }

  public onExit(): void {
    this.targetStats = null;
  }

  private faceTarget(target: Transform): void {
    if (target.position.x < this.transform.position.x) {
      this.animator.faceLeft();
    } else {
      this.animator.faceRight();
    }
  }
}
