export class BinaryHeap {
    constructor(minHeap = true, items) {
        this.heapArray = [];
        this.minHeap = minHeap;
        if (items) {
            for (const item of items) {
                this.add(item);
            }
        }
    }
    static from(items, minHeap = true) {
        const heap = new BinaryHeap(minHeap);
        for (const item of items) {
            heap.add(item);
        }
        return heap;
    }
    static isBinaryHeap(heap) {
        return BinaryHeap.isMaxBinaryHeap(heap) || BinaryHeap.isMinBinaryHeap(heap);
    }
    static isMinBinaryHeap(heap) {
        let heapArray;
        if (heap instanceof BinaryHeap) {
            heapArray = heap.heapArray;
        }
        else {
            heapArray = heap;
        }
        for (let i = 0, l = heapArray.length; i < l; i++) {
            const item = heapArray[i];
            if (item === null) {
                return false;
            }
            if ((i * 2) + 1 < l) {
                const lChild = heapArray[(i * 2) + 1];
                if (lChild < item) {
                    return false;
                }
            }
            if ((i * 2) + 2 < l) {
                const rChild = heapArray[(i * 2) + 2];
                if (rChild < item) {
                    return false;
                }
            }
        }
        return true;
    }
    static isMaxBinaryHeap(heap) {
        let heapArray;
        if (heap instanceof BinaryHeap) {
            heapArray = heap.heapArray;
        }
        else {
            heapArray = heap;
        }
        for (let i = 0, l = heapArray.length; i < l; i++) {
            const item = heapArray[i];
            if (item === null) {
                return false;
            }
            if ((i * 2) + 1 < l) {
                const lChild = heapArray[(i * 2) + 1];
                if (lChild > item) {
                    return false;
                }
            }
            if ((i * 2) + 2 < l) {
                const rChild = heapArray[(i * 2) + 2];
                if (rChild > item) {
                    return false;
                }
            }
        }
        return true;
    }
    get isEmpty() {
        return this.heapArray.length === 0;
    }
    get count() {
        return this.heapArray.length;
    }
    add(item) {
        this.heapArray.push(item);
        this.heapifyUp();
    }
    remove() {
        const result = this.peek();
        const tail = this.heapArray.pop();
        if (this.count > 0) {
            this.heapArray[0] = tail;
            this.heapifyDown();
        }
        return result;
    }
    poll() {
        if (this.isEmpty) {
            return null;
        }
        return this.remove();
    }
    peek() {
        if (this.isEmpty) {
            throw new Error('The heap is empty.');
        }
        return this.heapArray[0];
    }
    contains(item) {
        return this.heapArray.includes(item);
    }
    clear() {
        this.heapArray.length = 0;
    }
    toString() {
        return this.heapArray.toString();
    }
    toArray() {
        return this.heapArray;
    }
    heapifyUp() {
        let index = this.count - 1;
        if (this.minHeap) {
            while (this.hasParent(index) && this.heapArray[index] < this.heapArray[this.getParentIndex(index)]) {
                this.swap(index, this.getParentIndex(index));
                index = this.getParentIndex(index);
            }
        }
        else {
            while (this.hasParent(index) && this.heapArray[index] > this.heapArray[this.getParentIndex(index)]) {
                this.swap(index, this.getParentIndex(index));
                index = this.getParentIndex(index);
            }
        }
    }
    heapifyDown() {
        let index = 0;
        if (this.minHeap) {
            while (this.hasLeftChild(index)) {
                let smallerChildIndex = this.getLeftChildIndex(index);
                if (this.hasRightChild(index) && this.heapArray[this.getRightChildIndex(index)] < this.heapArray[smallerChildIndex]) {
                    smallerChildIndex = this.getRightChildIndex(index);
                }
                if (this.heapArray[index] < this.heapArray[smallerChildIndex]) {
                    break;
                }
                this.swap(index, smallerChildIndex);
                index = smallerChildIndex;
            }
        }
        else {
            while (this.hasLeftChild(index)) {
                let greaterChildIndex = this.getLeftChildIndex(index);
                if (this.hasRightChild(index) && this.heapArray[this.getRightChildIndex(index)] > this.heapArray[greaterChildIndex]) {
                    greaterChildIndex = this.getRightChildIndex(index);
                }
                if (this.heapArray[index] > this.heapArray[greaterChildIndex]) {
                    break;
                }
                this.swap(index, greaterChildIndex);
                index = greaterChildIndex;
            }
        }
    }
    hasParent(index) {
        return index > 0;
    }
    hasLeftChild(index) {
        return this.getLeftChildIndex(index) < this.count;
    }
    hasRightChild(index) {
        return this.getRightChildIndex(index) < this.count;
    }
    getParentIndex(index) {
        return Math.floor((index - 1) / 2);
    }
    getLeftChildIndex(index) {
        return Math.floor((2 * index) + 1);
    }
    getRightChildIndex(index) {
        return Math.floor((2 * index) + 2);
    }
    swap(index1, index2) {
        const temp = this.heapArray[index1];
        this.heapArray[index1] = this.heapArray[index2];
        this.heapArray[index2] = temp;
    }
}
//# sourceMappingURL=BinaryHeap.js.map