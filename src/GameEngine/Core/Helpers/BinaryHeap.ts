import { Comparable } from '../Interfaces/Comparable';

export class BinaryHeap<T extends Comparable> {
    
    private readonly heapArray: T[] = [];
    private readonly minHeap: boolean;
    
    
    public constructor(minHeap: boolean = true, items?: Iterable<T>) {
        this.minHeap = minHeap;

        if (items) {
            for (const item of items) {
                this.add(item);
            }
        }
    }

    public static from<T extends Comparable>(items: Iterable<T>, minHeap: boolean = true): BinaryHeap<T> {
        const heap = new BinaryHeap<T>(minHeap);

        for (const item of items) {
            heap.add(item);
        }

        return heap;
    } 

    public static isBinaryHeap(heap: Comparable[] | BinaryHeap<Comparable>): boolean {
        return BinaryHeap.isMaxBinaryHeap(heap) || BinaryHeap.isMinBinaryHeap(heap);
    }

    public static isMinBinaryHeap(heap: Comparable[] | BinaryHeap<Comparable>): boolean {
        let heapArray: Comparable[]; 
        
        if (heap instanceof BinaryHeap) {
            heapArray = heap.heapArray;
        }
        else {
            heapArray = heap;
        }
        
        for (let i = 0, l = heapArray.length; i < l; i++) {
            const item = heapArray[i];
            
            //if we have a null spot, the tree is not complete and thus not a heap
            if (item === null) {
                return false;
            }

            //if left child is less than parent, not a min heap
            if ((i * 2) + 1 < l) {
                const lChild = heapArray[(i * 2) + 1];

                if (lChild < item) {
                    return false;
                }
            }

            //if right child is less than parent, not a min heap
            if ((i * 2) + 2 < l) {
                const rChild = heapArray[(i * 2) + 2];

                if (rChild < item) {
                    return false;
                }
            }
        }
        
        return true;
    }

    public static isMaxBinaryHeap(heap: Comparable[] | BinaryHeap<Comparable>): boolean {
        let heapArray: Comparable[]; 
        
        if (heap instanceof BinaryHeap) {
            heapArray = heap.heapArray;
        }
        else {
            heapArray = heap;
        }
        
        for (let i = 0, l = heapArray.length; i < l; i++) {
            const item = heapArray[i];
            
            //if we have a null spot, the tree is not complete and thus not a heap
            if (item === null) {
                return false;
            }

            //if left child is greater than parent, not a max heap
            if ((i * 2) + 1 < l) {
                const lChild = heapArray[(i * 2) + 1];

                if (lChild > item) {
                    return false;
                }
            }

            //if right child is greater than parent, not a max heap
            if ((i * 2) + 2 < l) {
                const rChild = heapArray[(i * 2) + 2];

                if (rChild > item) {
                    return false;
                }
            }
        }
        
        return true;
    }

    public get isEmpty(): boolean {
        return this.heapArray.length === 0;
    }

    public get count(): number {
        return this.heapArray.length;
    }

    public add(item: T): void {
        this.heapArray.push(item);
        this.heapifyUp();
    }

    public remove(): T {
        const result = this.peek();

        const tail = this.heapArray.pop();

        if (this.count > 0) {
            this.heapArray[0] = tail;
            this.heapifyDown();
        }

        return result;
    }

    public poll(): T | null {
        if (this.isEmpty) {
            return null;
        }

        return this.remove();
    }

    public peek(): T {
        if (this.isEmpty) {
            throw new Error('The heap is empty.');
        }

        return this.heapArray[0];
    }

    public contains(item: T): boolean {
        return this.heapArray.includes(item);
    }

    public clear(): void {
        this.heapArray.length = 0;
    }

    public toString(): string {
        return this.heapArray.toString();
    }

    public toArray(): T[] {
        return this.heapArray;
    }

    private heapifyUp(): void {
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

    private heapifyDown(): void {
        let index = 0;

        if (this.minHeap) {
            //Because a heap is a complete tree, if a node has a child, it will always have at least a left child.
            while (this.hasLeftChild(index)) {
                let smallerChildIndex = this.getLeftChildIndex(index);

                //Check if the right child is smaller than left.
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

                //Check if the right child is greater than left.
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

    private hasParent(index: number): boolean {
        return index > 0;
    }

    private hasLeftChild(index: number): boolean {
        return this.getLeftChildIndex(index) < this.count;
    }

    private hasRightChild(index: number): boolean {
        return this.getRightChildIndex(index) < this.count;
    }

    private getParentIndex(index: number): number {
        return Math.floor((index - 1) / 2);
    }

    private getLeftChildIndex(index: number): number {
        return Math.floor((2 * index) + 1);
    }

    private getRightChildIndex(index: number): number {
        return Math.floor((2 * index) + 2);
    }

    private swap(index1: number, index2: number): void {
        const temp = this.heapArray[index1];
        this.heapArray[index1] = this.heapArray[index2];
        this.heapArray[index2] = temp;
    }
}