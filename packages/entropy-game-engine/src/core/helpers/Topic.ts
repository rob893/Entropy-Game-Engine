import { Utilities } from './Utilities';
import { Subscription } from './Subscription';
import type { ISubscribable } from './types';

export class Topic<T> implements ISubscribable<T> {
  private readonly handlers: Array<(eventData: T) => void> = [];
  private readonly subscriptions: Subscription<T>[] = [];

  public publish(eventData: T): void {
    this.handlers.forEach(handler => handler(eventData));
  }

  public subscribe(handler: (eventData: T) => void): Subscription<T> {
    const subscription = new Subscription(() => {
      Utilities.removeItemFromArray(this.handlers, handler);
      Utilities.removeItemFromArray(this.subscriptions, subscription);
    }, handler);

    this.handlers.push(handler);
    this.subscriptions.push(subscription);

    return subscription;
  }

  public unsubscribe(subscription: Subscription<T>): boolean {
    if (!subscription.isActive) {
      return false;
    }

    subscription.unsubscribe();

    return true;
  }

  public unsubscribeAll(): void {
    [...this.subscriptions].forEach(subscription => subscription.unsubscribe());
  }
}
