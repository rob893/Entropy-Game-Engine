import { Vector2 } from "../Helpers/Vector2";
import { IMapCell } from "./IMapCell";

export interface IWeightedGraph {
    cost(a: Vector2, b: Vector2): number;
    neighbors(id: Vector2): Iterable<string>;
    addCell(cell: IMapCell, x: number, y: number): void;
}