import { CustomLiteEvent } from '../interfaces/CustomLiteEvent';

export class LiteEvent<T> implements CustomLiteEvent<T> {
  private handlers: { (data?: T, moreData?: T): void }[] = [];

  public add(handler: { (data?: T, moreData?: T): void }): void {
    this.handlers.push(handler);
  }

  public remove(handler: { (data?: T, moreData?: T): void }): void {
    this.handlers = this.handlers.filter(h => h !== handler);
  }

  public trigger(data?: T, moreData?: T): void {
    this.handlers.forEach(h => h(data, moreData));
  }

  public expose(): CustomLiteEvent<T> {
    return this;
  }
}
