import {
  Button,
  ClickedOnDetector,
  Component,
  GameObject,
  IGameObjectConstructionParams,
  Layer,
  IPrefabSettings
} from '@entropy-engine/entropy-game-engine';

export class UICanvas extends GameObject {
  protected buildInitialComponents(): Component[] {
    return [];
  }

  protected getPrefabSettings(): IPrefabSettings {
    return {
      x: 0,
      y: 0,
      rotation: 0,
      name: 'ui-canvas',
      tag: 'ui',
      layer: Layer.UI
    };
  }

  protected override buildAndReturnChildGameObjects(config: IGameObjectConstructionParams): GameObject[] {
    const button = new Button({ gameEngine: config.gameEngine, name: 'button1', x: 150, y: 150 });

    button.getComponent(ClickedOnDetector)?.onClicked.subscribe(() => config.gameEngine.togglePause());

    return [button];
  }
}
