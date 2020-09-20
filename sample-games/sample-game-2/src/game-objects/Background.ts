import {
  Component,
  GameObject,
  GameObjectConstructionParams,
  Layer,
  PrefabSettings,
  RenderableBackground
} from '@entropy-engine/entropy-game-engine';
import { ScrollingBackground } from '../components/ScrollingBackground';

export class Background extends GameObject implements RenderableBackground {
  private scrollingBackground?: ScrollingBackground;

  public renderBackground(context: CanvasRenderingContext2D): void {
    if (!this.scrollingBackground) {
      throw new Error('scrollingBackground reference has not been set.');
    }

    this.scrollingBackground.renderBackground(context);
  }

  protected getPrefabSettings(): PrefabSettings {
    return {
      x: 0,
      y: 0,
      rotation: 0,
      id: 'background',
      tag: 'background',
      layer: Layer.Default
    };
  }
  protected buildInitialComponents(_config: GameObjectConstructionParams): Component[] {
    const backgroundImage = this.assetPool.getAsset<HTMLImageElement>('backgroundImage');

    const scrollingBackground = new ScrollingBackground(this, backgroundImage);

    this.scrollingBackground = scrollingBackground;

    return [scrollingBackground];
  }
}
