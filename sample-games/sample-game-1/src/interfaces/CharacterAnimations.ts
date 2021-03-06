import { Animation } from '@entropy-engine/entropy-game-engine';
import { DirectionalAnimation } from '../helpers/DirectionalAnimation';

export interface CharacterAnimations {
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

export interface PlayerAnimations {
  attackAnimations: DirectionalAnimation[];
  runAnimations: DirectionalAnimation;
  idleRightAnimation: Animation;
  idleLeftAnimation: Animation;
  jumpRightAnimation: Animation;
  jumpLeftAnimation: Animation;
  dieRightAnimation: Animation;
  dieLeftAnimation: Animation;
}
