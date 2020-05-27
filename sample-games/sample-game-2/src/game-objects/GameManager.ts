import {
  GameObject,
  GameObjectConstructionParams,
  Component,
  PrefabSettings,
  Layer
} from '@entropy-engine/entropy-game-engine';
import { BorderManager } from '../components/BorderManager';

export class GameManager extends GameObject {
  protected buildInitialComponents(_config: GameObjectConstructionParams): Component[] {
    const borderManager = new BorderManager(this);

    return [borderManager];
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
