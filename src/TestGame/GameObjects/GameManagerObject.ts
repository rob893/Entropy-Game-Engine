import { Component } from '../../GameEngine/Components/Component';
import { GameObject } from '../../GameEngine/Core/GameObject';
import { FPSCounter } from '../../GameEngine/Components/FPSCounter';
import { GameManager } from '../Components/GameManager';
import { APIs } from '../../GameEngine/Core/Interfaces/APIs';
//import MarioTheme from '../../assets/sounds/marioTheme.mp3';

export class GameManagerObject extends GameObject {

    protected buildInitialComponents(apis: APIs): Component[] {
        const gameManagerComponents: Component[] = [];
        
        gameManagerComponents.push(new GameManager(this, apis.input));
        gameManagerComponents.push(new FPSCounter(this));

        return gameManagerComponents;
    }
}