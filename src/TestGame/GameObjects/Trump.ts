import { GameObject } from '../../GameEngine/Core/GameObject';
import { Component } from '../../GameEngine/Components/Component';
import { RectangleCollider } from '../../GameEngine/Components/RectangleCollider';
import TrumpIdleSprite from '../Assets/Images/trump_idle.png';
import { Animation } from '../../GameEngine/Core/Helpers/Animation';
import { Animator } from '../../GameEngine/Components/Animator';
import { NavAgent } from '../../GameEngine/Components/NavAgent';
import { NavTester } from '../Components/NavTester';
import { PhysicalMaterial } from '../../GameEngine/Core/Helpers/PhysicalMaterial';
import { PrefabSettings } from '../../GameEngine/Core/Interfaces/PrefabSettings';
import { Layer } from '../../GameEngine/Core/Enums/Layer';
import { GameEngineAPIs } from '../../GameEngine/Core/Interfaces/GameEngineAPIs';

export class Trump extends GameObject {

    protected buildInitialComponents(gameEngineAPIs: GameEngineAPIs): Component[] {
        const components: Component[] = [];

        const collider = new RectangleCollider(this, null, 60, 60, 0, -5);
        collider.physicalMaterial = PhysicalMaterial.bouncy;
        components.push(collider);

        const navAgent = new NavAgent(this, gameEngineAPIs.terrain.navGrid);
        components.push(navAgent);

        const initialAnimation = new Animation(TrumpIdleSprite, 10, 4, 0.1, [4]);
        const animator = new Animator(this, 75, 75, initialAnimation, gameEngineAPIs.time);
        components.push(animator);

        components.push(new NavTester(this, navAgent, animator, gameEngineAPIs.input));

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