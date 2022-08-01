import {
  Component,
  FPSCounter,
  GameObject,
  GameObjectConstructionParams,
  Layer,
  PrefabSettings
} from '@entropy-engine/entropy-game-engine';

export class GameManager extends GameObject {
  protected buildInitialComponents(_config: GameObjectConstructionParams): Component[] {
    const fpsCounter = new FPSCounter(this);

    return [fpsCounter];
  }

  protected getPrefabSettings(): PrefabSettings {
    return {
      x: 0,
      y: 0,
      rotation: 0,
      id: 'gameManager',
      tag: 'gameManager',
      layer: Layer.Default
    };
  }
}
