import {
  GameObject,
  Layer,
  Component,
  PrefabSettings,
  FPSCounter,
  // WeightedGraphVisualizer,
  GameObjectConstructionParams
} from '@entropy-engine/entropy-game-engine';
import { GameManager } from '../components/GameManager';

export class GameManagerObject extends GameObject {
  protected buildInitialComponents(_config: GameObjectConstructionParams): Component[] {
    return [
      // new WeightedGraphVisualizer(this, this.terrain.navGrid),
      new GameManager(this),
      new FPSCounter(this)
    ];
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
