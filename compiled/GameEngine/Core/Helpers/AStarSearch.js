import { Vector2 } from "./Vector2";
import { PriorityQueue } from "./PriorityQueue";
export class AStarSearch {
    constructor(graph, start, goal) {
        this.cameFrom = new Map();
        this.costSoFar = new Map();
        const frontier = new PriorityQueue();
        frontier.enqueue(start, 0);
        this.cameFrom.set(start.toString(), start.toString());
        this.costSoFar.set(start.toString(), 0);
        while (frontier.count > 0) {
            const current = frontier.dequeue();
            if (current.equals(goal)) {
                break;
            }
            for (let next in graph.neighbors(current)) {
                const newCost = this.costSoFar.get(current.toString()) + graph.cost(current, Vector2.fromString(next));
                if (!this.costSoFar.has(next) || newCost < this.costSoFar.get(next)) {
                    this.costSoFar.set(next, newCost);
                    const priority = newCost + this.heuristic(Vector2.fromString(next), goal);
                    frontier.enqueue(Vector2.fromString(next), priority);
                    this.cameFrom.set(next, current.toString());
                }
            }
        }
    }
    heuristic(a, b) {
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    }
}
//# sourceMappingURL=AStarSearch.js.map