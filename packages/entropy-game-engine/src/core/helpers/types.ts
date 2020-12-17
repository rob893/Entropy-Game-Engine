export interface Unsubscribable {
  unsubscribe(): void;
}

export interface Subscribable<T> {
  subscribe(handler: (eventData: T) => void): Unsubscribable;
}
