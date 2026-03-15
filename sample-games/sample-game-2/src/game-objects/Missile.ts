import {
  Animation,
  Animator,
  Component,
  GameObject,
  Layer,
  IPrefabSettings,
  RectangleCollider
} from '@entropy-engine/entropy-game-engine';
import { MissileMotor } from '../components/MissileMotor';

type SpriteSheetAsset = {
  getFrames(rows?: number | number[]): HTMLImageElement[];
};

function isSpriteSheetAsset(value: unknown): value is SpriteSheetAsset {
  return typeof value === 'object' && value !== null && 'getFrames' in value && typeof value.getFrames === 'function';
}

export class Missile extends GameObject {
  protected buildInitialComponents(): Component[] {
    const collider = new RectangleCollider(this, null, 60, 15);

    const missileSpriteSheet = this.assetPool.getAsset<unknown>('missileSpriteSheet');

    if (!isSpriteSheetAsset(missileSpriteSheet)) {
      throw new Error('Missile sprite sheet unavailable.');
    }

    const animation = new Animation(missileSpriteSheet.getFrames(), 0.1);
    const animator = new Animator(this, 60, 15, animation);

    const motor = new MissileMotor(this);

    return [collider, animator, motor];
  }

  protected getPrefabSettings(): IPrefabSettings {
    return {
      x: 0,
      y: 0,
      rotation: 0,
      name: 'missle',
      tag: 'missle',
      layer: Layer.Hostile
    };
  }
}
