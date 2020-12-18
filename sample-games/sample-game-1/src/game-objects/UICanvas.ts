import {
  Button,
  ClickedOnDetector,
  Component,
  GameObject,
  GameObjectConstructionParams,
  Layer,
  PrefabSettings
} from '@entropy-engine/entropy-game-engine';

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

    button.getComponent(ClickedOnDetector)?.onClicked.subscribe(() => config.gameEngine.togglePause());

    return [button];
  }
}
