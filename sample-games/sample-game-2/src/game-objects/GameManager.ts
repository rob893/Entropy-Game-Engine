import {
  GameObject,
  GameObjectConstructionParams,
  Component,
  PrefabSettings,
  Layer,
  FPSCounter
} from '@entropy-engine/entropy-game-engine';
import { BorderManager } from '../components/BorderManager';
import { ScoreManager } from '../components/ScoreManager';
import { MissileSpawner } from '../components/MissileSpawner';

export class GameManager extends GameObject {
  protected buildInitialComponents(_config: GameObjectConstructionParams): Component[] {
    const scoreManager = new ScoreManager(this);
    const borderManager = new BorderManager(this, scoreManager);
    const missileSpawner = new MissileSpawner(this, borderManager, scoreManager);
    const fpsCounter = new FPSCounter(this);

    return [borderManager, missileSpawner, fpsCounter, scoreManager];
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
