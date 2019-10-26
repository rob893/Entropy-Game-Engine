import { GameObject } from '../../GameEngine/Core/GameObject';
import { Component } from '../../GameEngine/Components/Component';
import { RectangleCollider } from '../../GameEngine/Components/RectangleCollider';
import { Animation } from '../../GameEngine/Core/Helpers/Animation';
import { Animator } from '../../GameEngine/Components/Animator';
import { PlayerMotor } from '../Components/PlayerMotor';
import { PhysicalMaterial } from '../../GameEngine/Core/Helpers/PhysicalMaterial';
import { SpriteSheet } from '../../GameEngine/Core/Helpers/SpriteSheet';
import { PrefabSettings } from '../../GameEngine/Core/Interfaces/PrefabSettings';
import { Layer } from '../../GameEngine/Core/Enums/Layer';
import { PlayerAnimator } from '../Components/PlayerAnimator';

export class Player extends GameObject {

    protected buildInitialComponents(): Component[] {
        const components: Component[] = [];
        
        const collider = new RectangleCollider(this, null, 35, 35, 0, -5);
        collider.physicalMaterial = PhysicalMaterial.bouncy;
        components.push(collider);
        
        const idleFrames = this.assetPool.getAsset<SpriteSheet>('knightSpriteSheet').getFrames(9);

        const initialAnimation = new Animation(idleFrames, 0.2);
        const animator = new Animator(this, 75, 75, initialAnimation);
        components.push(animator);

        const playerAnimator = new PlayerAnimator(this, animator);
        components.push(playerAnimator);

        components.push(new PlayerMotor(this, collider, playerAnimator));

        return components;
    }
    
    protected getPrefabSettings(): PrefabSettings {
        return {
            x: 0,
            y: 0,
            rotation: 0,
            id: 'player',
            tag: 'player',
            layer: Layer.Friendly
        };
    }
}