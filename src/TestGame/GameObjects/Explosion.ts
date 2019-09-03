import { GameObject } from '../../GameEngine/Core/GameObject';
import { Animator } from '../../GameEngine/Components/Animator';
import { Animation } from '../../GameEngine/Core/Helpers/Animation';
import { Exploder } from '../Components/Exploder';
import { SpriteSheet } from '../../GameEngine/Core/Helpers/SpriteSheet';
import { AudioSource } from '../../GameEngine/Components/AudioSource';
import { AudioClip } from '../../GameEngine/Core/Helpers/AudioClip';
import { PrefabSettings } from '../../GameEngine/Core/Interfaces/PrefabSettings';
import { Layer } from '../../GameEngine/Core/Enums/Layer';

export class Explosion extends GameObject {

    protected getPrefabSettings(): PrefabSettings {
        const explosionAnimation = new Animation(this.assetPool.getAsset<SpriteSheet>('explosionSpriteSheet').getFrames(), 0.04);
        explosionAnimation.loop = false;

        const audioSource = new AudioSource(this, this.assetPool.getAsset<AudioClip>('explosionSound'));
        
        return {
            x: 0,
            y: 0,
            rotation: 0,
            id: 'explosion',
            tag: '',
            layer: Layer.Default,
            components: [
                audioSource,
                new Animator(this, 75, 75, explosionAnimation), 
                new Exploder(this, audioSource)
            ]
        };
    }
}