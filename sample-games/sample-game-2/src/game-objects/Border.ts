import {
  GameObject,
  GameObjectConstructionParams,
  Component,
  RectangleCollider,
  PrefabSettings,
  Layer,
  ImageRenderer
} from '@entropy-engine/entropy-game-engine';
import { Scroller } from '../components/Scroller';
import { Destroyer } from '../components/Destroyer';

export class Border extends GameObject {
  protected buildInitialComponents({
    gameEngine: {
      gameCanvas: { width }
    }
  }: GameObjectConstructionParams): Component[] {
    const collider = new RectangleCollider(this, null, 20, 200);

    const brickImage = this.assetPool.getAsset<HTMLImageElement>('brickImage');
    const imageRenderer = new ImageRenderer(this, 20, 200, brickImage);

    const scroller = new Scroller(this, -10);
    const destroyer = new Destroyer(this, [
      ({
        transform: {
          position: { x }
        }
      }) => x < -20 || x > width + 20
    ]);

    return [collider, imageRenderer, scroller, destroyer];
  }

  protected getPrefabSettings(): PrefabSettings {
    return {
      x: 200,
      y: 200,
      rotation: 0,
      id: 'border',
      tag: 'border',
      layer: Layer.Terrain
    };
  }
}
