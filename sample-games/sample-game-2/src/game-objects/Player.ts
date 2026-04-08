import {
  Animation,
  Animator,
  Component,
  GameObject,
  Layer,
  IPrefabSettings,
  RectangleCollider
} from '@entropy-engine/entropy-game-engine';
import { PlayerMotor } from '../components/PlayerMotor';

type SpriteSheetAsset = {
  getFrames(rows?: number | number[]): HTMLImageElement[];
};

function isSpriteSheetAsset(value: unknown): value is SpriteSheetAsset {
  return typeof value === 'object' && value !== null && 'getFrames' in value && typeof value.getFrames === 'function';
}

export class Player extends GameObject {
  protected buildInitialComponents(): Component[] {
    const collider = new RectangleCollider(this, null, 60, 30);

    const helicopterSpriteSheet = this.assetPool.getAsset('helicopterSpriteSheet');

    if (!isSpriteSheetAsset(helicopterSpriteSheet)) {
      throw new Error('Helicopter sprite sheet unavailable.');
    }

    const animation = new Animation(helicopterSpriteSheet.getFrames());
    const animator = new Animator(this, 60, 30, animation);

    const motor = new PlayerMotor(this);

    return [collider, animator, motor];
  }

  protected getPrefabSettings(): IPrefabSettings {
    return {
      x: 100,
      y: this.gameCanvas.height / 2,
      rotation: 0,
      name: 'player',
      tag: 'player',
      layer: Layer.Friendly
    };
  }
}
