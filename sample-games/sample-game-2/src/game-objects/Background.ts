import {
  Component,
  GameObject,
  Layer,
  IPrefabSettings,
  IRenderableBackground
} from '@entropy-engine/entropy-game-engine';
import { ScrollingBackground } from '../components/ScrollingBackground';

export class Background extends GameObject implements IRenderableBackground {
  private scrollingBackground?: ScrollingBackground;

  public renderBackground(context: CanvasRenderingContext2D): void {
    if (!this.scrollingBackground) {
      throw new Error('scrollingBackground reference has not been set.');
    }

    this.scrollingBackground.renderBackground(context);
  }

  protected getPrefabSettings(): IPrefabSettings {
    return {
      x: 0,
      y: 0,
      rotation: 0,
      name: 'background',
      tag: 'background',
      layer: Layer.Default
    };
  }
  protected buildInitialComponents(): Component[] {
    const backgroundImage = this.assetPool.getAsset<HTMLImageElement>('backgroundImage');

    const scrollingBackground = new ScrollingBackground(this, backgroundImage);

    this.scrollingBackground = scrollingBackground;

    return [scrollingBackground];
  }
}
