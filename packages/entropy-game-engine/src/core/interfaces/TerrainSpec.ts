import { TerrainCell } from './TerrainCell';

export interface TerrainSpec {
  height: number;
  width: number;
  spriteSheetUrl: string;
  scale: number;
  cellSize: number;
  getSpec(): (TerrainCell | null)[][];
}
