import { GameObject, Component, RectangleRenderer, PrefabSettings, Layer } from '@entropy-engine/entropy-game-engine';

export class Weapon extends GameObject {
  protected buildInitialComponents(): Component[] {
    return [new RectangleRenderer(this, 15, 10, 'white')];
  }

  protected getPrefabSettings(): PrefabSettings {
    return {
      x: 0,
      y: 0,
      rotation: 0,
      id: 'weapon',
      tag: '',
      layer: Layer.Default
    };
  }
}
