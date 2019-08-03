import { Vector2 } from './Vector2';
import { EventType } from '../Enums/EventType';
import { GameEngine } from '../GameEngine';
export class Input {
    static addEventListener(eventType, handler) {
        if (this.reservedEvents.has(eventType)) {
            console.error(eventType + ' is a reserved event. Please use the correct method to add a listener for it.');
            return;
        }
        if (this.genericEventMap.has(eventType)) {
            this.genericEventMap.get(eventType).push(handler);
        }
        else {
            if (!this.currentListeners.has(eventType)) {
                document.addEventListener(eventType, (event) => this.invokeGenericHandlers(event));
                this.currentListeners.set(eventType, this.invokeGenericHandlers);
            }
            this.genericEventMap.set(eventType, [handler]);
        }
    }
    static addKeyListener(type, keyCodes, handler) {
        if (!this.currentListeners.has(type)) {
            document.addEventListener(type, (event) => this.invokeKeyHandlers(event));
            this.currentListeners.set(type, (event) => this.invokeKeyHandlers(event));
        }
        if (!this.keyMap.has(type)) {
            this.keyMap.set(type, new Map());
        }
        if (typeof keyCodes === 'number') {
            keyCodes = [keyCodes];
        }
        for (const key of keyCodes) {
            if (this.keyMap.get(type).has(key)) {
                this.keyMap.get(type).get(key).push(handler);
            }
            else {
                this.keyMap.get(type).set(key, [handler]);
            }
        }
    }
    static addClickListener(mouseButton, handler) {
        if (this.clickMap.has(mouseButton)) {
            this.clickMap.get(mouseButton).push(handler);
        }
        else {
            if (!this.currentListeners.has(EventType.Click)) {
                document.addEventListener(EventType.Click, (event) => this.invokeClick(event));
                this.currentListeners.set(EventType.Click, this.invokeClick);
            }
            this.clickMap.set(mouseButton, [handler]);
        }
    }
    static getKey(keyCode) {
        return this.keyDownSet.has(keyCode);
    }
    static getMouseButton(mouseButton) {
        return this.mouseButtonDownSet.has(mouseButton);
    }
    static clearListeners() {
        this.keyMap.clear();
        this.genericEventMap.clear();
        this.clickMap.clear();
        this.currentListeners.forEach((handler, eventType) => {
            document.removeEventListener(eventType, handler);
        });
    }
    static get gameCanvas() {
        if (this._gameCanvas === undefined || this._gameCanvas === null) {
            this._gameCanvas = GameEngine.instance.getGameCanvas();
        }
        return this._gameCanvas;
    }
    static invokeGenericHandlers(event) {
        if (this.genericEventMap.has(event.type)) {
            this.genericEventMap.get(event.type).forEach(handler => handler(event));
        }
    }
    static invokeKeyHandlers(event) {
        const eventType = event.type;
        if (eventType === EventType.KeyDown) {
            this.keyDownSet.add(event.keyCode);
        }
        else {
            this.keyDownSet.delete(event.keyCode);
        }
        if (!this.keyMap.has(eventType)) {
            return;
        }
        if (this.keyMap.get(eventType).has(event.keyCode)) {
            this.keyMap.get(eventType).get(event.keyCode).forEach(handler => handler(event));
        }
    }
    static invokeClick(event) {
        if (this.clickMap.has(event.button)) {
            const canvasMouseEvent = event;
            canvasMouseEvent.cursorPositionOnCanvas = this.getCursorPosition(event);
            this.clickMap.get(event.button).forEach(handler => handler(canvasMouseEvent));
        }
    }
    static getCursorPosition(event) {
        const rect = this.gameCanvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        return new Vector2(x, y);
    }
}
Input.keyMap = new Map();
Input.mouseMap = new Map();
Input.clickMap = new Map();
Input.genericEventMap = new Map();
Input.currentListeners = new Map();
Input.reservedEvents = new Set([EventType.Click, EventType.KeyDown, EventType.KeyUp]);
Input.keyDownSet = new Set();
Input.mouseButtonDownSet = new Set();
//# sourceMappingURL=Input.js.map