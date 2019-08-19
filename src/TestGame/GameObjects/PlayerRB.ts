import { GameObject } from '../../GameEngine/Core/GameObject';
import { Component } from '../../GameEngine/Components/Component';
import { RectangleCollider } from '../../GameEngine/Components/RectangleCollider';
import TrumpIdleSprite from '../Assets/Images/trump_idle.png';
import { Animation } from '../../GameEngine/Core/Helpers/Animation';
import { Animator } from '../../GameEngine/Components/Animator';
//import { TrumpMotor } from '../Components/TrumpMotor';
//import { AudioSource } from '../../GameEngine/Components/AudioSource';
import { Rigidbody } from '../../GameEngine/Components/Rigidbody';
import { PhysicalMaterial } from '../../GameEngine/Core/Helpers/PhysicalMaterial';
import { PlayerPhysicsMotor } from '../Components/PlayerPhysicsMotor';
import { Weapon } from './Weapon';
import { GameEngine } from '../../GameEngine/Core/GameEngine';
import { PrefabSettings } from '../../GameEngine/Core/Interfaces/PrefabSettings';
import { Layer } from '../../GameEngine/Core/Enums/Layer';

export class PlayerRB extends GameObject {

    protected buildInitialComponents(gameEngine: GameEngine): Component[] {
        const components: Component[] = [];

        const rb = new Rigidbody(this);
        components.push(rb);

        const collider = new RectangleCollider(this, rb, 35, 35, 0, -5);
        collider.physicalMaterial = PhysicalMaterial.bouncy;
        components.push(collider);

        const initialAnimation = new Animation(TrumpIdleSprite, 10, 4, 0.1, [4]);
        const animator = new Animator(this, 75, 75, initialAnimation);
        components.push(animator);

        components.push(new PlayerPhysicsMotor(this, rb, animator, gameEngine.apis.input));
        //components.push(new AudioSource(this));

        return components;
    }

    protected buildChildGameObjects(gameEngine: GameEngine): void {
        const weapon = new Weapon(gameEngine, 'weapon');
        weapon.transform.parent = this.transform;
    }

    protected getPrefabSettings(): PrefabSettings {
        return {
            x: 400,
            y: 250,
            rotation: 0,
            id: 'player',
            tag: 'player',
            layer: Layer.Default
        };
    }
}