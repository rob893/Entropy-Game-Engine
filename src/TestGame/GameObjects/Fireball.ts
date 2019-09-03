import { GameObject } from '../../GameEngine/Core/GameObject';
import { Animator } from '../../GameEngine/Components/Animator';
import { Animation } from '../../GameEngine/Core/Helpers/Animation';
import { SpriteSheet } from '../../GameEngine/Core/Helpers/SpriteSheet';
import { RectangleCollider } from '../../GameEngine/Components/RectangleCollider';
import { FireballBehavior } from '../Components/FireballBehavior';
import { PrefabSettings } from '../../GameEngine/Core/Interfaces/PrefabSettings';
import { Layer } from '../../GameEngine/Core/Enums/Layer';

export class Fireball extends GameObject {

    protected getPrefabSettings(): PrefabSettings {
        const fireballAnimation = new Animation(this.assetPool.getAsset<SpriteSheet>('redFireball').getFrames(), 0.1);
        const collider = new RectangleCollider(this, null, 20, 20);
        collider.isTrigger = true;
        const fireballBehavior = new FireballBehavior(this, collider);
        
        return {
            x: 0,
            y: 0,
            rotation: 0,
            id: 'fireball',
            tag: '',
            layer: Layer.Default,
            components: [
                new Animator(this, 50, 25, fireballAnimation),
                collider,
                fireballBehavior
            ]
        };
    }
}