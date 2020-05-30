import {
  GameObject,
  Layer,
  Component,
  PrefabSettings,
  SpriteSheet,
  AudioSource,
  AudioClip,
  Animator,
  Animation
} from '@entropy-engine/entropy-game-engine';
import { Exploder } from '../components/Exploder';

export class Explosion extends GameObject {
  protected buildInitialComponents(): Component[] {
    const explosionAnimation = new Animation(
      this.assetPool.getAsset<SpriteSheet>('explosionSpriteSheet').getFrames(),
      0.04
    );
    explosionAnimation.loop = false;

    const audioSource = new AudioSource(this, this.assetPool.getAsset<AudioClip>('explosionSound'));

    return [audioSource, new Animator(this, 75, 75, explosionAnimation), new Exploder(this, audioSource)];
  }

  protected getPrefabSettings(): PrefabSettings {
    return {
      x: 0,
      y: 0,
      rotation: 0,
      id: 'explosion',
      tag: '',
      layer: Layer.Default
    };
  }
}
