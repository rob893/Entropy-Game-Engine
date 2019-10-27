export class Stopwatch {

    private elapsedMs: number = 0;
    private startTime: number = 0;


    public get elapsedMilliseconds(): number {
        return this.elapsedMs;
    }

    public start(): void {
        this.startTime = performance.now();
    }

    public stop(): void {
        this.elapsedMs += (performance.now() - this.startTime);
    }

    public reset(): void {
        this.startTime = 0;
        this.elapsedMs = 0;
    }
}