import { Component } from '../../GameEngine/Components/Component';
import { GameObject } from '../../GameEngine/Core/GameObject';
import { FPSCounter } from '../../GameEngine/Components/FPSCounter';
import { GameManager } from '../Components/GameManager';
import { GameEngineAPIs } from '../../GameEngine/Core/Interfaces/GameEngineAPIs';
//import MarioTheme from '../../assets/sounds/marioTheme.mp3';

export class GameManagerObject extends GameObject {

    protected buildInitialComponents(gameEngineAPIs: GameEngineAPIs): Component[] {
        const gameManagerComponents: Component[] = [];
        
        gameManagerComponents.push(new GameManager(this, gameEngineAPIs.input, gameEngineAPIs.time, gameEngineAPIs.sceneManager));
        gameManagerComponents.push(new FPSCounter(this, gameEngineAPIs.time));

        return gameManagerComponents;
    }
}