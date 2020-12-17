import { Subscription } from './Subscription';

export class Topic<T> {
  private readonly subscriptions: Subscription<T>[] = [];

  public invoke(eventData: T): void {
    this.subscriptions.forEach(sub => sub.invoke(eventData));
  }

  public subscribe(handler: (eventData: T) => void): Subscription<T> {
    const sub = new Subscription(this, handler);
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

  public clearSubscribers(): void {
    this.subscriptions.length = 0;
  }
}
