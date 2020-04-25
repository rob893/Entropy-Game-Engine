export class Time {
    private _deltaTime: number = 0;
    private _totalTime: number = 0;
    private prevTime: number | null = null;

    public get deltaTime(): number {
        return this._deltaTime;
    }

    public get totalTime(): number {
        return this._totalTime;
    }

    public updateTime(timeSincePageLoad: number): void {
        if (this.prevTime === null) {
            this.prevTime = timeSincePageLoad;
        }

        this._deltaTime = (timeSincePageLoad - this.prevTime) / 1000;
        this.prevTime = timeSincePageLoad;
        this._totalTime += this._deltaTime;
    }
}
