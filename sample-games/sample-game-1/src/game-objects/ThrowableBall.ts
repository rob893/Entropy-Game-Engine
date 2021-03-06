import {
  Component,
  GameObject,
  Layer,
  PhysicalMaterial,
  PrefabSettings,
  RectangleCollider,
  RectangleRenderer,
  Rigidbody
} from '@entropy-engine/entropy-game-engine';
import { Grenade } from '../components/Grenade';

export class ThrowableBall extends GameObject {
  protected buildInitialComponents(): Component[] {
    const components: Component[] = [];

    components.push(new RectangleRenderer(this, 15, 15, 'white'));

    const rb = new Rigidbody(this);
    const collider = new RectangleCollider(this, rb, 15, 15);
    collider.physicalMaterial = PhysicalMaterial.bouncy;

    components.push(rb);
    components.push(collider);
    components.push(new Grenade(this));

    return components;
  }

  protected getPrefabSettings(): PrefabSettings {
    return {
      x: 0,
      y: 0,
      rotation: 0,
      id: 'throwableBall',
      tag: '',
      layer: Layer.Default
    };
  }
}
