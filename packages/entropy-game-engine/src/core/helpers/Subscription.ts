import { Topic } from './Topic';
import { Unsubscribable } from './types';

export class Subscription<T> implements Unsubscribable {
  private unsubscribeLogic: ((subscription: Subscription<T>) => void) | null;
  private handler: ((eventData: T) => void) | null;

  public constructor(unsubscribeLogic: (subscription: Subscription<T>) => void, handler: (eventData: T) => void) {
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
      this.unsubscribeLogic(this);
      this.unsubscribeLogic = null;
      this.handler = null;
    }
  }
}
