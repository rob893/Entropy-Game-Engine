import { GameObject } from '../../GameEngine/Core/GameObject';
import { GameEngineAPIs } from '../../GameEngine/Core/Interfaces/GameEngineAPIs';
import { Component } from '../../GameEngine/Components/Component';
import { Animator } from '../../GameEngine/Components/Animator';
import { Animation } from '../../GameEngine/Core/Helpers/Animation';
import { Exploder } from '../Components/Exploder';
import { SpriteSheet } from '../../GameEngine/Core/Helpers/SpriteSheet';
import { AudioSource } from '../../GameEngine/Components/AudioSource';
import { AudioClip } from '../../GameEngine/Core/Helpers/AudioClip';

export class Explosion extends GameObject {

    protected buildInitialComponents(gameEngineAPIs: GameEngineAPIs): Component[] {
        const explosionAnimation = new Animation(gameEngineAPIs.assetPool.getAsset<SpriteSheet>('explosionSpriteSheet').getFrames(), 0.04);
        explosionAnimation.loop = false;

        const audioSource = new AudioSource(this, gameEngineAPIs.assetPool.getAsset<AudioClip>('explosionSound'));

        return [
            audioSource,
            new Animator(this, 75, 75, explosionAnimation, gameEngineAPIs.time), 
            new Exploder(this, gameEngineAPIs.objectManager, gameEngineAPIs.physics, audioSource)
        ];
    }
}