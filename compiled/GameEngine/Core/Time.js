export class Time {
    static get DeltaTime() {
        return this.deltaTime;
    }
    static get TotalTime() {
        return (Date.now() - this.startTime) / 1000;
    }
    static start() {
        this.prevTime = Date.now();
        this.startTime = this.prevTime;
    }
    static updateTime() {
        this.deltaTime = (Date.now() - this.prevTime) / 1000;
        this.prevTime = Date.now();
    }
}
Time.deltaTime = 0;
Time.startTime = 0;
Time.prevTime = 0;
//# sourceMappingURL=Time.js.map