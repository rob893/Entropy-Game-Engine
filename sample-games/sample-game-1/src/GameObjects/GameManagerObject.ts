import { GameObject } from '../../GameEngine/GameObjects/GameObject';
import { FPSCounter } from '../../GameEngine/Components/FPSCounter';
import { GameManager } from '../Components/GameManager';
import { PrefabSettings } from '../../GameEngine/Core/Interfaces/PrefabSettings';
import { Layer } from '../../GameEngine/Core/Enums/Layer';
import { Component } from '../../GameEngine/Components/Component';

export class GameManagerObject extends GameObject {
    protected buildInitialComponents(): Component[] {
        return [new GameManager(this), new FPSCounter(this)];
    }

    protected getPrefabSettings(): PrefabSettings {
        return {
            x: 0,
            y: 0,
            rotation: 0,
            id: 'gameManager',
            tag: '',
            layer: Layer.Default
        };
    }
}
