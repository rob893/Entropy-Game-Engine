import { GameObject } from '../../GameEngine/Core/GameObject';
import { Component } from '../../GameEngine/Components/Component';
import { RectangleCollider } from '../../GameEngine/Components/RectangleCollider';
import TrumpIdleSprite from '../Assets/Images/trump_idle.png';
import { Animation } from '../../GameEngine/Core/Helpers/Animation';
import { Animator } from '../../GameEngine/Components/Animator';
import { Player2Motor } from '../Components/Player2Motor';
import { PhysicalMaterial } from '../../GameEngine/Core/Helpers/PhysicalMaterial';
import { GameEngineAPIs } from '../../GameEngine/Core/Interfaces/GameEngineAPIs';
import { SpriteSheet } from '../../GameEngine/Core/Helpers/SpriteSheet';

export class Player2 extends GameObject {

    protected buildInitialComponents(gameEngineAPIs: GameEngineAPIs): Component[] {
        const components: Component[] = [];
        
        const collider = new RectangleCollider(this, null, 35, 35, 0, -5);
        collider.physicalMaterial = PhysicalMaterial.bouncy;
        components.push(collider);
        
        const trumpIdleFrames = gameEngineAPIs.assetPool.getAsset<SpriteSheet>('trumpIdleSpriteSheet').getFrames(4);

        const initialAnimation = new Animation(trumpIdleFrames, 0.1);
        const animator = new Animator(this, 75, 75, initialAnimation, gameEngineAPIs.time);
        components.push(animator);

        components.push(new Player2Motor(this, gameEngineAPIs.gameCanvas, collider, animator, gameEngineAPIs.input, gameEngineAPIs.assetPool));

        return components;
    }
}