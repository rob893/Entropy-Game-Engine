import { Vector2 } from "../Vector2";

export interface IWeightedGraph {
    cost(a: Vector2, b: Vector2): number;
    neighbors(id: Vector2): Iterable<string>;
}