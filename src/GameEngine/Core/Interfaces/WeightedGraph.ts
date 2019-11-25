import { WeightedGraphCell, GraphCell } from './WeightedGraphCell';
import { Vector2 } from '../Helpers/Vector2';

export interface Graph<T extends GraphCell = GraphCell> {
    cellSize: number;
    graphCells: T[];
}

export interface WeightedGraph<T extends WeightedGraphCell = WeightedGraphCell> extends Graph<T> {
    isUnpassable(position: Vector2): boolean;
    cost(a: Vector2, b: Vector2): number;
    neighbors(id: Vector2): Iterable<T>;
    addCell(cell: T): void;
}