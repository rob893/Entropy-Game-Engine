import { WeightedGraphCell } from './WeightedGraphCell';
import { Vector2 } from '../Helpers/Vector2';
import { Graph } from './Graph';

export interface WeightedGraph<T extends WeightedGraphCell = WeightedGraphCell> extends Graph<T> {
  isUnpassable(position: Vector2): boolean;
  cost(a: Vector2, b: Vector2): number;
}
