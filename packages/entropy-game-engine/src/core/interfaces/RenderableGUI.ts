export interface RenderableGUI {
  enabled: boolean;
  zIndex: number;
  renderGUI(context: CanvasRenderingContext2D): void;
}
