const MAX_DELTA_TIME = 0.1;

export class Time {
  private prevTime: number | null = null;

  #deltaTime: number = 0;

  #totalTime: number = 0;

  #timeScale: number = 1.0;

  public get deltaTime(): number {
    return this.#deltaTime;
  }

  public get totalTime(): number {
    return this.#totalTime;
  }

  public get timeScale(): number {
    return this.#timeScale;
  }

  public set timeScale(value: number) {
    this.#timeScale = value;
  }

  public updateTime(timeSincePageLoad: number): void {
    if (this.prevTime === null) {
      this.prevTime = timeSincePageLoad;
      this.#deltaTime = 0;
      return;
    }

    this.#deltaTime = Math.min((timeSincePageLoad - this.prevTime) / 1000, MAX_DELTA_TIME);
    this.#deltaTime *= this.#timeScale;
    this.prevTime = timeSincePageLoad;
    this.#totalTime += this.#deltaTime;
  }

  public resetTime(): void {
    this.prevTime = null;
  }
}
