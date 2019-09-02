import { GameObject } from '../../GameEngine/Core/GameObject';
import { Component } from '../../GameEngine/Components/Component';
import { RectangleCollider } from '../../GameEngine/Components/RectangleCollider';
import { Animation } from '../../GameEngine/Core/Helpers/Animation';
import { Animator } from '../../GameEngine/Components/Animator';
import { NavAgent } from '../../GameEngine/Components/NavAgent';
import { NavTester } from '../Components/NavTester';
import { PhysicalMaterial } from '../../GameEngine/Core/Helpers/PhysicalMaterial';
import { PrefabSettings } from '../../GameEngine/Core/Interfaces/PrefabSettings';
import { Layer } from '../../GameEngine/Core/Enums/Layer';
import { SpriteSheet } from '../../GameEngine/Core/Helpers/SpriteSheet';

export class Trump extends GameObject {

    protected buildInitialComponents(): Component[] {
        const components: Component[] = [];

        const collider = new RectangleCollider(this, null, 60, 60, 0, -5);
        collider.physicalMaterial = PhysicalMaterial.bouncy;
        components.push(collider);

        const navAgent = new NavAgent(this, this.terrain.navGrid);
        components.push(navAgent);
        
        const trumpIdleFrames = this.assetPool.getAsset<SpriteSheet>('trumpIdleSpriteSheet').getFrames(4);

        const initialAnimation = new Animation(trumpIdleFrames, 0.1);
        const animator = new Animator(this, 75, 75, initialAnimation);
        components.push(animator);

        components.push(new NavTester(this, navAgent, animator));

        return components;
    }

    protected getPrefabSettings(): PrefabSettings {
        return {
            x: 200,
            y: 300,
            rotation: 0,
            id: 'trump',
            tag: '',
            layer: Layer.Default
        };
    }
}