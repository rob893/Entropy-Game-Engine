import {
  Animation,
  Animator,
  AudioClip,
  AudioSource,
  Component,
  GameObject,
  Layer,
  IPrefabSettings
} from '@entropy-engine/entropy-game-engine';
import { Exploder } from '../components/Exploder';

type SpriteSheetAsset = {
  getFrames(rows?: number | number[]): HTMLImageElement[];
};

function isSpriteSheetAsset(value: unknown): value is SpriteSheetAsset {
  return typeof value === 'object' && value !== null && 'getFrames' in value && typeof value.getFrames === 'function';
}

export class Explosion extends GameObject {
  protected buildInitialComponents(): Component[] {
    const explosionSpriteSheet = this.assetPool.getAsset<unknown>('explosionSpriteSheet');

    if (!isSpriteSheetAsset(explosionSpriteSheet)) {
      throw new Error('Explosion sprite sheet unavailable.');
    }

    const explosionAnimation = new Animation(explosionSpriteSheet.getFrames(), 0.04);
    explosionAnimation.loop = false;

    const audioSource = new AudioSource(this, this.assetPool.getAsset<AudioClip>('explosionSound'));

    return [audioSource, new Animator(this, 75, 75, explosionAnimation), new Exploder(this, audioSource)];
  }

  protected getPrefabSettings(): IPrefabSettings {
    return {
      x: 0,
      y: 0,
      rotation: 0,
      name: 'explosion',
      tag: '',
      layer: Layer.Default
    };
  }
}
