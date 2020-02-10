import { GameObject } from '../../GameEngine/Core/GameObject';
import { Component } from '../../GameEngine/Components/Component';
import { PrefabSettings } from '../../GameEngine/Core/Interfaces/PrefabSettings';
import { Layer } from '../../GameEngine/Core/Enums/Layer';
import { GameEngine } from '../../GameEngine/Core/GameEngine';
import { Button } from '../../GameEngine/GameObject/Button';
import { ClickedOnDetector } from '../../GameEngine/Components/ClickedOnDetector';

export class UICanvas extends GameObject {
    protected buildInitialComponents(): Component[] {
        return [];
    }
    
    protected getPrefabSettings(): PrefabSettings {
        return {
            x: 0,
            y: 0,
            rotation: 0,
            id: 'ui-canvas',
            tag: 'ui',
            layer: Layer.UI
        };
    }

    protected buildAndReturnChildGameObjects(gameEngine: GameEngine): GameObject[] {
        const button = new Button(gameEngine, 'button1', 150, 150);

        button.getComponent(ClickedOnDetector)?.onClicked.add(() => gameEngine.togglePause());
        
        return [button];
    }
}