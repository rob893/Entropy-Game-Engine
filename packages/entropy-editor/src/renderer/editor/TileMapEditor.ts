import type { IEditorLayer } from '../../shared/types';
import type { EditorEngine } from './EditorEngine';
import type { EditorHistory } from './EditorHistory';
import { PaintCellCommand } from './EditorHistory';

export type EditorToolType = 'brush' | 'eraser' | 'fill' | 'eyedropper' | 'select';

export class TileMapEditor {
  private readonly editorEngine: EditorEngine;

  private readonly history: EditorHistory;

  private activeTool: EditorToolType = 'brush';

  private activeTileId: number = 1;

  private isPainting: boolean = false;

  private onTileSelected: ((tileId: number) => void) | null = null;

  private onMapChanged: (() => void) | null = null;

  public constructor(editorEngine: EditorEngine, history: EditorHistory) {
    this.editorEngine = editorEngine;
    this.history = history;
  }

  public setActiveTool(tool: EditorToolType): void {
    this.activeTool = tool;
  }

  public setActiveTileId(tileId: number): void {
    this.activeTileId = tileId;
  }

  public setOnTileSelected(callback: (tileId: number) => void): void {
    this.onTileSelected = callback;
  }

  public setOnMapChanged(callback: () => void): void {
    this.onMapChanged = callback;
  }

  public handleMouseDown(row: number, col: number, layer: IEditorLayer, button: number): void {
    if (button === 1) {
      return; // Middle button handled by EditorEngine pan
    }

    if (button === 2) {
      this.togglePassability(row, col, layer);
      return;
    }

    this.isPainting = true;
    this.applyTool(row, col, layer);
  }

  public handleMouseMove(row: number, col: number, layer: IEditorLayer): void {
    if (!this.isPainting) {
      return;
    }

    if (this.activeTool === 'brush' || this.activeTool === 'eraser') {
      this.applyTool(row, col, layer);
    }
  }

  public handleMouseUp(): void {
    this.isPainting = false;
  }

  private applyTool(row: number, col: number, layer: IEditorLayer): void {
    if (row < 0 || row >= layer.grid.length || col < 0 || col >= layer.grid[0].length) {
      return;
    }

    switch (this.activeTool) {
      case 'brush':
        this.paint(row, col, layer, this.activeTileId);
        break;
      case 'eraser':
        this.paint(row, col, layer, 0);
        break;
      case 'fill':
        this.floodFill(row, col, layer, this.activeTileId);
        break;
      case 'eyedropper':
        this.eyedrop(row, col, layer);
        break;
      case 'select':
        break;
    }
  }

  private paint(row: number, col: number, layer: IEditorLayer, tileId: number): void {
    if (layer.grid[row][col] === tileId) {
      return;
    }

    const command = new PaintCellCommand(layer, row, col, tileId);
    this.history.execute(command);
    this.onMapChanged?.();
  }

  private floodFill(startRow: number, startCol: number, layer: IEditorLayer, tileId: number): void {
    const targetId = layer.grid[startRow][startCol];

    if (targetId === tileId) {
      return;
    }

    const rows = layer.grid.length;
    const cols = layer.grid[0].length;
    const visited = new Set<string>();
    const queue: Array<[number, number]> = [[startRow, startCol]];

    while (queue.length > 0) {
      const current = queue.shift();

      if (current === undefined) {
        break;
      }

      const [r, c] = current;
      const key = `${r},${c}`;

      if (visited.has(key)) {
        continue;
      }

      if (r < 0 || r >= rows || c < 0 || c >= cols) {
        continue;
      }

      if (layer.grid[r][c] !== targetId) {
        continue;
      }

      visited.add(key);

      const command = new PaintCellCommand(layer, r, c, tileId);
      this.history.execute(command);

      queue.push([r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]);
    }

    this.onMapChanged?.();
  }

  private eyedrop(row: number, col: number, layer: IEditorLayer): void {
    const tileId = layer.grid[row][col];

    if (tileId !== 0) {
      this.activeTileId = tileId;
      this.onTileSelected?.(tileId);
    }
  }

  private togglePassability(row: number, col: number, layer: IEditorLayer): void {
    if (layer.passability === undefined) {
      layer.passability = Array.from({ length: layer.grid.length }, () =>
        new Array<boolean>(layer.grid[0].length).fill(true)
      );
    }

    if (row >= 0 && row < layer.passability.length && col >= 0 && col < layer.passability[0].length) {
      layer.passability[row][col] = !layer.passability[row][col];
      this.onMapChanged?.();
    }
  }
}
