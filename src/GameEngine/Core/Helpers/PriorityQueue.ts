import { BinaryHeap } from './BinaryHeap';
import { Comparable } from '../Interfaces/Comparable';

class QueueItem<T> implements Comparable {

    public readonly item: T;
    public readonly priority: number;


    public constructor(item: T, priority: number) {
        this.item = item;
        this.priority = priority;
    }

    public valueOf(): number {
        return this.priority;
    }
}

export class PriorityQueue<T> {
    
    private readonly elementsHeap: BinaryHeap<QueueItem<T>>;
    

    public constructor(minPriorityQueue: boolean = true) {
        this.elementsHeap = new BinaryHeap<QueueItem<T>>(minPriorityQueue);
    }

    public get count(): number {
        return this.elementsHeap.count;
    }

    public get isEmpty(): boolean {
        return this.elementsHeap.isEmpty;
    }

    public enqueue(item: T, priority: number): void {
        this.elementsHeap.add(new QueueItem<T>(item, priority));
    }

    public dequeue(): T {
        return this.elementsHeap.remove().item;
    }
}