import { Component } from '../../GameEngine/Components/Component';
import { GameObject } from '../../GameEngine/Core/GameObject';
import { FPSCounter } from '../../GameEngine/Components/FPSCounter';
import { GameManager } from '../Components/GameManager';

export class GameManagerObject extends GameObject {

    protected buildInitialComponents(): Component[] {
        const gameManagerComponents: Component[] = [];
        
        gameManagerComponents.push(new GameManager(this));
        gameManagerComponents.push(new FPSCounter(this));

        return gameManagerComponents;
    }
}