import {
  Animation,
  Animator,
  Component,
  GameObject,
  GameObjectConstructionParams,
  Layer,
  PrefabSettings,
  RectangleCollider,
  SpriteSheet
} from '@entropy-engine/entropy-game-engine';
import { MissileMotor } from '../components/MissileMotor';

export class Missile extends GameObject {
  protected buildInitialComponents(_config: GameObjectConstructionParams): Component[] {
    const missleFrames = this.assetPool.getAsset<SpriteSheet>('missileSpriteSheet').getFrames();

    const collider = new RectangleCollider(this, null, 60, 15);

    const animation = new Animation(missleFrames, 0.1);
    const animator = new Animator(this, 60, 15, animation);

    const motor = new MissileMotor(this);

    return [collider, animator, motor];
  }

  protected getPrefabSettings(): PrefabSettings {
    return {
      x: 0,
      y: 0,
      rotation: 0,
      id: 'missle',
      tag: 'missle',
      layer: Layer.Hostile
    };
  }
}
