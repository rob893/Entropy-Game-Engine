import { Component, FPSCounter, GameObject, IPrefabSettings, Layer } from '@entropy-engine/entropy-game-engine';
import { GameManager } from '../components/GameManager';
import { MouseManager } from '../components/MouseManager';

export class GameManagerObject extends GameObject {
  protected buildInitialComponents(): Component[] {
    return [
      // new WeightedGraphVisualizer(this, this.terrain.navGrid),
      new GameManager(this),
      new FPSCounter(this),
      new MouseManager(this)
    ];
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
