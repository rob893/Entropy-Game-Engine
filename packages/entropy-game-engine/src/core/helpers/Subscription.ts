import { Topic } from './Topic';

export class Subscription<T> {
  private topic: Topic<T> | null;
  private handler: ((eventData: T) => void) | null;

  public constructor(topic: Topic<T>, handler: (eventData: T) => void) {
    this.topic = topic;
    this.handler = handler;
  }

  public invoke(eventData: T): void {
    if (this.handler) {
      this.handler(eventData);
    }
  }

  public unsubscribe(): void {
    if (this.topic) {
      this.topic.unsubscribe(this);
    }

    this.topic = null;
    this.handler = null;
  }
}
