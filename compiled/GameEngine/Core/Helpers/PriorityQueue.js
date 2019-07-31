import { BinaryHeap } from "./BinaryHeap";
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
class QueueItem {
    constructor(item, priority) {
        this.item = item;
        this.priority = priority;
    }
    valueOf() {
        return this.priority;
    }
}
//# sourceMappingURL=PriorityQueue.js.map