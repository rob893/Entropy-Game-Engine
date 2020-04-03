import {
    GameObject,
    Component,
    PrefabSettings,
    Layer,
    GameObjectConstructionParams,
    Button,
    ClickedOnDetector
} from '@rherber/typescript-game-engine';

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

    protected buildAndReturnChildGameObjects(config: GameObjectConstructionParams): GameObject[] {
        const button = new Button({ gameEngine: config.gameEngine, id: 'button1', x: 150, y: 150 });

        button.getComponent(ClickedOnDetector)?.onClicked.add(() => config.gameEngine.togglePause());

        return [button];
    }
}
