import {
  Animation,
  Animator,
  Component,
  GameObject,
  IGameObjectConstructionParams,
  Layer,
  PhysicalMaterial,
  IPrefabSettings,
  RectangleCollider
} from '@entropy-engine/entropy-game-engine';
import { CharacterStats } from '../components/characters/CharacterStats';
import { PlayerAnimator } from '../components/characters/player/PlayerAnimator';
import { PlayerMotor } from '../components/characters/player/PlayerMotor';
import { DirectionalAnimation } from '../helpers/DirectionalAnimation';
import type { IPlayerAnimations } from '../types';
import { Healthbar } from './Healthbar';

type SpriteSheetAsset = {
  getFrames(rows?: number | number[]): HTMLImageElement[];
};

function isSpriteSheetAsset(value: unknown): value is SpriteSheetAsset {
  return typeof value === 'object' && value !== null && 'getFrames' in value && typeof (value as Record<string, unknown>).getFrames === 'function';
}

export class Player extends GameObject {
  protected buildInitialComponents(): Component[] {
    const components: Component[] = [];

    const collider = new RectangleCollider(this, null, 30, 30, 0, 0);
    collider.physicalMaterial = PhysicalMaterial.bouncy;
    components.push(collider);

    const knightIdleSpriteSheet = this.assetPool.getAsset<unknown>('knightIdleSpriteSheet');

    if (!isSpriteSheetAsset(knightIdleSpriteSheet)) {
      throw new Error('Knight idle sprite sheet unavailable.');
    }

    const idleFrames = knightIdleSpriteSheet.getFrames(1);

    const initialAnimation = new Animation(idleFrames, 0.2);
    const animator = new Animator(this, 75, 75, initialAnimation);
    components.push(animator);

    const knightSheet = this.assetPool.getAsset<unknown>('knightSpriteSheet');
    if (!isSpriteSheetAsset(knightSheet)) {
      throw new Error('Knight sprite sheet unavailable.');
    }

    const knightRunSheet = this.assetPool.getAsset<unknown>('knightRunSpriteSheet');
    if (!isSpriteSheetAsset(knightRunSheet)) {
      throw new Error('Knight run sprite sheet unavailable.');
    }

    const knightIdleSheet = knightIdleSpriteSheet;

    const knightAttack1Sheet = this.assetPool.getAsset<unknown>('knightAttack1SpriteSheet');
    if (!isSpriteSheetAsset(knightAttack1Sheet)) {
      throw new Error('Knight attack 1 sprite sheet unavailable.');
    }

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

    const playerAnimations: IPlayerAnimations = {
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

    return components;
  }

  protected getPrefabSettings(): IPrefabSettings {
    return {
      x: 0,
      y: 0,
      rotation: 0,
      name: 'player',
      tag: 'player',
      layer: Layer.Friendly
    };
  }

  protected override buildAndReturnChildGameObjects(config: IGameObjectConstructionParams): GameObject[] {
    const healthBar = new Healthbar(config);

    healthBar.transform.setPosition(this.transform.position.x, this.transform.position.y - 60);

    return [healthBar];
  }
}
