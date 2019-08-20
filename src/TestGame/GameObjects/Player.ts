import { GameObject } from '../../GameEngine/Core/GameObject';
import { Component } from '../../GameEngine/Components/Component';
import { RectangleCollider } from '../../GameEngine/Components/RectangleCollider';
import { PlayerMotor } from '../Components/PlayerMotor';
import { Rigidbody } from '../../GameEngine/Components/Rigidbody';
import { Animator } from '../../GameEngine/Components/Animator';
import MarioSprite from '../Assets/Images/mario.png';
import { Animation } from '../../GameEngine/Core/Helpers/Animation';
import { PlayerHealth } from '../Components/PlayerHealth';
import { PrefabSettings } from '../../GameEngine/Core/Interfaces/PrefabSettings';
import { Layer } from '../../GameEngine/Core/Enums/Layer';
import { GameEngineAPIs } from '../../GameEngine/Core/Interfaces/GameEngineAPIs';

export class Player extends GameObject {

    protected buildInitialComponents(gameEngineAPIs: GameEngineAPIs): Component[] {
        const playerComponents: Component[] = [];

        const rb = new Rigidbody(this);
        playerComponents.push(rb);

        const collider = new RectangleCollider(this, rb, 50, 50);
        playerComponents.push(collider);
        
        playerComponents.push(new PlayerHealth(this, gameEngineAPIs.objectManager));
        
        const initialAnimation = new Animation(MarioSprite, 4, 1, 0.1);
        const animator = new Animator(this, 50, 50, initialAnimation, gameEngineAPIs.time);
        playerComponents.push(animator);

        playerComponents.push(new PlayerMotor(this, gameEngineAPIs.gameCanvas, collider, rb, animator, gameEngineAPIs.input));

        return playerComponents;
    }

    protected getPrefabSettings(): PrefabSettings {
        return {
            x: 2,
            y: 175,
            rotation: 0,
            id: 'player',
            tag: 'player',
            layer: Layer.Default
        };
    }
}