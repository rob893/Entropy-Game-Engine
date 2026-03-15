import { Utilities } from '../Utilities';

describe('Utilities.removeItemFromArray', () => {
  it('removes the item and returns true', () => {
    const values = [1, 2, 3];

    const wasRemoved = Utilities.removeItemFromArray(values, 2);

    expect(wasRemoved).toBe(true);
    expect(values).toEqual([1, 3]);
  });

  it('returns false when the item is not found', () => {
    const values = [1, 2, 3];

    const wasRemoved = Utilities.removeItemFromArray(values, 4);

    expect(wasRemoved).toBe(false);
    expect(values).toEqual([1, 2, 3]);
  });

  it('mutates the original array', () => {
    const values = ['a', 'b', 'c'];
    const originalReference = values;

    Utilities.removeItemFromArray(values, 'b');

    expect(values).toBe(originalReference);
    expect(values).toEqual(['a', 'c']);
  });

  it('works with empty arrays', () => {
    const values: number[] = [];

    const wasRemoved = Utilities.removeItemFromArray(values, 1);

    expect(wasRemoved).toBe(false);
    expect(values).toEqual([]);
  });

  it('removes only the first occurrence when duplicates exist', () => {
    const values = [1, 2, 2, 3];

    const wasRemoved = Utilities.removeItemFromArray(values, 2);

    expect(wasRemoved).toBe(true);
    expect(values).toEqual([1, 2, 3]);
  });
});
