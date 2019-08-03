export interface RenderableGUI {
    enabled: boolean;
    renderGUI(context: CanvasRenderingContext2D): void;
}