import { Component } from '../../GameEngine/Components/Component';
import { GameObject } from '../../GameEngine/Core/GameObject';
//import { GameManager } from '../Components/GameManager';
import { FPSCounter } from '../../GameEngine/Components/FPSCounter';
import { GameManager } from '../Components/GameManager';
import { GameEngine } from '../../GameEngine/Core/GameEngine';
//import { AudioSource } from '../../GameEngine/Components/AudioSource';
//import MarioTheme from '../../assets/sounds/marioTheme.mp3';

export class GameManagerObject extends GameObject {

    protected buildInitialComponents(gameEngine: GameEngine): Component[] {
        const gameManagerComponents: Component[] = [];
        
        gameManagerComponents.push(new GameManager(this, gameEngine, gameEngine.apis.input));
        gameManagerComponents.push(new FPSCounter(this));
        //gameManagerComponents.push(new AudioSource(this, MarioTheme));

        return gameManagerComponents;
    }
}