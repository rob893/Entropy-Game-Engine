import { IMapCell } from "./IMapCell";

export interface ITerrainSpec {
    cellSize: number;
    getSpec(): IMapCell[][];
}