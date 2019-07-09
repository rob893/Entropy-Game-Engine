abstract class Time {

    private static deltaTime: number = 0;
    private static startTime: number = 0;
    private static prevTime: number = 0;


    public static get DeltaTime(): number {
        return this.deltaTime;
    }

    public static get TotalTime(): number {
        return (Date.now() - this.startTime) / 1000;
    }

    public static start(): void {
        this.prevTime = Date.now();
        this.startTime = this.prevTime;
    }

    public static updateTime(): void {
        this.deltaTime = (Date.now() - this.prevTime) / 1000;
        this.prevTime = Date.now();
    }
}