import type { Color } from '../core/enums/Color';

export interface IRectangleRendererOptions {
  renderWidth: number;
  renderHeight: number;
  fillColor?: Color;
  borderColor?: Color;
}

export interface ITextRendererParams {
  fontSize?: number;
  fontFamily?: string;
  fontColor?: Color;
  text?: string;
  x?: number;
  y?: number;
}
