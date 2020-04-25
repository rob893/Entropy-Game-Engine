import {
  GameObject,
  Layer,
  Component,
  PrefabSettings,
  SpriteSheet,
  Animator,
  Animation,
  RectangleCollider
} from '@entropy-engine/entropy-game-engine';
import { FireballBehavior } from '../Components/FireballBehavior';

export class Fireball extends GameObject {
  protected buildInitialComponents(): Component[] {
    const fireballAnimation = new Animation(this.assetPool.getAsset<SpriteSheet>('redFireball').getFrames(), 0.1);
    const collider = new RectangleCollider(this, null, 20, 20);
    collider.isTrigger = true;
    const fireballBehavior = new FireballBehavior(this, collider);

    return [new Animator(this, 50, 25, fireballAnimation), collider, fireballBehavior];
  }

  protected getPrefabSettings(): PrefabSettings {
    return {
      x: 0,
      y: 0,
      rotation: 0,
      id: 'fireball',
      tag: '',
      layer: Layer.Default
    };
  }
}
