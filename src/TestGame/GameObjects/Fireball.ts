import { GameObject } from '../../GameEngine/Core/GameObject';
import { Component } from '../../GameEngine/Components/Component';
import { Animator } from '../../GameEngine/Components/Animator';
import { Animation } from '../../GameEngine/Core/Helpers/Animation';
import { SpriteSheet } from '../../GameEngine/Core/Helpers/SpriteSheet';
import { RectangleCollider } from '../../GameEngine/Components/RectangleCollider';
import { FireballBehavior } from '../Components/FireballBehavior';

export class Fireball extends GameObject {

    protected buildInitialComponents(): Component[] {
        const fireballAnimation = new Animation(this.assetPool.getAsset<SpriteSheet>('redFireball').getFrames(), 0.1);
        const collider = new RectangleCollider(this, null, 20, 20);
        collider.isTrigger = true;
        const fireballBehavior = new FireballBehavior(this, collider);

        return [
            new Animator(this, 50, 25, fireballAnimation),
            collider,
            fireballBehavior
        ];
    }
}