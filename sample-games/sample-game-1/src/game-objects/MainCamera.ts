import { Camera, Component, GameObject, IPrefabSettings, Layer } from '@entropy-engine/entropy-game-engine';

export class MainCamera extends GameObject {
  protected buildInitialComponents(): Component[] {
    return [new Camera(this)];
  }

  protected getPrefabSettings(): IPrefabSettings {
    return {
      x: 0,
      y: 0,
      rotation: 0,
      name: 'mainCamera',
      tag: 'mainCamera',
      layer: Layer.Default
    };
  }
}
