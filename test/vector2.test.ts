import { Vector2 } from '../src/GameEngine/Core/Vector2';
import {toBeDeepCloseTo, toMatchCloseTo} from 'jest-matcher-deep-close-to';
expect.extend({toBeDeepCloseTo, toMatchCloseTo});

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
    expect(Vector2.angleInDegrees(Vector2.right, Vector2.up)).toBeCloseTo(90);
    expect(Vector2.angleInDegrees(Vector2.right, Vector2.left)).toBeCloseTo(180);
    expect(Vector2.angleInDegrees(Vector2.right, Vector2.down)).toBeCloseTo(90);
});

test('Add two vector2s together.', () => {
    expect(Vector2.one.add(Vector2.one)).toEqual(new Vector2(2, 2));
    expect(new Vector2(6, 2.23).add(new Vector2(1.1, 2.2))).toEqual(new Vector2(7.1, 4.43));
    expect(Vector2.add(Vector2.one, Vector2.up)).toEqual(new Vector2(1, 2));
});

test('Subtract two vector2s.', () => {
    expect(Vector2.zero.subtract(Vector2.zero)).toEqual(Vector2.zero);
    expect(Vector2.zero.subtract(Vector2.one)).toEqual(new Vector2(-1, -1));
    expect(new Vector2(4, 5).subtract(new Vector2(-3, 2))).toEqual(new Vector2(7, 3));
    expect(Vector2.subtract(new Vector2(4, 5), new Vector2(4, 5))).toEqual(Vector2.zero);
});

test('Multiply two vector2s.', () => {
    expect(new Vector2(2, 3).multiply(new Vector2(5, 5))).toEqual(new Vector2(10, 15));
    expect(new Vector2(4, 4).multiply(new Vector2(6, 6)).multiply(new Vector2(-1, -1))).toEqual(new Vector2(-24, -24));
    expect(Vector2.multiply(Vector2.right, new Vector2(8, 123))).toEqual(new Vector2(8, 0));
});

test('Find distance between two vector2s.', () => {
    expect(Vector2.distance(Vector2.one, Vector2.one)).toBeCloseTo(0);
    expect(Vector2.distance(Vector2.zero, Vector2.one)).toBeCloseTo(1.414);
    expect(Vector2.distance(new Vector2(6, 4), new Vector2(32, 13))).toBeCloseTo(27.513);
    expect(Vector2.distance(new Vector2(-7, -4), new Vector2(17, 6.5))).toBeCloseTo(26.196);
});

test('Multiply a vector2 by a scaler.', () => {
    expect(Vector2.one.multiplyScalar(5)).toEqual(new Vector2(5, 5));
    expect(new Vector2(4, 7).multiplyScalar(3)).toEqual(new Vector2(12, 21));
    expect(Vector2.zero.multiplyScalar(8732.232)).toEqual(Vector2.zero);
    expect(new Vector2(-1.2332, 78).multiplyScalar(-8292)).toEqual(new Vector2(10225.6944, -646776));
});

test('Get a normalized vector2', () => {
    expect(Vector2.zero.normalized).toEqual(new Vector2(NaN, NaN));
    expect(Vector2.one.normalized).toMatchCloseTo(new Vector2(0.7071, 0.7071), 4);
    expect(new Vector2(2, 1).normalized).toMatchCloseTo(new Vector2(0.8944, 0.4472), 4);
});