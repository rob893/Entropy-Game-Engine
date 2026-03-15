import {
  Color,
  Component,
  GameObject,
  Layer,
  IPrefabSettings,
  RectangleCollider,
  RectangleRenderer
} from '@entropy-engine/entropy-game-engine';

export class Ground extends GameObject {
  protected buildInitialComponents(): Component[] {
    return [new RectangleCollider(this, null, 20, 20), new RectangleRenderer(this, 20, 20, Color.Brown)];
  }

  protected getPrefabSettings(): IPrefabSettings {
    return {
      x: 0,
      y: 0,
      rotation: 0,
      name: 'ground',
      tag: 'ground',
      layer: Layer.Terrain
    };
  }
}
