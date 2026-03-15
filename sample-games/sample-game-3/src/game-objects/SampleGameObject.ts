import {
  Component,
  GameObject,
  IGameObjectConstructionParams,
  Layer,
  PhysicalMaterial,
  IPrefabSettings,
  RectangleCollider,
  RectangleRenderer,
  Rigidbody
} from '@entropy-engine/entropy-game-engine';
import { Motor } from '../components/Motor';

export class SampleGameObject extends GameObject {
  protected getPrefabSettings(): IPrefabSettings {
    return {
      x: 100,
      y: 100,
      rotation: 0,
      name: 'test',
      layer: Layer.Default,
      tag: 'test'
    };
  }

  protected buildInitialComponents(_config: IGameObjectConstructionParams): Component[] {
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

  protected override buildAndReturnChildGameObjects(_config: IGameObjectConstructionParams): GameObject[] {
    return [];
  }
}
