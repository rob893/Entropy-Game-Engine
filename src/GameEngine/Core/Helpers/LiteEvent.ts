import { ILiteEvent } from "../Interfaces/ILiteEvent";

export class LiteEvent<T> implements ILiteEvent<T> {

    private handlers: { (data?: T): void; }[] = [];


    public add(handler: { (data?: T): void }) : void {
        this.handlers.push(handler);
    }

    public remove(handler: { (data?: T): void }) : void {
        this.handlers = this.handlers.filter(h => h !== handler);
    }

    public trigger(data?: T) {
        this.handlers.slice(0).forEach(h => h(data));
    }

    public expose() : ILiteEvent<T> {
        return this;
    }
}