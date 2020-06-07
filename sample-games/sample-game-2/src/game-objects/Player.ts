import {
  GameObject,
  GameObjectConstructionParams,
  Component,
  PrefabSettings,
  Layer,
  Animation,
  SpriteSheet,
  Animator,
  RectangleCollider
} from '@entropy-engine/entropy-game-engine';
import { PlayerMotor } from '../components/PlayerMotor';

export class Player extends GameObject {
  protected buildInitialComponents(_config: GameObjectConstructionParams): Component[] {
    const helicopterFrames = this.assetPool.getAsset<SpriteSheet>('helicopterSpriteSheet').getFrames();

    const collider = new RectangleCollider(this, null, 60, 30);

    const animation = new Animation(helicopterFrames);
    const animator = new Animator(this, 60, 30, animation);

    const motor = new PlayerMotor(this);

    return [collider, animator, motor];
  }

  protected getPrefabSettings(): PrefabSettings {
    return {
      x: 100,
      y: this.gameCanvas.height / 2,
      rotation: 0,
      id: 'player',
      tag: 'player',
      layer: Layer.Friendly
    };
  }
}
