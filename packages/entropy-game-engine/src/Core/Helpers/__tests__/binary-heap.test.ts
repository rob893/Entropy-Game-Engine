import { toBeDeepCloseTo, toMatchCloseTo } from 'jest-matcher-deep-close-to';

import { BinaryHeap } from '../BinaryHeap';

expect.extend({ toBeDeepCloseTo, toMatchCloseTo });

test('Tests the binary heap static is binary heap functions', () => {
    expect(BinaryHeap.isBinaryHeap([1, 2, 3, 4, 5])).toBe(true);
    expect(BinaryHeap.isBinaryHeap([1, 5, 4, 5, 3, 6, 7, 8])).toBe(false);
    expect(BinaryHeap.isMaxBinaryHeap([7, 7, 6, 6, 5, 5, 2, 1])).toBe(true);
    expect(BinaryHeap.isMaxBinaryHeap([1, 2, 3, 4, 5, 6, 7])).toBe(false);
    expect(BinaryHeap.isMinBinaryHeap([1, 2, 3, 4, 5])).toBe(true);
    expect(BinaryHeap.isMinBinaryHeap([8, 2, 3, 4, 5])).toBe(false);
    expect(BinaryHeap.isMaxBinaryHeap(['zzz', 'zb', 'r', 'za', '8'])).toBe(true);
});

test('Test creation of and various functions of a min binary heap', () => {
    const heap = BinaryHeap.from<number>([2345, 456232, 24, -60, 0]);

    expect(heap).toBeInstanceOf(BinaryHeap);
    expect(BinaryHeap.isBinaryHeap(heap)).toBe(true);
    expect(BinaryHeap.isMaxBinaryHeap(heap)).toBe(false);
    expect(BinaryHeap.isMinBinaryHeap(heap)).toBe(true);
    expect(heap.count).toBe(5);
    expect(heap.isEmpty).toBe(false);
    expect(heap.remove()).toBe(-60);
    expect(heap.peek()).toBe(0);
    expect(heap.contains(-60)).toBe(false);
    expect(heap.contains(456232)).toBe(true);
    expect(heap.remove()).toBe(0);
    expect(heap.count).toBe(3);
    expect(heap.poll()).toBe(24);
    expect(BinaryHeap.isMinBinaryHeap(heap)).toBe(true);
    expect(BinaryHeap.isMaxBinaryHeap(heap)).toBe(false);

    for (let i = 0; i < 100; i++) {
        heap.add(Math.random());
    }

    expect(BinaryHeap.isMinBinaryHeap(heap)).toBe(true);

    heap.clear();

    expect(heap.count).toBe(0);
    expect(heap.poll()).toBe(null);
    expect(() => heap.remove()).toThrowError();
    expect(BinaryHeap.isBinaryHeap(heap)).toBe(true);

    heap.add(5);

    expect(heap.count).toBe(1);
    expect(heap.isEmpty).toBe(false);
    expect(BinaryHeap.isBinaryHeap(heap)).toBe(true);
    expect(heap.remove()).toBe(5);
    expect(heap.count).toBe(0);
    expect(heap.isEmpty).toBe(true);
    expect(() => heap.remove()).toThrowError();
});

test('Test creation of and various functions of a max binary heap', () => {
    const heap = BinaryHeap.from<number>([2345, 456232, 24, -60, 0], false);

    expect(heap).toBeInstanceOf(BinaryHeap);
    expect(BinaryHeap.isBinaryHeap(heap)).toBe(true);
    expect(BinaryHeap.isMaxBinaryHeap(heap)).toBe(true);
    expect(BinaryHeap.isMinBinaryHeap(heap)).toBe(false);
    expect(heap.count).toBe(5);
    expect(heap.isEmpty).toBe(false);
    expect(heap.remove()).toBe(456232);
    expect(heap.peek()).toBe(2345);
    expect(heap.contains(456232)).toBe(false);
    expect(heap.contains(2345)).toBe(true);
    expect(heap.remove()).toBe(2345);
    expect(heap.count).toBe(3);
    expect(heap.poll()).toBe(24);
    expect(BinaryHeap.isMinBinaryHeap(heap)).toBe(false);
    expect(BinaryHeap.isMaxBinaryHeap(heap)).toBe(true);

    for (let i = 0; i < 100; i++) {
        heap.add(Math.random());
    }

    expect(BinaryHeap.isMaxBinaryHeap(heap)).toBe(true);
    expect(BinaryHeap.isMinBinaryHeap(heap)).toBe(false);

    heap.clear();

    expect(heap.count).toBe(0);
    expect(heap.poll()).toBe(null);
    expect(() => heap.remove()).toThrowError();
    expect(BinaryHeap.isBinaryHeap(heap)).toBe(true);

    heap.add(5);

    expect(heap.count).toBe(1);
    expect(heap.isEmpty).toBe(false);
    expect(BinaryHeap.isBinaryHeap(heap)).toBe(true);
    expect(heap.remove()).toBe(5);
    expect(heap.count).toBe(0);
    expect(heap.isEmpty).toBe(true);
    expect(() => heap.remove()).toThrowError();
});
