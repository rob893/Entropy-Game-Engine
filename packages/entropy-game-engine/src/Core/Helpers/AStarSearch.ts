import { Vector2 } from './Vector2';
import { WeightedGraph } from '../Interfaces/WeightedGraph';
import { PriorityQueue } from './PriorityQueue';

export class AStarSearch {
    public static findPath(graph: WeightedGraph, start: Vector2, goal: Vector2): Vector2[] | null {
        if (graph.isUnpassable(goal)) {
            return null;
        }

        const cameFrom: Map<Vector2, Vector2> = new Map<Vector2, Vector2>();
        const costSoFar: Map<Vector2, number> = new Map<Vector2, number>();

        const frontier = new PriorityQueue<Vector2>();

        //set to new vectors to keep from referencing original vectors (as they are ref types)
        //We need a copy of both at this point in time as they are likely to move in the future
        goal = new Vector2(goal.x, goal.y);
        start = new Vector2(start.x, start.y);

        frontier.enqueue(start, 0);

        cameFrom.set(start, start);
        costSoFar.set(start, 0);

        while (frontier.count > 0) {
            const current = frontier.dequeue();

            if (current.isCloseTo(goal, graph.cellSize)) {
                return this.constructPath(cameFrom, current, start, goal);
            }

            for (const next of graph.neighbors(current)) {
                const currentCost = costSoFar.get(current);

                if (currentCost === undefined) {
                    throw new Error('Error in A*');
                }

                const newCost = currentCost + graph.cost(current, next.position);

                const nextCost = costSoFar.get(next.position);

                if (nextCost === undefined || newCost < nextCost) {
                    costSoFar.set(next.position, newCost);
                    const priority = newCost + this.heuristic(next.position, goal);
                    frontier.enqueue(next.position, priority);
                    cameFrom.set(next.position, current);
                }
            }
        }

        return null;
    }

    private static heuristic(a: Vector2, b: Vector2): number {
        return Vector2.distanceSqrd(a, b);
    }

    private static constructPath(
        cameFrom: Map<Vector2, Vector2>,
        current: Vector2,
        start: Vector2,
        goal: Vector2
    ): Vector2[] {
        const path: Vector2[] = [current];

        if (!current.equals(goal)) {
            path.unshift(goal);
        }

        while (cameFrom.has(current) && current !== start) {
            const next = cameFrom.get(current);

            if (next === undefined) {
                throw new Error('Error constructing A* path.');
            }

            current = next;
            path.push(current);
        }

        return path.reverse();
    }
}
