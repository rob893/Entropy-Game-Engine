export class Time {
    private _deltaTime: number = 0;
    private _totalTime: number = 0;
    private startTime: number = 0;
    private prevTime: number = 0;

    public get deltaTime(): number {
        return this._deltaTime;
    }

    public get totalTime(): number {
        return this._totalTime / 1000;
    }

    // public start(): void {
    //     this.prevTime = Date.now();
    //     this.startTime = this.prevTime;
    // }

    public updateTime(timeStamp: number): void {
        // this._deltaTime = (Date.now() - this.prevTime) / 1000;
        // this.prevTime = Date.now();
        if (this.prevTime === 0) {
            this.prevTime = timeStamp;
        }
        this._deltaTime = (timeStamp - this.prevTime) / 1000;
        this.prevTime = timeStamp;
        this._totalTime += this._deltaTime;
    }
}
