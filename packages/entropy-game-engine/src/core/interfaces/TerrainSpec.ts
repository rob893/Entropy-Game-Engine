import { TerrainCell } from './TerrainCell';

export interface TerrainSpec {
  spriteSheetUrl?: string;
  scale?: number;
  cellSize?: number;
  getSpec?(): (TerrainCell | null)[][];
  tileWidth?: number;
  tileHeight?: number;
  grid?: number[][];
  tileSet?: Record<number, string>;
}
