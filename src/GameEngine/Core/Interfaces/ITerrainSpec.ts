import { ITerrainCell } from "./ITerrainCell";

export interface ITerrainSpec {
    spriteSheetUrl: string;
    scale: number;
    cellSize: number;
    getSpec(): ITerrainCell[][];
}