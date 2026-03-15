export class Time {
  private _deltaTime: number = 0;
  private _totalTime: number = 0;
  private _timeScale: number = 1.0;
  private prevTime: number | null = null;

  public get deltaTime(): number {
    return this._deltaTime;
  }

  public get totalTime(): number {
    return this._totalTime;
  }

  public get timeScale(): number {
    return this._timeScale;
  }

  public set timeScale(value: number) {
    this._timeScale = value;
  }

  public updateTime(timeSincePageLoad: number): void {
    if (this.prevTime === null) {
      this.prevTime = timeSincePageLoad;
      this._deltaTime = 0;
      return;
    }

    this._deltaTime = Math.min((timeSincePageLoad - this.prevTime) / 1000, 0.1);
    this._deltaTime *= this._timeScale;
    this.prevTime = timeSincePageLoad;
    this._totalTime += this._deltaTime;
  }

  public resetTime(): void {
    this.prevTime = null;
  }
}
