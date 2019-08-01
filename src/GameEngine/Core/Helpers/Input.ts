import { KeyCode } from "../Enums/KeyCode";
import { Vector2 } from "./Vector2";
import { EventType } from "../Enums/EventType";
import { GameEngine } from "../GameEngine";
import { ICanvasMouseEvent } from "../Interfaces/ICanvasMouseEvent";

export abstract class Input {

    private static _gameCanvas: HTMLCanvasElement;
    private static keyDownMap: Map<KeyCode, ((event: KeyboardEvent) => void)[]> = new Map<KeyCode, ((event: KeyboardEvent) => void)[]>();
    private static keyUpMap: Map<KeyCode, ((event: KeyboardEvent) => void)[]> = new Map<KeyCode, ((event: KeyboardEvent) => void)[]>();
    private static clickMap: Map<number, ((event: ICanvasMouseEvent) => void)[]> = new Map<number, ((event: ICanvasMouseEvent) => void)[]>();
    private static genericEventMap: Map<EventType, ((event: Event) => void)[]> = new Map<EventType, ((event: Event) => void)[]>();
    private static currentListeners: Map<EventType, ((event: Event) => void)> = new Map<EventType, ((event: Event) => void)>();
    private static reservedEvents: Set<EventType> = new Set([EventType.Click, EventType.KeyDown, EventType.KeyUp]);
    private static keyDownSet: Set<KeyCode> = new Set<KeyCode>();
    private static mouseButtonDownSet: Set<number> = new Set<number>();


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
                document.addEventListener(eventType, (event) => this.invokeGenericEvent(event));
                this.currentListeners.set(eventType, this.invokeGenericEvent);
            }
            
            this.genericEventMap.set(eventType, [handler]);
        }
    }

    public static addKeyDownListener(keyCode: KeyCode, handler: ((event: KeyboardEvent) => void)): void {
        if (this.keyDownMap.has(keyCode)) {
            this.keyDownMap.get(keyCode).push(handler);
        }
        else {
            if (!this.currentListeners.has(EventType.KeyDown)) {
                document.addEventListener(EventType.KeyDown, (event) => this.invokeKeyDown(event));
                this.currentListeners.set(EventType.KeyDown, this.invokeKeyDown);
            }

            this.keyDownMap.set(keyCode, [handler]);
        }
    }

    public static addKeyUpListener(keyCode: KeyCode, handler: ((event: KeyboardEvent) => void)): void {
        if (this.keyUpMap.has(keyCode)) {
            this.keyUpMap.get(keyCode).push(handler);
        }
        else {
            if (!this.currentListeners.has(EventType.KeyUp)) {
                document.addEventListener(EventType.KeyUp, (event) => this.invokeKeyUp(event));
                this.currentListeners.set(EventType.KeyUp, this.invokeKeyUp);
            }

            this.keyUpMap.set(keyCode, [handler]);
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
        this.keyDownMap.clear();
        this.keyUpMap.clear();
        this.genericEventMap.clear();
        this.clickMap.clear();
        console.log(this.currentListeners);
        this.currentListeners.forEach((handler, eventType) => {
            this.gameCanvas.removeEventListener(eventType, handler);
        });
    }

    private static get gameCanvas(): HTMLCanvasElement {
        if (this._gameCanvas === undefined || this._gameCanvas === null) {
            this._gameCanvas = GameEngine.instance.getGameCanvas();
        }

        return this._gameCanvas;
    }

    private static invokeGenericEvent(event: Event): void {
        if (this.genericEventMap.has(<EventType>event.type)) {
            console.log('being invoked');
            this.genericEventMap.get(<EventType>event.type).forEach(handler => handler(event));
        }
    }

    private static invokeKeyDown(event: KeyboardEvent): void {
        if (this.keyDownMap.has(event.keyCode)) {
            this.keyDownMap.get(event.keyCode).forEach(handler => handler(event));
        }

        this.keyDownSet.add(event.keyCode);
    }

    private static invokeKeyUp(event: KeyboardEvent): void {
        if (this.keyUpMap.has(event.keyCode)) {
            this.keyUpMap.get(event.keyCode).forEach(handler => handler(event));
        }

        this.keyDownSet.delete(event.keyCode);
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