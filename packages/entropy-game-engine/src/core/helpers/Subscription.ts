import type { IUnsubscribable } from './types';

export class Subscription<T> implements IUnsubscribable {
  private unsubscribeLogic: (() => void) | null;

  private handler: ((eventData: T) => void) | null;

  public constructor(unsubscribeLogic: () => void, handler: (eventData: T) => void) {
    this.unsubscribeLogic = unsubscribeLogic;
    this.handler = handler;
  }

  public get isActive(): boolean {
    return this.unsubscribeLogic !== null && this.handler !== null;
  }

  public publish(eventData: T): void {
    if (this.handler) {
      this.handler(eventData);
    }
  }

  public unsubscribe(): void {
    if (this.unsubscribeLogic) {
      this.unsubscribeLogic();
      this.unsubscribeLogic = null;
      this.handler = null;
    }
  }
}
