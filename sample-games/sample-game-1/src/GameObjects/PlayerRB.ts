import { GameObject } from '../../GameEngine/GameObjects/GameObject';
import { Component } from '../../GameEngine/Components/Component';
import { RectangleCollider } from '../../GameEngine/Components/RectangleCollider';
import { Animation } from '../../GameEngine/Core/Helpers/Animation';
import { Animator } from '../../GameEngine/Components/Animator';
import { Rigidbody } from '../../GameEngine/Components/Rigidbody';
import { PhysicalMaterial } from '../../GameEngine/Core/Helpers/PhysicalMaterial';
import { PlayerPhysicsMotor } from '../Components/Characters/Player/PlayerPhysicsMotor';
import { PrefabSettings } from '../../GameEngine/Core/Interfaces/PrefabSettings';
import { Layer } from '../../GameEngine/Core/Enums/Layer';
import { SpriteSheet } from '../../GameEngine/Core/Helpers/SpriteSheet';
import { AudioSource } from '../../GameEngine/Components/AudioSource';
import { AudioClip } from '../../GameEngine/Core/Helpers/AudioClip';
import { PlayerHealth } from '../Components/Characters/Player/PlayerHealth';
import { GameEngine } from '../../GameEngine/Core/GameEngine';
import { CharacterAnimations } from '../Interfaces/CharacterAnimations';
import { CharacterAnimator } from '../Components/Characters/CharacterAnimator';
import { GameObjectConstructionParams } from '../../GameEngine/Core/Interfaces/GameObjectConstructionParams';

export class PlayerRB extends GameObject {
    protected buildInitialComponents(): Component[] {
        const components: Component[] = [];

        const rb = new Rigidbody(this);
        components.push(rb);

        const collider = new RectangleCollider(this, rb, 35, 35, 0, -5);
        collider.physicalMaterial = PhysicalMaterial.bouncy;
        components.push(collider);

        const minotaurSpriteSheet = this.assetPool.getAsset<SpriteSheet>('minotaurSpriteSheet');

        const attack1R = new Animation(minotaurSpriteSheet.getFrames(4), 0.075);
        const attack2R = new Animation(minotaurSpriteSheet.getFrames(7), 0.075);

        const attack1L = new Animation(minotaurSpriteSheet.getFrames(14), 0.075);
        const attack2L = new Animation(minotaurSpriteSheet.getFrames(17), 0.075);

        const animations: CharacterAnimations = {
            rightAttackAnimations: [attack1R, attack2R],
            leftAttackAnimations: [attack1L, attack2L],
            runLeftAnimation: new Animation(minotaurSpriteSheet.getFrames(12), 0.075),
            runRightAnimation: new Animation(minotaurSpriteSheet.getFrames(2), 0.075),
            idleLeftAnimation: new Animation(minotaurSpriteSheet.getFrames(11), 0.075),
            idleRightAnimation: new Animation(minotaurSpriteSheet.getFrames(1), 0.075),
            jumpLeftAnimation: new Animation(minotaurSpriteSheet.getFrames(11), 0.075),
            jumpRightAnimation: new Animation(minotaurSpriteSheet.getFrames(1), 0.075),
            dieLeftAnimation: new Animation(minotaurSpriteSheet.getFrames(20), 0.075),
            dieRightAnimation: new Animation(minotaurSpriteSheet.getFrames(10), 0.075)
        };

        const animator = new Animator(this, 75, 75, animations.idleLeftAnimation);
        components.push(animator);

        const characterAnimator = new CharacterAnimator(this, animator, animations);
        components.push(characterAnimator);

        const audioSource = new AudioSource(this, this.assetPool.getAsset<AudioClip>('hurtSound'));
        components.push(audioSource);

        components.push(new PlayerHealth(this, audioSource));

        components.push(new PlayerPhysicsMotor(this, rb, characterAnimator));

        return components;
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

    protected buildAndReturnChildGameObjects(config: GameObjectConstructionParams): GameObject[] {
        // const ball = new ThrowableBall(gameEngineAPIs, 'ball');

        // ball.transform.setPosition(this.transform.position.x, this.transform.position.y - 20);

        // return [ball];
        return [];
    }
}
