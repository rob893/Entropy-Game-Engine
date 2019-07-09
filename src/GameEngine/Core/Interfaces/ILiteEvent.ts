interface ILiteEvent<T> {
    add(handler: { (data?: T): void }) : void;
    remove(handler: { (data?: T): void }) : void;
}