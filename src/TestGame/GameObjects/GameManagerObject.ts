import { GameObject } from '../../GameEngine/Core/GameObject';
import { FPSCounter } from '../../GameEngine/Components/FPSCounter';
import { GameManager } from '../Components/GameManager';
import { PrefabSettings } from '../../GameEngine/Core/Interfaces/PrefabSettings';
import { Layer } from '../../GameEngine/Core/Enums/Layer';

export class GameManagerObject extends GameObject {

    protected getPrefabSettings(): PrefabSettings {        
        return {
            x: 0,
            y: 0,
            rotation: 0,
            id: 'gameManager',
            tag: '',
            layer: Layer.Default,
            components: [
                new GameManager(this),
                new FPSCounter(this)
            ]
        };
    }
}