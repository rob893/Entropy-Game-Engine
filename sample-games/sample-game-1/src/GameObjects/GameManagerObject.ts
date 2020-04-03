import { GameObject, Layer, Component, PrefabSettings, FPSCounter } from '@rherber/entropy-game-engine';
import { GameManager } from '../Components/GameManager';

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
