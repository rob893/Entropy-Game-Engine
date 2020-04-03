export interface RenderableGizmo {
    enabled: boolean;
    renderGizmo(context: CanvasRenderingContext2D): void;
}
