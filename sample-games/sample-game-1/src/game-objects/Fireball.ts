import {
  Animation,
  Animator,
  Component,
  GameObject,
  Layer,
  IPrefabSettings,
  RectangleCollider,
  SpriteSheet
} from '@entropy-engine/entropy-game-engine';
import { FireballBehavior } from '../components/FireballBehavior';

export class Fireball extends GameObject {
  protected buildInitialComponents(): Component[] {
    const fireballSpriteSheet = this.assetPool.getAsset('redFireball') as SpriteSheet;
    const fireballAnimation = new Animation(fireballSpriteSheet.getFrames(), 0.1);
    const collider = new RectangleCollider(this, null, 20, 20);
    collider.isTrigger = true;
    const fireballBehavior = new FireballBehavior(this, collider);

    return [new Animator(this, 50, 25, fireballAnimation), collider, fireballBehavior];
  }

  protected getPrefabSettings(): IPrefabSettings {
    return {
      x: 0,
      y: 0,
      rotation: 0,
      name: 'fireball',
      tag: '',
      layer: Layer.Default
    };
  }
}
