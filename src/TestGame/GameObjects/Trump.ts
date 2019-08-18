import { GameObject } from '../../GameEngine/Core/GameObject';
import { Component } from '../../GameEngine/Components/Component';
import { RectangleCollider } from '../../GameEngine/Components/RectangleCollider';
import TrumpIdleSprite from '../Assets/Images/trump_idle.png';
import { Animation } from '../../GameEngine/Core/Helpers/Animation';
import { Animator } from '../../GameEngine/Components/Animator';
//import { TrumpMotor } from '../Components/TrumpMotor';
//import { AudioSource } from '../../GameEngine/Components/AudioSource';
import { NavAgent } from '../../GameEngine/Components/NavAgent';
import { NavTester } from '../Components/NavTester';
import { Rigidbody } from '../../GameEngine/Components/Rigidbody';
import { PhysicalMaterial } from '../../GameEngine/Core/Helpers/PhysicalMaterial';
import { GameEngine } from '../../GameEngine/Core/GameEngine';
import { PrefabSettings } from '../../GameEngine/Core/Interfaces/PrefabSettings';
import { Layer } from '../../GameEngine/Core/Enums/Layer';

export class Trump extends GameObject {

    protected buildInitialComponents(): Component[] {
        const components: Component[] = [];

        const collider = new RectangleCollider(this, null, 60, 60, 0, -5);
        collider.physicalMaterial = PhysicalMaterial.bouncy;
        components.push(collider);

        const navAgent = new NavAgent(this, this.gameEngine.terrain.navGrid);
        components.push(navAgent);

        const initialAnimation = new Animation(TrumpIdleSprite, 10, 4, 0.1, [4]);
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