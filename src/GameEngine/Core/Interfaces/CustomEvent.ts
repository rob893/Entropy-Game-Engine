export interface CustomEvent<T> {
    add(handler: { (data?: T, moreData?: T): void }): void;
    remove(handler: { (data?: T, moreData?: T): void }): void;
}