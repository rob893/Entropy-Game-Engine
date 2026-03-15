import { Component, GameObject, Layer, IPrefabSettings, RectangleRenderer } from '@entropy-engine/entropy-game-engine';

export class Weapon extends GameObject {
  protected buildInitialComponents(): Component[] {
    return [new RectangleRenderer(this, 15, 10, 'white')];
  }

  protected getPrefabSettings(): IPrefabSettings {
    return {
      x: 0,
      y: 0,
      rotation: 0,
      name: 'weapon',
      tag: '',
      layer: Layer.Default
    };
  }
}
