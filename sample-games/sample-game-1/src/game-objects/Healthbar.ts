import { Color, Component, GameObject, Layer, PrefabSettings, Slider } from '@entropy-engine/entropy-game-engine';

export class Healthbar extends GameObject {
  protected buildInitialComponents(): Component[] {
    return [new Slider(this, 46, 8, Color.Green, Color.Red)];
  }

  protected getPrefabSettings(): PrefabSettings {
    return {
      x: 0,
      y: 0,
      rotation: 0,
      id: 'healthbar',
      tag: 'healthbar',
      layer: Layer.UI
    };
  }
}
