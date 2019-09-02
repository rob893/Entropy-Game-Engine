import { GameObject } from '../../GameEngine/Core/GameObject';
import { Component } from '../../GameEngine/Components/Component';
import { RectangleCollider } from '../../GameEngine/Components/RectangleCollider';
import { Animation } from '../../GameEngine/Core/Helpers/Animation';
import { Animator } from '../../GameEngine/Components/Animator';
import { Rigidbody } from '../../GameEngine/Components/Rigidbody';
import { PhysicalMaterial } from '../../GameEngine/Core/Helpers/PhysicalMaterial';
import { PrefabSettings } from '../../GameEngine/Core/Interfaces/PrefabSettings';
import { Layer } from '../../GameEngine/Core/Enums/Layer';
import { SpriteSheet } from '../../GameEngine/Core/Helpers/SpriteSheet';

export class TrumpRB extends GameObject {

    protected buildInitialComponents(): Component[] {
        const components: Component[] = [];

        const rb = new Rigidbody(this);
        components.push(rb);

        const collider = new RectangleCollider(this, rb, 60, 60, 0, -5);
        collider.physicalMaterial = PhysicalMaterial.bouncy;
        components.push(collider);

        const trumpIdleFrames = this.assetPool.getAsset<SpriteSheet>('trumpIdleSpriteSheet').getFrames(4);

        const initialAnimation = new Animation(trumpIdleFrames, 0.1);
        components.push(new Animator(this, 75, 75, initialAnimation));

        return components;
    }

    protected getPrefabSettings(): PrefabSettings {
        return {
            x: 400,
            y: 250,
            rotation: 0,
            id: 'trumpRB',
            tag: 'trumpRB',
            layer: Layer.Default
        };
    }
}