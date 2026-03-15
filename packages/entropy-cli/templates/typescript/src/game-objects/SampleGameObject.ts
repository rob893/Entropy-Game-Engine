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
import { Motor } from '../components/Motor';

export class SampleGameObject extends GameObject {
  protected getPrefabSettings(): PrefabSettings {
    return {
      x: 100,
      y: 100,
      rotation: 0,
      name: 'test',
      layer: Layer.Default,
      tag: 'test'
    };
  }

  protected buildInitialComponents(): Component[] {
    const components: Component[] = [];

    components.push(new RectangleRenderer(this, 15, 15, 'white'));

    const rb = new Rigidbody(this);
    const collider = new RectangleCollider(this, rb, 15, 15);
    collider.physicalMaterial = PhysicalMaterial.bouncy;
    const motor = new Motor(this, rb);

    components.push(motor);
    components.push(rb);
    components.push(collider);

    return components;
  }

  protected override buildAndReturnChildGameObjects(): GameObject[] {
    return [];
  }
}
