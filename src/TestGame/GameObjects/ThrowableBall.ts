import { GameObject } from '../../GameEngine/Core/GameObject';
import { Component } from '../../GameEngine/Components/Component';
import { RectangleRenderer } from '../../GameEngine/Components/RectangleRenderer';
import { GameEngineAPIs } from '../../GameEngine/Core/Interfaces/GameEngineAPIs';
import { Rigidbody } from '../../GameEngine/Components/Rigidbody';
import { RectangleCollider } from '../../GameEngine/Components/RectangleCollider';
import { PhysicalMaterial } from '../../GameEngine/Core/Helpers/PhysicalMaterial';
import { PrefabSettings } from '../../GameEngine/Core/Interfaces/PrefabSettings';
import { Layer } from '../../GameEngine/Core/Enums/Layer';

export class ThrowableBall extends GameObject {

    protected buildInitialComponents(gameEngineAPIs: GameEngineAPIs): Component[] {
        const components: Component[] = [];

        components.push(new RectangleRenderer(this, 15, 15, 'white'));

        const rb = new Rigidbody(this);
        const collider = new RectangleCollider(this, rb, 15, 15);
        collider.physicalMaterial = PhysicalMaterial.bouncy;

        components.push(rb);
        components.push(collider);
        
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