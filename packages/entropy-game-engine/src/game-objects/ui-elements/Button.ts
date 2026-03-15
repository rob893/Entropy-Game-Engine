import { ClickedOnDetector } from '../../components/ClickedOnDetector';
import type { Component } from '../../components/Component';
import { RectangleCollider } from '../../components/RectangleCollider';
import { RectangleRenderer } from '../../components/RectangleRenderer';
import { TextRenderer } from '../../components/TextRenderer';
import { Color } from '../../core/enums/Color';
import { Layer } from '../../core/enums/Layer';
import type { IPrefabSettings } from '../../core/types';
import type { IGameObjectConstructionParams } from '../../core/types';
import { GameObject } from '../GameObject';

type ButtonConfig = IGameObjectConstructionParams & { height?: number; width?: number };

export class Button extends GameObject<ButtonConfig> {
  public height: number;

  public width: number;

  public constructor(config: ButtonConfig) {
    super(config);

    this.height = config.height || 50;
    this.width = config.width || 50;
  }

  protected buildInitialComponents(config: ButtonConfig): Component[] {
    const w = config.width || 50;
    const h = config.height || 50;

    const collider = new RectangleCollider(this, null, w, h);

    const renderer = new RectangleRenderer(this, w, h, Color.Grey);

    const clickedOnDetector = new ClickedOnDetector(this, collider);

    const textRenderer = new TextRenderer(this, {
      fontColor: Color.Amber,
      text: 'Button',
      y: this.transform.position.y - h / 2
    });
    textRenderer.x = this.transform.position.x - textRenderer.getTextWidth(this.gameCanvasContext) / 2;

    this.transform.onMoved.subscribe(() => {
      textRenderer.x = this.transform.position.x - textRenderer.getTextWidth(this.gameCanvasContext) / 2;
      textRenderer.y = this.transform.position.y - h / 2;
    });

    return [renderer, collider, clickedOnDetector, textRenderer];
  }

  protected getPrefabSettings(): IPrefabSettings {
    return {
      x: 0,
      y: 0,
      rotation: 0,
      name: 'button',
      tag: 'ui',
      layer: Layer.UI
    };
  }
}
