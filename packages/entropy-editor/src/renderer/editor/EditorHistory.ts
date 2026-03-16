import type { ITerrainLayer, ITerrainSpec } from '@entropy-engine/entropy-game-engine';

export interface IEditorCommand {
  execute(): void;
  undo(): void;
}

interface IGridLayer {
  grid: number[][];
}

export class EditorHistory {
  private readonly undoStack: IEditorCommand[] = [];

  private readonly redoStack: IEditorCommand[] = [];

  private readonly maxHistory: number;

  public constructor(maxHistory: number = 100) {
    this.maxHistory = maxHistory;
  }

  public get canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  public get canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  public execute(command: IEditorCommand): void {
    command.execute();
    this.undoStack.push(command);
    this.redoStack.length = 0;

    if (this.undoStack.length > this.maxHistory) {
      this.undoStack.shift();
    }
  }

  public undo(): void {
    const command = this.undoStack.pop();

    if (command === undefined) {
      return;
    }

    command.undo();
    this.redoStack.push(command);
  }

  public redo(): void {
    const command = this.redoStack.pop();

    if (command === undefined) {
      return;
    }

    command.execute();
    this.undoStack.push(command);
  }

  public clear(): void {
    this.undoStack.length = 0;
    this.redoStack.length = 0;
  }
}

export class PaintCellCommand implements IEditorCommand {
  private readonly layer: IGridLayer;

  private readonly row: number;

  private readonly col: number;

  private readonly newTileId: number;

  private readonly previousTileId: number;

  public constructor(layer: IGridLayer, row: number, col: number, newTileId: number) {
    this.layer = layer;
    this.row = row;
    this.col = col;
    this.newTileId = newTileId;
    this.previousTileId = layer.grid[row][col];
  }

  public execute(): void {
    this.layer.grid[this.row][this.col] = this.newTileId;
  }

  public undo(): void {
    this.layer.grid[this.row][this.col] = this.previousTileId;
  }
}

export function convertEditorLayerToEngineSpec(
  layers: ITerrainLayer[],
  tileWidth: number,
  tileHeight: number
): ITerrainSpec {
  return {
    tileWidth,
    tileHeight,
    layers
  };
}
