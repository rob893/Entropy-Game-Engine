import { Vector2 } from "./Vector2";
import { IWeightedGraph } from "../Interfaces/IWeightedGraph";
import { PriorityQueue } from "./PriorityQueue";
import { IWeightedGraphCell } from "../Interfaces/IWeightedGraphCell";

export class AStarSearch {

    public readonly cameFrom: Map<Vector2, Vector2> = new Map<Vector2, Vector2>();
    public readonly costSoFar: Map<Vector2, number> = new Map<Vector2, number>();
    

    public constructor(graph: IWeightedGraph<IWeightedGraphCell>, start: Vector2, goal: Vector2) {
        const frontier = new PriorityQueue<Vector2>();

        start = this.normalizePosition(start, graph.cellSize);
        goal = this.normalizePosition(goal, graph.cellSize);

        frontier.enqueue(start, 0);

        this.cameFrom.set(start, start);
        this.costSoFar.set(start, 0);

        while (frontier.count > 0) {
            const current = frontier.dequeue();

            if (current.equals(goal)) {
                this.cameFrom.set(goal, goal);
                break;
            }

            for (let next of graph.neighbors(current)) {
                const newCost = this.costSoFar.get(current) + graph.cost(current, next.position);

                if (!this.costSoFar.has(next.position) || newCost < this.costSoFar.get(next.position)) {
                    this.costSoFar.set(next.position, newCost);
                    const priority = newCost + this.heuristic(next.position, goal);
                    frontier.enqueue(next.position, priority);
                    this.cameFrom.set(next.position, current);
                }
            }
        }
    }

    // public static aStar(graph: IWeightedGraph<IWeightedGraphCell>, start: Vector2, goal: Vector2): Vector2[] {
    //     const openSet = new PriorityQueue<Vector2>();
    //     const closedSet = new Set<Vector2>();

    //     openSet.enqueue(start);

    //     const cameFrom = new Map<Vector2, Vector2>();
    // }

    public getPath(): Vector2[] {
        return Array.from(this.cameFrom.values());
    }

    private heuristic(a: Vector2, b: Vector2): number {
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    }

    private normalizePosition(pos: Vector2, cellSize: number): Vector2 {
        const x = cellSize * Math.round(pos.x / cellSize);
        const y = cellSize * Math.round(pos.y / cellSize);

        return new Vector2(x, y);
    }
}