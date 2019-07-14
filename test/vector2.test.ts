import { Vector2 } from '../src/GameEngine/Core/Vector2';

test('Finds the magnitude of a vector2', () => {
    expect(Vector2.zero.magnitude).toBe(0);
    expect(Vector2.one.magnitude).toBeCloseTo(1.414);
    expect(new Vector2(50, 69).magnitude).toBeCloseTo(85.212);
    expect(new Vector2(6969.6969, 0.001).magnitude).toBeCloseTo(6969.697);
});

test('Find dot product of a vector2', () => {
    expect(Vector2.dot(Vector2.one, Vector2.one)).toBeCloseTo(2);
    expect(Vector2.dot(Vector2.zero, Vector2.zero)).toBeCloseTo(0);
    expect(Vector2.dot(new Vector2(6, 4), new Vector2(32, 13))).toBeCloseTo(244);
    expect(Vector2.dot(new Vector2(3, 4), new Vector2(9, 8))).toBeCloseTo(59);
    expect(Vector2.dot(new Vector2(-1, -1), new Vector2(1, 1))).toBeCloseTo(-2);
    expect(Vector2.dot(new Vector2(-1, -1), new Vector2(-1, -1))).toBeCloseTo(2);
});

test('Find the angle between two vector2s.', () => {
    expect(Vector2.angleInRadians(Vector2.zero, Vector2.zero)).toBe(NaN);
    expect(Vector2.angleInDegrees(Vector2.zero, Vector2.zero)).toBe(NaN);
    expect(Vector2.angleInRadians(Vector2.one, Vector2.one)).toBeCloseTo(0);
    expect(Vector2.angleInDegrees(Vector2.one, Vector2.one)).toBeCloseTo(0);
    expect(Vector2.angleInRadians(Vector2.zero, Vector2.one)).toBe(NaN);
    expect(Vector2.angleInDegrees(Vector2.zero, Vector2.one)).toBe(NaN);
    expect(Vector2.angleInRadians(new Vector2(6, 4), new Vector2(32, 13))).toBeCloseTo(0.2021);
    expect(Vector2.angleInDegrees(new Vector2(6, 4), new Vector2(32, 13))).toBeCloseTo(11.58);
});

test('Add two vector2s together.', () => {
    expect(Vector2.one.add(Vector2.one)).toEqual(new Vector2(2, 2));
    expect(new Vector2(6, 2.23).add(new Vector2(1.1, 2.2))).toEqual(new Vector2(7.1, 4.43));
});

test('Find distance between two vector2s.', () => {
    expect(Vector2.distance(Vector2.one, Vector2.one)).toBeCloseTo(0);
    expect(Vector2.distance(Vector2.zero, Vector2.one)).toBeCloseTo(1.414);
    expect(Vector2.distance(new Vector2(6, 4), new Vector2(32, 13))).toBeCloseTo(27.513);
    expect(Vector2.distance(new Vector2(-7, -4), new Vector2(17, 6.5))).toBeCloseTo(26.196);
});