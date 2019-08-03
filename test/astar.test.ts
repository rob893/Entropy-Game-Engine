import { AStarSearch } from '../src/GameEngine/Core/Helpers/AStarSearch';
import { NavGrid } from '../src/GameEngine/Core/Helpers/NavGrid';
import {toBeDeepCloseTo, toMatchCloseTo} from 'jest-matcher-deep-close-to';
import { Vector2 } from '../src/GameEngine/Core/Helpers/Vector2';

expect.extend({toBeDeepCloseTo, toMatchCloseTo});

test('Test the a star path finding', (): void => {
    const graph = new NavGrid(1);

    let graphVisual = '';
    for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
            if (x === 4 && y < 7 && y > 2) {
                graph.addCell({ passable: false, weight: 0, position: new Vector2(x, y) });
                graphVisual += 'X ';
            }
            else {
                graph.addCell({ passable: true, weight: 0, position: new Vector2(x, y) });
                graphVisual += '* ';
            }
        }
        graphVisual += '\n';
    }
    console.log(graphVisual);

    let path = AStarSearch.findPath(graph, new Vector2(1, 0), new Vector2(3, 0));

    expect(path.length).toBe(3);
    expect(path[0]).toEqual(new Vector2(1, 0));
    expect(path[1]).toEqual(new Vector2(2, 0));
    expect(path[2]).toEqual(new Vector2(3, 0));

    //No path. goal is in a wall.
    path = AStarSearch.findPath(graph, new Vector2(0, 4), new Vector2(4, 4));

    expect(path).toBe(null);

    path = AStarSearch.findPath(graph, new Vector2(0, 4), new Vector2(6, 4));

    expect(path).not.toBe(null);
    console.log(path);
});