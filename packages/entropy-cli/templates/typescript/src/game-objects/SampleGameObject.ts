import {
    GameObject,
    PrefabSettings,
    Layer,
    GameObjectConstructionParams,
    Component,
    RectangleRenderer,
    Rigidbody,
    RectangleCollider,
    PhysicalMaterial
} from '@entropy-engine/entropy-game-engine';
import { Jumper } from '../components/Jumper';

export class SampleGameObject extends GameObject {
    protected getPrefabSettings(): PrefabSettings {
        return {
            x: 100,
            y: 100,
            rotation: 0,
            id: 'test',
            layer: Layer.Default,
            tag: 'test'
        };
    }

    protected buildInitialComponents(_config: GameObjectConstructionParams): Component[] {
        const components: Component[] = [];

        components.push(new RectangleRenderer(this, 15, 15, 'white'));

        const rb = new Rigidbody(this);
        const collider = new RectangleCollider(this, rb, 15, 15);
        collider.physicalMaterial = PhysicalMaterial.bouncy;
        const jumper = new Jumper(this, rb);

        components.push(jumper);
        components.push(rb);
        components.push(collider);

        return components;
    }

    protected buildAndReturnChildGameObjects(_config: GameObjectConstructionParams): GameObject[] {
        return [];
    }
}
