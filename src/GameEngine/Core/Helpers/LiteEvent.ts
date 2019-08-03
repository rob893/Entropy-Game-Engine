import { CustomEvent } from '../Interfaces/CustomEvent';

export class LiteEvent<T> implements CustomEvent<T> {

    private handlers: { (data?: T, moreData?: T): void }[] = [];


    public add(handler: { (data?: T, moreData?: T): void }): void {
        this.handlers.push(handler);
    }

    public remove(handler: { (data?: T, moreData?: T): void }): void {
        this.handlers = this.handlers.filter(h => h !== handler);
    }

    public trigger(data?: T, moreData?: T): void {
        this.handlers.slice(0).forEach(h => h(data, moreData));
    }

    public expose(): CustomEvent<T> {
        return this;
    }
}