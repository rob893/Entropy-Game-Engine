import type { State } from '../../../types';
import { NPCController } from './NPCController';
import { CharacterAnimator } from '../CharacterAnimator';
import { Component, GameObject } from '@entropy-engine/entropy-game-engine';

export class SearchingState extends Component implements State {
  private timer = 0;
  private readonly animator: CharacterAnimator;

  public constructor(gameObject: GameObject, animator: CharacterAnimator) {
    super(gameObject);

    this.animator = animator;
  }

  public performBehavior(context: NPCController): void {
    this.timer += this.time.deltaTime;

    if (this.timer < 1) {
      return;
    }

    const player = this.findGameObjectWithTag('player');

    if (player === null) {
      return;
    }

    context.currentTarget = player.transform;
    context.setState(context.chaseState);
  }

  public onEnter(context: NPCController): void {
    this.animator.playIdleAnimation();
    this.timer = 0;
    context.currentTarget = null;
  }

  public onExit(): void {
    this.timer = 0;
  }
}
