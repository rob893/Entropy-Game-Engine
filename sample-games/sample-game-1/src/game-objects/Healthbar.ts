import { Color, Component, GameObject, Layer, IPrefabSettings, Slider } from '@entropy-engine/entropy-game-engine';

export class Healthbar extends GameObject {
  protected buildInitialComponents(): Component[] {
    return [new Slider(this, 46, 8, Color.Green, Color.Red)];
  }

  protected getPrefabSettings(): IPrefabSettings {
    return {
      x: 0,
      y: 0,
      rotation: 0,
      name: 'healthbar',
      tag: 'healthbar',
      layer: Layer.UI
    };
  }
}
