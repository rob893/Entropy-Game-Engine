import {
  Animation,
  Animator,
  Component,
  GameObject,
  Layer,
  PhysicalMaterial,
  IPrefabSettings,
  RectangleCollider,
  Rigidbody,
  SpriteSheet
} from '@entropy-engine/entropy-game-engine';

export class TrumpRB extends GameObject {
  protected buildInitialComponents(): Component[] {
    const components: Component[] = [];

    const rb = new Rigidbody(this);
    components.push(rb);

    const collider = new RectangleCollider(this, rb, 35, 35, 0, -5);
    collider.physicalMaterial = PhysicalMaterial.bouncy;
    components.push(collider);

    const trumpIdleFrames = this.assetPool.getAsset<SpriteSheet>('minotaurSpriteSheet').getFrames(1);

    const initialAnimation = new Animation(trumpIdleFrames, 0.1);
    components.push(new Animator(this, 75, 75, initialAnimation));

    return components;
  }

  protected getPrefabSettings(): IPrefabSettings {
    return {
      x: 400,
      y: 250,
      rotation: 0,
      name: 'trumpRB',
      tag: 'trumpRB',
      layer: Layer.Default
    };
  }
}
