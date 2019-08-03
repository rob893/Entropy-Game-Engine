import { TerrainCell } from './TerrainCell';

export interface TerrainSpec {
    spriteSheetUrl: string;
    scale: number;
    cellSize: number;
    getSpec(): TerrainCell[][];
}