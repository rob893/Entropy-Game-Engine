export interface IUnsubscribable {
  unsubscribe(): void;
}

export interface ISubscribable<T> {
  subscribe(handler: (eventData: T) => void): IUnsubscribable;
}

export interface ISerializedVector2Value {
  x: number;
  y: number;
}

export interface ISerializedBoundsValue {
  min: ISerializedVector2Value;
  max: ISerializedVector2Value;
}
