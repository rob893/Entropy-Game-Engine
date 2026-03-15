import type { IWeightedGraphCell } from '../../types';
import { NavGrid } from '../NavGrid';
import { Vector2 } from '../Vector2';

type TestCell = IWeightedGraphCell;

const createCell = (x: number, y: number, weight: number, passable: boolean = true): TestCell => ({
  position: new Vector2(x, y),
  weight,
  passable
});

test('NavGrid addCell adds a cell that can be retrieved with getCell', (): void => {
  const grid = new NavGrid<TestCell>(10);
  const cell = createCell(10, 20, 3);

  grid.addCell(cell);

  expect(grid.getCell(10, 20)).toBe(cell);
});

test('NavGrid neighbors returns four-directional adjacent cells', (): void => {
  const grid = new NavGrid<TestCell>(10);
  const center = createCell(10, 10, 1);
  const up = createCell(10, 0, 1);
  const right = createCell(20, 10, 1);
  const down = createCell(10, 20, 1);
  const left = createCell(0, 10, 1);
  const diagonal = createCell(20, 20, 1);

  [center, up, right, down, left, diagonal].forEach((cell): void => {
    grid.addCell(cell);
  });

  const neighbors = Array.from(grid.neighbors(center.position));

  expect(neighbors).toEqual([up, right, down, left]);
  expect(neighbors).not.toContain(diagonal);
});

test('NavGrid cost returns the weight of the destination cell', (): void => {
  const grid = new NavGrid<TestCell>(10);
  const start = createCell(0, 0, 1);
  const destination = createCell(10, 0, 7);

  grid.addCell(start);
  grid.addCell(destination);

  expect(grid.cost(start.position, destination.position)).toBe(7);
});

test('NavGrid isUnpassable returns true for zero-weight cells marked as unpassable', (): void => {
  const grid = new NavGrid<TestCell>(10);
  const blockedCell = createCell(10, 10, 0, false);

  grid.addCell(blockedCell);

  expect(grid.isUnpassable(blockedCell.position)).toBe(true);
});

test('NavGrid graphCells returns all added cells', (): void => {
  const grid = new NavGrid<TestCell>(10);
  const firstCell = createCell(0, 0, 1);
  const secondCell = createCell(10, 0, 2);
  const thirdCell = createCell(20, 0, 3);

  grid.addCell(firstCell);
  grid.addCell(secondCell);
  grid.addCell(thirdCell);

  expect(grid.graphCells).toEqual([firstCell, secondCell, thirdCell]);
});

test('NavGrid cellSize is set correctly', (): void => {
  const grid = new NavGrid<TestCell>(16);

  expect(grid.cellSize).toBe(16);
});
