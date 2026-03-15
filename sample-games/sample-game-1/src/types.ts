import type { Animation } from '@entropy-engine/entropy-game-engine';
import type { NPCController } from './components/characters/npc/NPCController';
import type { DirectionalAnimation } from './helpers/DirectionalAnimation';

export interface ICharacterAnimations {
  rightAttackAnimations: Animation[];
  leftAttackAnimations: Animation[];
  runRightAnimation: Animation;
  runLeftAnimation: Animation;
  runUpAnimation: Animation;
  runDownAnimation: Animation;
  runUpRightAnimation: Animation;
  runUpLeftAnimation: Animation;
  runDownRightAnimation: Animation;
  runDownLeftAnimation: Animation;
  idleRightAnimation: Animation;
  idleLeftAnimation: Animation;
  jumpRightAnimation: Animation;
  jumpLeftAnimation: Animation;
  dieRightAnimation: Animation;
  dieLeftAnimation: Animation;
}

export interface IPlayerAnimations {
  attackAnimations: DirectionalAnimation[];
  runAnimations: DirectionalAnimation;
  idleRightAnimation: Animation;
  idleLeftAnimation: Animation;
  jumpRightAnimation: Animation;
  jumpLeftAnimation: Animation;
  dieRightAnimation: Animation;
  dieLeftAnimation: Animation;
}

export interface IDamageable {
  isDead: boolean;
  health: number;
  takeDamage(amount: number): void;
  die(): void;
}

export interface IState {
  performBehavior(context: NPCController): void;
  onEnter(context: NPCController): void;
  onExit(context: NPCController): void;
}
