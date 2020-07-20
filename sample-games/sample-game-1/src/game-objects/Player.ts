import {
  Animation,
  GameObject,
  Component,
  RectangleCollider,
  PhysicalMaterial,
  SpriteSheet,
  Animator,
  PrefabSettings,
  Layer,
  GameObjectConstructionParams
} from '@entropy-engine/entropy-game-engine';
import { PlayerAnimations } from '../interfaces/CharacterAnimations';
import { CharacterStats } from '../components/characters/CharacterStats';
import { PlayerMotor } from '../components/characters/player/PlayerMotor';
import { Spawner } from '../components/Spawner';
import { Minotaur } from './Minotaur';
import { Healthbar } from './Healthbar';
import { DirectionalAnimation } from '../helpers/DirectionalAnimation';
import { PlayerAnimator } from '../components/characters/player/PlayerAnimator';

export class Player extends GameObject {
  protected buildInitialComponents(): Component[] {
    const components: Component[] = [];

    const collider = new RectangleCollider(this, null, 30, 30, 0, 0);
    collider.physicalMaterial = PhysicalMaterial.bouncy;
    components.push(collider);

    const idleFrames = this.assetPool.getAsset<SpriteSheet>('knightIdleSpriteSheet').getFrames(1);

    const initialAnimation = new Animation(idleFrames, 0.2);
    const animator = new Animator(this, 75, 75, initialAnimation);
    components.push(animator);

    const knightSheet = this.assetPool.getAsset<SpriteSheet>('knightSpriteSheet');
    const knightRunSheet = this.assetPool.getAsset<SpriteSheet>('knightRunSpriteSheet');
    const knightIdleSheet = this.assetPool.getAsset<SpriteSheet>('knightIdleSpriteSheet');
    const knightAttack1Sheet = this.assetPool.getAsset<SpriteSheet>('knightAttack1SpriteSheet');
    // const knightAttack2Sheet = this.assetPool.getAsset<SpriteSheet>('knightAttack2SpriteSheet');

    const attack1Animation = new DirectionalAnimation(
      {
        upAnimation: new Animation(knightAttack1Sheet.getFrames(4), 0.075),
        upLeftAnimation: new Animation(knightAttack1Sheet.getFrames(6), 0.075),
        upRightAnimation: new Animation(knightAttack1Sheet.getFrames(8), 0.075),
        rightAnimation: new Animation(knightAttack1Sheet.getFrames(3), 0.075),
        leftAnimation: new Animation(knightAttack1Sheet.getFrames(2), 0.075),
        downAnimation: new Animation(knightAttack1Sheet.getFrames(1), 0.075),
        downLeftAnimation: new Animation(knightAttack1Sheet.getFrames(5), 0.075),
        downRightAnimation: new Animation(knightAttack1Sheet.getFrames(7), 0.075)
      },
      new Animation(knightAttack1Sheet.getFrames(3), 0.075)
    );

    const runAnimation = new DirectionalAnimation(
      {
        upAnimation: new Animation(knightRunSheet.getFrames(4), 0.075),
        upLeftAnimation: new Animation(knightRunSheet.getFrames(6), 0.075),
        upRightAnimation: new Animation(knightRunSheet.getFrames(8), 0.075),
        rightAnimation: new Animation(knightRunSheet.getFrames(3), 0.075),
        leftAnimation: new Animation(knightRunSheet.getFrames(2), 0.075),
        downAnimation: new Animation(knightRunSheet.getFrames(1), 0.075),
        downLeftAnimation: new Animation(knightRunSheet.getFrames(5), 0.075),
        downRightAnimation: new Animation(knightRunSheet.getFrames(7), 0.075)
      },
      new Animation(knightRunSheet.getFrames(3), 0.075)
    );

    // const rightAttackAnimation1 = new Animation(knightSheet.getFrames(2), 0.075);
    // const rightAttackAnimation2 = new Animation(knightSheet.getFrames(4), 0.075);
    // const leftAttackAnimation1 = new Animation(knightSheet.getFrames(1), 0.075);
    // const leftAttackAnimation2 = new Animation(knightSheet.getFrames(3), 0.075);

    const playerAnimations: PlayerAnimations = {
      attackAnimations: [attack1Animation],
      runAnimations: runAnimation,
      idleRightAnimation: new Animation(knightIdleSheet.getFrames(1), 0.2),
      idleLeftAnimation: new Animation(knightIdleSheet.getFrames(1), 0.2),
      jumpRightAnimation: new Animation(knightSheet.getFrames(12), 0.1),
      jumpLeftAnimation: new Animation(knightSheet.getFrames(11), 0.1),
      dieRightAnimation: new Animation(knightSheet.getFrames(6), 0.075),
      dieLeftAnimation: new Animation(knightSheet.getFrames(5), 0.075)
    };

    const playerAnimator = new PlayerAnimator(this, animator, playerAnimations);
    components.push(playerAnimator);

    const myStats = new CharacterStats(this, playerAnimator);
    components.push(myStats);

    components.push(new PlayerMotor(this, collider, playerAnimator, myStats));
    components.push(new Spawner(this, [Minotaur]));

    return components;
  }

  protected getPrefabSettings(): PrefabSettings {
    return {
      x: 0,
      y: 0,
      rotation: 0,
      id: 'player',
      tag: 'player',
      layer: Layer.Friendly
    };
  }

  protected buildAndReturnChildGameObjects(config: GameObjectConstructionParams): GameObject[] {
    const healthBar = new Healthbar(config);

    healthBar.transform.setPosition(this.transform.position.x, this.transform.position.y - 60);

    return [healthBar];
  }
}
