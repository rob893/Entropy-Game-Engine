import {
  Animation,
  Animator,
  AudioClip,
  AudioSource,
  Component,
  GameObject,
  Layer,
  IPrefabSettings,
  SpriteSheet
} from '@entropy-engine/entropy-game-engine';
import { Exploder } from '../components/Exploder';

export class Explosion extends GameObject {
  protected buildInitialComponents(): Component[] {
    const explosionSpriteSheet = this.assetPool.getAsset('explosionSpriteSheet') as SpriteSheet;
    const explosionSound = this.assetPool.getAsset('explosionSound') as AudioClip;
    const explosionAnimation = new Animation(explosionSpriteSheet.getFrames(), 0.04);
    explosionAnimation.loop = false;

    const audioSource = new AudioSource(this, explosionSound);

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
