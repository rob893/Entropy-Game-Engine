import {
  Component,
  GameObject,
  IGameObjectConstructionParams,
  ImageRenderer,
  Layer,
  IPrefabSettings,
  RectangleCollider
} from '@entropy-engine/entropy-game-engine';
import { Scroller } from '../components/Scroller';
import { Destroyer } from '../components/Destroyer';

export class Border extends GameObject {
  protected buildInitialComponents(_config: IGameObjectConstructionParams): Component[] {
    const collider = new RectangleCollider(this, null, 20, 200);

    const brickImage = this.assetPool.getAsset<HTMLImageElement>('brickImage');
    const imageRenderer = new ImageRenderer(this, 20, 200, brickImage);

    const scroller = new Scroller(this, -300);
    // const destroyer = new Destroyer(this, [
    //   ({
    //     transform: {
    //       position: { x }
    //     }
    //   }) => x < -20 || x > width + 20
    // ]);

    return [collider, imageRenderer, scroller];
  }

  protected getPrefabSettings(): IPrefabSettings {
    return {
      x: 200,
      y: 200,
      rotation: 0,
      name: 'border',
      tag: 'border',
      layer: Layer.Terrain
    };
  }
}
