import { Utilities } from './Utilities';
import { Subscription } from './Subscription';
import { Subscribable } from './types';

export class Topic<T> implements Subscribable<T> {
  private readonly subscriptions: Subscription<T>[] = [];

  public publish(eventData: T): void {
    this.subscriptions.forEach(sub => sub.publish(eventData));
  }

  public subscribe(handler: (eventData: T) => void): Subscription<T> {
    const sub = new Subscription(
      subscription => Utilities.removeItemFromArray(this.subscriptions, subscription),
      handler
    );
    this.subscriptions.push(sub);

    return sub;
  }

  public unsubscribe(subscription: Subscription<T>): boolean {
    const index = this.subscriptions.indexOf(subscription);

    if (index >= 0) {
      this.subscriptions.splice(index, 1);
      return true;
    }

    return false;
  }

  public unsubscribeAll(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
