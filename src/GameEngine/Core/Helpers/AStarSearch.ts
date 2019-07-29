import { Vector2 } from "./Vector2";
import { IWeightedGraph } from "../Interfaces/IWeightedGraph";
import { PriorityQueue } from "./PriorityQueue";
import { IWeightedGraphCell } from "../Interfaces/IWeightedGraphCell";

export class AStarSearch {

    public static findPath(graph: IWeightedGraph<IWeightedGraphCell>, start: Vector2, goal: Vector2): Vector2[] | null {
        const cameFrom: Map<Vector2, Vector2> = new Map<Vector2, Vector2>();
        const costSoFar: Map<Vector2, number> = new Map<Vector2, number>();

        const frontier = new PriorityQueue<Vector2>();
        const originalGoal = goal;

        goal = this.normalizePosition(goal, graph.cellSize);

        frontier.enqueue(start, 0);

        cameFrom.set(start, start);
        costSoFar.set(start, 0);

        while (frontier.count > 0) {
            const current = frontier.dequeue();

            if (current.equals(goal)) {
                return this.constructPath(cameFrom, current, start, originalGoal);
            }

            for (let next of graph.neighbors(current)) {
                const newCost = costSoFar.get(current) + graph.cost(current, next.position);

                if (!costSoFar.has(next.position) || newCost < costSoFar.get(next.position)) {
                    costSoFar.set(next.position, newCost);
                    const priority = newCost + this.heuristic(next.position, goal);
                    frontier.enqueue(next.position, priority);
                    cameFrom.set(next.position, current);
                }
            }
        }

        return null;
    }

    private static normalizePosition(pos: Vector2, cellSize: number): Vector2 {
        const x = cellSize * Math.round(pos.x / cellSize);
        const y = cellSize * Math.round(pos.y / cellSize);

        return new Vector2(x, y);
    }

    private static heuristic(a: Vector2, b: Vector2): number {
        return Vector2.distanceSqrd(a, b);
    }

    private static constructPath(cameFrom: Map<Vector2, Vector2>, current: Vector2, start: Vector2, goal: Vector2): Vector2[] {
        const path: Vector2[] = [current];

        if (!current.equals(goal)) {
            path.unshift(goal);
        }

        while (cameFrom.has(current) && current !== start) {
            current = cameFrom.get(current);
            path.push(current);
        }

        return path.reverse();
    }
}