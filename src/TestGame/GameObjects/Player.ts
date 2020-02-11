import { GameObject } from '../../GameEngine/GameObjects/GameObject';
import { Component } from '../../GameEngine/Components/Component';
import { RectangleCollider } from '../../GameEngine/Components/RectangleCollider';
import { Animation } from '../../GameEngine/Core/Helpers/Animation';
import { Animator } from '../../GameEngine/Components/Animator';
import { PlayerMotor } from '../Components/Characters/Player/PlayerMotor';
import { PhysicalMaterial } from '../../GameEngine/Core/Helpers/PhysicalMaterial';
import { SpriteSheet } from '../../GameEngine/Core/Helpers/SpriteSheet';
import { PrefabSettings } from '../../GameEngine/Core/Interfaces/PrefabSettings';
import { Layer } from '../../GameEngine/Core/Enums/Layer';
import { CharacterAnimator } from '../Components/Characters/CharacterAnimator';
import { CharacterAnimations } from '../Interfaces/CharacterAnimations';
import { CharacterStats } from '../Components/Characters/CharacterStats';
import { Spawner } from '../Components/Spawner';
import { Minotaur } from './Minotaur';
import { GameEngine } from '../../GameEngine/Core/GameEngine';
import { Healthbar } from './Healthbar';
import { GameObjectConstructionParams } from '../../GameEngine/Core/Interfaces/GameObjectConstructionParams';

export class Player extends GameObject {

    protected buildInitialComponents(): Component[] {
        const components: Component[] = [];
        
        const collider = new RectangleCollider(this, null, 30, 30, 0, 0);
        collider.physicalMaterial = PhysicalMaterial.bouncy;
        components.push(collider);
        
        const idleFrames = this.assetPool.getAsset<SpriteSheet>('knightSpriteSheet').getFrames(9);

        const initialAnimation = new Animation(idleFrames, 0.2);
        const animator = new Animator(this, 75, 75, initialAnimation);
        components.push(animator);

        const knightSheet = this.assetPool.getAsset<SpriteSheet>('knightSpriteSheet');

        const rightAttackAnimation1 = new Animation(knightSheet.getFrames(2), 0.075);
        const rightAttackAnimation2 = new Animation(knightSheet.getFrames(4), 0.075);
        const leftAttackAnimation1 = new Animation(knightSheet.getFrames(1), 0.075);
        const leftAttackAnimation2 = new Animation(knightSheet.getFrames(3), 0.075);

        const playerAnimations: CharacterAnimations = {
            rightAttackAnimations: [rightAttackAnimation1, rightAttackAnimation2],
            leftAttackAnimations: [leftAttackAnimation1, leftAttackAnimation2],
            runRightAnimation: new Animation(knightSheet.getFrames(14), 0.075),
            runLeftAnimation: new Animation(knightSheet.getFrames(13), 0.075),
            idleRightAnimation: new Animation(knightSheet.getFrames(9), 0.2),
            idleLeftAnimation: new Animation(knightSheet.getFrames(10), 0.2),
            jumpRightAnimation: new Animation(knightSheet.getFrames(12), 0.1),
            jumpLeftAnimation: new Animation(knightSheet.getFrames(11), 0.1),
            dieRightAnimation: new Animation(knightSheet.getFrames(6), 0.075),
            dieLeftAnimation: new Animation(knightSheet.getFrames(5), 0.075)
        };

        const playerAnimator = new CharacterAnimator(this, animator, playerAnimations);
        components.push(playerAnimator);

        const myStats = new CharacterStats(this, playerAnimator);
        components.push(myStats);

        components.push(new PlayerMotor(this, collider, playerAnimator, myStats));
        components.push(new Spawner(this, [Minotaur]));

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

    protected buildAndReturnChildGameObjects(config: GameObjectConstructionParams): GameObject[] {
        const healthBar = new Healthbar(config);

        healthBar.transform.setPosition(this.transform.position.x, this.transform.position.y - 60);

        return [healthBar];
    }
}