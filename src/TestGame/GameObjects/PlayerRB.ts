import { GameObject } from '../../GameEngine/Core/GameObject';
import { Component } from '../../GameEngine/Components/Component';
import { RectangleCollider } from '../../GameEngine/Components/RectangleCollider';
import TrumpIdleSprite from '../Assets/Images/trump_idle.png';
import { Animation } from '../../GameEngine/Core/Helpers/Animation';
import { Animator } from '../../GameEngine/Components/Animator';
import { Rigidbody } from '../../GameEngine/Components/Rigidbody';
import { PhysicalMaterial } from '../../GameEngine/Core/Helpers/PhysicalMaterial';
import { PlayerPhysicsMotor } from '../Components/PlayerPhysicsMotor';
import { Weapon } from './Weapon';
import { PrefabSettings } from '../../GameEngine/Core/Interfaces/PrefabSettings';
import { Layer } from '../../GameEngine/Core/Enums/Layer';
import { GameEngineAPIs } from '../../GameEngine/Core/Interfaces/GameEngineAPIs';
import { ThrowableBall } from './ThrowableBall';
import { SpriteSheet } from '../../GameEngine/Core/Helpers/SpriteSheet';
import { AudioSource } from '../../GameEngine/Components/AudioSource';
import { AudioClip } from '../../GameEngine/Core/Helpers/AudioClip';
import { PlayerHealth } from '../Components/PlayerHealth';

export class PlayerRB extends GameObject {

    protected buildInitialComponents(gameEngineAPIs: GameEngineAPIs): Component[] {
        const components: Component[] = [];

        const rb = new Rigidbody(this);
        components.push(rb);

        const collider = new RectangleCollider(this, rb, 35, 35, 0, -5);
        collider.physicalMaterial = PhysicalMaterial.bouncy;
        components.push(collider);

        const trumpIdleFrames = gameEngineAPIs.assetPool.getAsset<SpriteSheet>('trumpIdleSpriteSheet').getFrames(4);

        const initialAnimation = new Animation(trumpIdleFrames, 0.1);
        const animator = new Animator(this, 75, 75, initialAnimation, gameEngineAPIs.time);
        components.push(animator);

        const audioSource = new AudioSource(this, gameEngineAPIs.assetPool.getAsset<AudioClip>('hurtSound'));
        components.push(audioSource);

        components.push(new PlayerHealth(this, gameEngineAPIs.objectManager, audioSource));

        components.push(new PlayerPhysicsMotor(this, rb, animator, gameEngineAPIs.input, gameEngineAPIs.objectManager, gameEngineAPIs.assetPool));

        return components;
    }

    protected buildAndReturnChildGameObjects(gameEngineAPIs: GameEngineAPIs): GameObject[] {
        // const ball = new ThrowableBall(gameEngineAPIs, 'ball');
        
        // ball.transform.setPosition(this.transform.position.x, this.transform.position.y - 20);

        // return [ball];
        return [];
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