export interface IRenderableGizmo  {
    renderGizmo(context: CanvasRenderingContext2D): void;
    enabled: boolean;
}