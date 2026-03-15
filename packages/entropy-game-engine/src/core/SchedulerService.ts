const MS_PER_SECOND = 1000;

export class SchedulerService {
  private readonly timeouts: Set<number> = new Set<number>();

  public invoke(funcToInvoke: () => void, time: number): void {
    const timeout = window.setTimeout(() => {
      funcToInvoke();
      this.timeouts.delete(timeout);
    }, MS_PER_SECOND * time);

    this.timeouts.add(timeout);
  }

  public invokeRepeating(funcToInvoke: () => void, repeatRate: number, cancelToken?: { cancel: boolean }): void {
    this.invoke(() => {
      if (cancelToken !== undefined && cancelToken.cancel) {
        return;
      }

      funcToInvoke();

      this.invokeRepeating(funcToInvoke, repeatRate, cancelToken);
    }, repeatRate);
  }

  public clearAll(): void {
    for (const timeout of this.timeouts) {
      window.clearTimeout(timeout);
    }

    this.timeouts.clear();
  }
}
