export interface CustomLiteEvent<T> {
    add(handler: { (data?: T, moreData?: T): void }): void;
    remove(handler: { (data?: T, moreData?: T): void }): void;
}