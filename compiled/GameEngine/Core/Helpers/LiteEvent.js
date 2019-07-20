export class LiteEvent {
    constructor() {
        this.handlers = [];
    }
    add(handler) {
        this.handlers.push(handler);
    }
    remove(handler) {
        this.handlers = this.handlers.filter(h => h !== handler);
    }
    trigger(data, moreData) {
        this.handlers.slice(0).forEach(h => h(data, moreData));
    }
    expose() {
        return this;
    }
}
//# sourceMappingURL=LiteEvent.js.map