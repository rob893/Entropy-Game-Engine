import {
  Component,
  FPSCounter,
  GameObject,
  IGameObjectConstructionParams,
  Layer,
  IPrefabSettings
} from '@entropy-engine/entropy-game-engine';

export class GameManager extends GameObject {
  protected buildInitialComponents(_config: IGameObjectConstructionParams): Component[] {
    const fpsCounter = new FPSCounter(this);

    return [fpsCounter];
  }

  protected getPrefabSettings(): IPrefabSettings {
    return {
      x: 0,
      y: 0,
      rotation: 0,
      name: 'gameManager',
      tag: 'gameManager',
      layer: Layer.Default
    };
  }
}
