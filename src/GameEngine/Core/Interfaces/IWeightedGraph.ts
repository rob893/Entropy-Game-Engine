import { IWeightedGraphCell } from "./IWeightedGraphCell";
import { Vector2 } from "../Helpers/Vector2";

export interface IWeightedGraph<T extends IWeightedGraphCell> {
    cellSize: number;
    cost(a: Vector2, b: Vector2): number;
    neighbors(id: Vector2): Iterable<T>;
    addCell(cell: T): void;
}