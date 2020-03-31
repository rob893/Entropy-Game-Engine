export interface Renderable {
    enabled: boolean;
    render(context: CanvasRenderingContext2D): void;
}
