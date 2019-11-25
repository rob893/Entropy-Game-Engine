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
            if (x === 1 && y === 1) {
                graph.addCell({ passable: true, weight: 9, position: new Vector2(x, y) });
                graphVisual += '9 ';
                continue;
            }
            if (x === 4 && y < 7 && y > 2) {
                graph.addCell({ passable: false, weight: 0, position: new Vector2(x, y) });
                graphVisual += 'X ';
            }
            else {
                graph.addCell({ passable: true, weight: 0, position: new Vector2(x, y) });
                graphVisual += '0 ';
            }
        }
        graphVisual += '\n';
    }
    //console.log(graphVisual);

    //Straight line path
    let path = AStarSearch.findPath(graph, new Vector2(0, 0), new Vector2(2, 0));

    if (path === null) {
        throw new Error('Path is null');
    }
    
    expect(path.length).toBe(3);
    expect(path[0]).toEqual(new Vector2(0, 0));
    expect(path[1]).toEqual(new Vector2(1, 0));
    expect(path[2]).toEqual(new Vector2(2, 0));

    //Path considering weight. 1, 1 has a heavy weight. This path should go around it
    path = AStarSearch.findPath(graph, new Vector2(0, 1), new Vector2(2, 1));

    if (path === null) {
        throw new Error('Path is null');
    }
    
    expect(path.length).toBe(4);
    expect(path[0]).toEqual(new Vector2(0, 1));
    expect(path[1]).toEqual(new Vector2(0, 0));
    expect(path[2]).toEqual(new Vector2(1, 0));
    expect(path[3]).toEqual(new Vector2(2, 1));

    //No path. goal is in a wall.
    path = AStarSearch.findPath(graph, new Vector2(0, 4), new Vector2(4, 4));

    expect(path).toBe(null);

    //Path goes up and around wall
    path = AStarSearch.findPath(graph, new Vector2(0, 4), new Vector2(6, 4));

    if (path === null) {
        throw new Error('Path is null');
    }

    expect(path).not.toBe(null);
    expect(path.length).toBe(10);
    expect(path[0]).toEqual(new Vector2(0, 4));
    expect(path[1]).toEqual(new Vector2(1, 4));
    expect(path[2]).toEqual(new Vector2(2, 4));
    expect(path[3]).toEqual(new Vector2(3, 4));
    expect(path[4]).toEqual(new Vector2(3, 3));
    expect(path[5]).toEqual(new Vector2(3, 2));
    expect(path[6]).toEqual(new Vector2(4, 2));
    expect(path[7]).toEqual(new Vector2(5, 2));
    expect(path[8]).toEqual(new Vector2(5, 3));
    expect(path[9]).toEqual(new Vector2(6, 4));

    //Path goes down and around wall
    path = AStarSearch.findPath(graph, new Vector2(0, 5), new Vector2(6, 5));

    if (path === null) {
        throw new Error('Path is null');
    }

    expect(path).not.toBe(null);
    expect(path.length).toBe(10);
    expect(path[0]).toEqual(new Vector2(0, 5));
    expect(path[1]).toEqual(new Vector2(1, 5));
    expect(path[2]).toEqual(new Vector2(2, 5));
    expect(path[3]).toEqual(new Vector2(3, 5));
    expect(path[4]).toEqual(new Vector2(3, 6));
    expect(path[5]).toEqual(new Vector2(3, 7));
    expect(path[6]).toEqual(new Vector2(4, 7));
    expect(path[7]).toEqual(new Vector2(5, 7));
    expect(path[8]).toEqual(new Vector2(5, 6));
    expect(path[9]).toEqual(new Vector2(6, 5));
});