import { KeyCode } from "../Enums/KeyCode";
import { Vector2 } from "./Vector2";
import { EventType } from "../Enums/EventType";
import { GameEngine } from "../GameEngine";
import { ICanvasMouseEvent } from "../Interfaces/ICanvasMouseEvent";

export abstract class Input {

    private static _gameCanvas: HTMLCanvasElement;
    private static readonly keyMap = new Map<EventType.KeyDown | EventType.KeyUp, Map<KeyCode, ((event: KeyboardEvent) => void)[]>>();
    private static readonly mouseMap = new Map<EventType.Click | EventType.MouseDown | EventType.MouseUp, Map<0 | 1 | 2, ((event: ICanvasMouseEvent) => void)[]>>();
    private static readonly clickMap = new Map<number, ((event: ICanvasMouseEvent) => void)[]>();
    private static readonly genericEventMap = new Map<EventType, ((event: Event) => void)[]>();
    private static readonly currentListeners = new Map<EventType, ((event: Event) => void)>();
    private static readonly reservedEvents = new Set([EventType.Click, EventType.KeyDown, EventType.KeyUp]);
    private static readonly keyDownSet = new Set<KeyCode>();
    private static readonly mouseButtonDownSet = new Set<number>();


    public static addEventListener(eventType: EventType, handler: ((event: Event) => void)): void {
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

    public static addKeyListener(type: EventType.KeyUp | EventType.KeyDown, keyCodes: KeyCode | KeyCode[], handler: ((event: KeyboardEvent) => void)): void {
        if (!this.currentListeners.has(type)) {
            document.addEventListener(type, (event) => this.invokeKeyHandlers(event));
            this.currentListeners.set(type, (event) => this.invokeKeyHandlers(event as KeyboardEvent));
        }

        if (!this.keyMap.has(type)) {
            this.keyMap.set(type, new Map<KeyCode, ((event: KeyboardEvent) => void)[]>());
        }

        if (typeof keyCodes === 'number') {
            keyCodes = [keyCodes];
        }
        
        for (let key of keyCodes) {
            if (this.keyMap.get(type).has(key)) {
                this.keyMap.get(type).get(key).push(handler);
            }
            else {
                this.keyMap.get(type).set(key, [handler]);
            }
        }
    }

    /**
     * This function will register a handler method for a click event for the passed in mouse button (0, 1, 2).
     * 
     * @param mouseButton 0 for left click, 1 for middle mouse, 2 for right click
     * @param handler the callback function to be called
     * @example Input.addClickListener(0, (event) => this.handleClick(event));
     */
    public static addClickListener(mouseButton: number, handler: ((event: ICanvasMouseEvent) => void)): void {
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

    public static getKey(keyCode: KeyCode): boolean {
        return this.keyDownSet.has(keyCode);
    }

    public static getMouseButton(mouseButton: number): boolean {
        return this.mouseButtonDownSet.has(mouseButton);
    }

    public static clearListeners(): void {
        this.keyMap.clear();
        this.genericEventMap.clear();
        this.clickMap.clear();
        
        this.currentListeners.forEach((handler, eventType) => {
            document.removeEventListener(eventType, handler);
        });
    }

    private static get gameCanvas(): HTMLCanvasElement {
        if (this._gameCanvas === undefined || this._gameCanvas === null) {
            this._gameCanvas = GameEngine.instance.getGameCanvas();
        }

        return this._gameCanvas;
    }

    private static invokeGenericHandlers(event: Event): void {
        if (this.genericEventMap.has(<EventType>event.type)) {
            this.genericEventMap.get(<EventType>event.type).forEach(handler => handler(event));
        }
    }

    private static invokeKeyHandlers(event: KeyboardEvent): void {
        const eventType = event.type as EventType.KeyUp | EventType.KeyDown;

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

    private static invokeClick(event: MouseEvent): void {
        if (this.clickMap.has(event.button)) {
            const canvasMouseEvent = event as ICanvasMouseEvent;
            canvasMouseEvent.cursorPositionOnCanvas = this.getCursorPosition(event);

            this.clickMap.get(event.button).forEach(handler => handler(canvasMouseEvent));
        }
    }

    private static getCursorPosition(event: MouseEvent): Vector2 {
        const rect = this.gameCanvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        return new Vector2(x, y);
    }
}
