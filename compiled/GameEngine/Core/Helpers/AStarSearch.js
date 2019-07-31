import { Vector2 } from "./Vector2";
import { PriorityQueue } from "./PriorityQueue";
export class AStarSearch {
    static findPath(graph, start, goal) {
        if (graph.isUnpassable(goal)) {
            return null;
        }
        const cameFrom = new Map();
        const costSoFar = new Map();
        const frontier = new PriorityQueue();
        const originalGoal = new Vector2(goal.x, goal.y);
        start = new Vector2(start.x, start.y);
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
    static normalizePosition(pos, cellSize) {
        const x = cellSize * Math.round(pos.x / cellSize);
        const y = cellSize * Math.round(pos.y / cellSize);
        return new Vector2(x, y);
    }
    static heuristic(a, b) {
        return Vector2.distanceSqrd(a, b);
    }
    static constructPath(cameFrom, current, start, goal) {
        const path = [current];
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
//# sourceMappingURL=AStarSearch.js.map