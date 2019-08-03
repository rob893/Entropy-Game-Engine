import { BinaryHeap } from './BinaryHeap';
class QueueItem {
    constructor(item, priority) {
        this.item = item;
        this.priority = priority;
    }
    valueOf() {
        return this.priority;
    }
}
export class PriorityQueue {
    constructor(minPriorityQueue = true) {
        this.elementsHeap = new BinaryHeap(minPriorityQueue);
    }
    get count() {
        return this.elementsHeap.count;
    }
    get isEmpty() {
        return this.elementsHeap.isEmpty;
    }
    enqueue(item, priority) {
        this.elementsHeap.add(new QueueItem(item, priority));
    }
    dequeue() {
        return this.elementsHeap.remove().item;
    }
}
//# sourceMappingURL=PriorityQueue.js.map