import { Vector2 } from '../Core/Vector2';

test('Finds the magnitude of a vector2', () => {
    let vector = Vector2.zero;
    expect(vector.magnitude).toBe(0);
});