export class PriorityQueue<T> {
    //should implement this with a binary heap or AVL tree
    private readonly elements: [T, number][];


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
        this.elements.push([item, priority]);
    }

    public dequeueMin(): T {
        let minIndex = 0;

        for (let i = 0; i < this.elements.length; i++) {
            if (this.elements[i][1] < this.elements[minIndex][1]) {
                minIndex = i;
            }
        }

        this.elements.slice(minIndex, 1);

        return this.elements[minIndex][0];
    }

    public dequeueMax(): T {
        let maxIndex = 0;

        for (let i = 0; i < this.elements.length; i++) {
            if (this.elements[i][1] > this.elements[maxIndex][1]) {
                maxIndex = i;
            }
        }

        this.elements.slice(maxIndex, 1);

        return this.elements[maxIndex][0];
    }
}