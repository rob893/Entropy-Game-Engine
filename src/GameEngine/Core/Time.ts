export class Time {

    private _deltaTime: number = 0;
    private startTime: number = 0;
    private prevTime: number = 0;


    public get deltaTime(): number {
        return this._deltaTime;
    }

    public get totalTime(): number {
        return (Date.now() - this.startTime) / 1000;
    }

    public start(): void {
        this.prevTime = Date.now();
        this.startTime = this.prevTime;
    }

    public updateTime(): void {
        this._deltaTime = (Date.now() - this.prevTime) / 1000;
        this.prevTime = Date.now();
    }
}