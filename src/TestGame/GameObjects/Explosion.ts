import { GameObject } from '../../GameEngine/Core/GameObject';
import { GameEngineAPIs } from '../../GameEngine/Core/Interfaces/GameEngineAPIs';
import { Component } from '../../GameEngine/Components/Component';
import { Animator } from '../../GameEngine/Components/Animator';
import { Animation } from '../../GameEngine/Core/Helpers/Animation';
import ExplosionAnimation from '../Assets/Images/explosion.png';
import { Exploder } from '../Components/Exploder';

export class Explosion extends GameObject {

    protected buildInitialComponents(gameEngineAPIs: GameEngineAPIs): Component[] {
        const explosionAnimation = new Animation(ExplosionAnimation, 5, 5, 0.04);
        explosionAnimation.loop = false;

        return [
            new Animator(this, 75, 75, explosionAnimation, gameEngineAPIs.time), 
            new Exploder(this, gameEngineAPIs.objectManager, gameEngineAPIs.physics)
        ];
    }
}