import { Topic } from './Topic';
import { Unsubscribable } from './types';

export class Subscription<T> implements Unsubscribable {
  private readonly unsubscribeLogic: (subscription: Subscription<T>) => void;
  private readonly handler: (eventData: T) => void;

  public constructor(unsubscribeLogic: (subscription: Subscription<T>) => void, handler: (eventData: T) => void) {
    this.unsubscribeLogic = unsubscribeLogic;
    this.handler = handler;
  }

  public publish(eventData: T): void {
    this.handler(eventData);
  }

  public unsubscribe(): void {
    this.unsubscribeLogic(this);
  }
}
