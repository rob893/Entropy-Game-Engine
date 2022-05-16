import { Vector2 } from './Vector2';
import { WeightedGraph } from '../interfaces/WeightedGraph';
import { PriorityQueue } from './PriorityQueue';

export class AStarSearch {
  public static findPath(graph: WeightedGraph, start: Vector2, goal: Vector2): Vector2[] | null {
    if (graph.isUnpassable(goal)) {
      return null;
    }

    const cameFrom: Map<Vector2, Vector2> = new Map<Vector2, Vector2>();
    const gScore: Map<Vector2, number> = new Map<Vector2, number>();

    const frontier = new PriorityQueue<Vector2>();

    //set to new vectors to keep from referencing original vectors (as they are ref types)
    //We need a copy of both at this point in time as they are likely to move in the future
    goal = goal.clone();
    start = start.clone();

    gScore.set(start, 0);

    frontier.enqueue(start, 0);

    while (frontier.count > 0) {
      const current = frontier.dequeue();

      if (current.isCloseTo(goal, graph.cellSize)) {
        return this.constructPath(cameFrom, current, start, goal);
      }

      for (const next of graph.neighbors(current)) {
        const tentativeGScore = 1 + (gScore.get(current) ?? 0);

        if (tentativeGScore < (gScore.get(next.position) ?? Number.MAX_SAFE_INTEGER)) {
          gScore.set(next.position, tentativeGScore);
          const fScore = tentativeGScore + this.heuristic(next.position, goal);
          frontier.enqueue(next.position, fScore);
          cameFrom.set(next.position, current);
        }
      }
    }

    return null;
  }

  private static heuristic(a: Vector2, b: Vector2): number {
    return Vector2.manhattanDistance(a, b);
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
