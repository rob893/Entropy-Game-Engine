const MS_PER_SECOND = 1000;

export interface IGameLoopCallbacks {
  readonly processDestroyQueue: () => void;
  readonly updateTime: (timeStamp: number) => number;
  readonly physicsStep: (fixedDeltaTime: number) => void;
  readonly updateGameObjects: () => void;
  readonly render: () => void;
  readonly isPaused: () => boolean;
}

export class GameLoop {
  private gameLoopId: number | null = null;

  private prevFrameTime: number = 0;

  private fpsIntervalInMS: number = 0;

  private fpsCap: number;

  private physicsAccumulator: number = 0;

  private readonly callbacks: IGameLoopCallbacks;

  #fixedTimeStep: number;

  public constructor(callbacks: IGameLoopCallbacks, fpsLimit: number, fixedTimeStep: number) {
    this.callbacks = callbacks;
    this.fpsCap = fpsLimit;
    this.fpsIntervalInMS = Math.floor(MS_PER_SECOND / fpsLimit);
    this.#fixedTimeStep = fixedTimeStep;
  }

  public get fpsLimit(): number {
    return this.fpsCap;
  }

  public set fpsLimit(value: number) {
    this.fpsCap = value;
    this.fpsIntervalInMS = Math.floor(MS_PER_SECOND / value);
  }

  public get fixedTimeStep(): number {
    return this.#fixedTimeStep;
  }

  public set fixedTimeStep(value: number) {
    if (!Number.isFinite(value) || value <= 0) {
      throw new Error('fixedTimeStep must be a positive number');
    }

    this.#fixedTimeStep = value;
    this.physicsAccumulator = 0;
  }

  public start(): void {
    this.physicsAccumulator = 0;
    this.prevFrameTime = 0;
    this.gameLoopId = requestAnimationFrame(() => this.loop());
  }

  public stop(): void {
    if (this.gameLoopId !== null) {
      cancelAnimationFrame(this.gameLoopId);
      this.gameLoopId = null;
    }
  }

  public resetPhysicsAccumulator(): void {
    this.physicsAccumulator = 0;
  }

  private loop(): void {
    const now = performance.now();
    const diff = now - this.prevFrameTime;

    if (diff >= this.fpsIntervalInMS) {
      this.prevFrameTime = now;
      this.update(now);
    }

    this.gameLoopId = requestAnimationFrame(() => this.loop());
  }

  private update(timeStamp: number): void {
    if (this.callbacks.isPaused()) {
      return;
    }

    this.callbacks.processDestroyQueue();

    const deltaTime = this.callbacks.updateTime(timeStamp);
    this.physicsAccumulator += deltaTime;

    while (this.physicsAccumulator >= this.#fixedTimeStep) {
      this.callbacks.physicsStep(this.#fixedTimeStep);
      this.physicsAccumulator -= this.#fixedTimeStep;
    }

    this.callbacks.updateGameObjects();

    this.callbacks.render();
  }
}
