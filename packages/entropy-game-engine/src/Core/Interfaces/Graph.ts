import { GraphCell } from './GraphCell';
import { Vector2 } from '../Helpers/Vector2';

export interface Graph<T extends GraphCell = GraphCell> {
  cellSize: number;
  graphCells: T[];
  getCell(x: number, y: number): T;
  neighbors(id: Vector2): Iterable<T>;
  addCell(cell: T): void;
}
