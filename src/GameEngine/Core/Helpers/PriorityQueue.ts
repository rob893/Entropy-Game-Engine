import { BinaryHeap } from "./BinaryHeap";
import { IComparable } from "../Interfaces/IComparable";

export class PriorityQueue<T> {
    //should implement this with a binary heap or AVL tree
    private readonly elements: QueueItem<T>[];
    private readonly elementsHeap: BinaryHeap<QueueItem<T>> = new BinaryHeap<QueueItem<T>>()

    public constructor() {
        this.elements = [];
    }

    public count(): number {
        return this.elements.length;
    }

    public empty(): boolean {
        return this.elements.length === 0;
    }

    public enqueue(item: T, priority: number): void {
        this.elements.push(new QueueItem(item, priority));
    }

    public dequeueMin(): T {
        let minIndex = 0;

        for (let i = 0; i < this.elements.length; i++) {
            if (this.elements[i] < this.elements[minIndex]) {
                minIndex = i;
            }
        }

        this.elements.slice(minIndex, 1);

        return this.elements[minIndex].item;
    }

    public dequeueMax(): T {
        let maxIndex = 0;

        for (let i = 0; i < this.elements.length; i++) {
            if (this.elements[i] > this.elements[maxIndex]) {
                maxIndex = i;
            }
        }

        this.elements.slice(maxIndex, 1);

        return this.elements[maxIndex].item;
    }
}

class QueueItem<T> implements IComparable {

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