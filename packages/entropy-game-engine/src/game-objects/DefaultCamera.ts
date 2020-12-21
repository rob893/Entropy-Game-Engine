import { Camera } from '../components/Camera';
import { Component } from '../components/Component';
import { PrefabSettings, GameObjectConstructionParams, Layer } from '../core';
import { GameObject } from './GameObject';

export class DefaultCamera extends GameObject {
  protected buildInitialComponents(_config: GameObjectConstructionParams): Component[] {
    return [new Camera(this)];
  }

  protected getPrefabSettings(): PrefabSettings {
    return {
      x: 0,
      y: 0,
      rotation: 0,
      id: 'mainCamera',
      tag: 'mainCamera',
      layer: Layer.Default
    };
  }
}
