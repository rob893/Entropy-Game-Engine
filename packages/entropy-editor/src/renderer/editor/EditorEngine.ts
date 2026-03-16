import type { Camera, GameEngine, ITerrainSpec, Vector2 } from '@entropy-engine/entropy-game-engine';

export class EditorEngine {
  private readonly gameEngine: GameEngine;

  private camera: Camera | null = null;

  private isPanning: boolean = false;

  private lastMouseX: number = 0;

  private lastMouseY: number = 0;

  public constructor(gameEngine: GameEngine) {
    this.gameEngine = gameEngine;
  }

  public get canvas(): HTMLCanvasElement {
    return this.gameEngine.gameCanvas;
  }

  public get paused(): boolean {
    return this.gameEngine.paused;
  }

  public render(): void {
    this.gameEngine.renderFrame();
  }

  public async loadTerrain(terrainSpec: ITerrainSpec): Promise<void> {
    await this.gameEngine.updateTerrain(terrainSpec);
    this.render();
  }

  public setCamera(camera: Camera): void {
    this.camera = camera;
  }

  public screenToWorld(screenX: number, screenY: number): Vector2 | null {
    if (this.camera === null) {
      return null;
    }

    return this.camera.screenToWorld(screenX, screenY);
  }

  public screenToGrid(
    screenX: number,
    screenY: number,
    tileWidth: number,
    tileHeight: number
  ): { row: number; col: number } | null {
    const worldPos = this.screenToWorld(screenX, screenY);

    if (worldPos === null) {
      return null;
    }

    return {
      row: Math.floor(worldPos.y / tileHeight),
      col: Math.floor(worldPos.x / tileWidth)
    };
  }

  public startPan(mouseX: number, mouseY: number): void {
    this.isPanning = true;
    this.lastMouseX = mouseX;
    this.lastMouseY = mouseY;
  }

  public updatePan(mouseX: number, mouseY: number): void {
    if (!this.isPanning || this.camera === null) {
      return;
    }

    const dx = mouseX - this.lastMouseX;
    const dy = mouseY - this.lastMouseY;

    const zoom = this.camera.zoom;
    const currentPos = this.camera.gameObject.transform.position;

    this.camera.gameObject.transform.setPosition(currentPos.x - dx / zoom, currentPos.y - dy / zoom);

    this.lastMouseX = mouseX;
    this.lastMouseY = mouseY;

    this.render();
  }

  public endPan(): void {
    this.isPanning = false;
  }

  public zoom(delta: number): void {
    if (this.camera === null) {
      return;
    }

    const currentZoom = this.camera.zoom;
    const newZoom = Math.max(0.1, Math.min(5, currentZoom + delta * -0.001));
    this.camera.zoom = newZoom;

    this.render();
  }

  public pause(): void {
    this.gameEngine.paused = true;
  }
}
