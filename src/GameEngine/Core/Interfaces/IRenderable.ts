export interface IRenderable {
    render(context: CanvasRenderingContext2D): void;
    enabled: boolean;
}