import { WeightedGraphCell } from './WeightedGraphCell';
import { Vector2 } from '../Helpers/Vector2';

export interface WeightedGraph<T extends WeightedGraphCell> {
    cellSize: number;
    isUnpassable(position: Vector2): boolean;
    cost(a: Vector2, b: Vector2): number;
    neighbors(id: Vector2): Iterable<T>;
    addCell(cell: T): void;
}