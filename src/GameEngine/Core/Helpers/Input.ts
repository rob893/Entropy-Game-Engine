import { KeyCode } from '../Enums/KeyCode';
import { Vector2 } from './Vector2';
import { EventType } from '../Enums/EventType';
import { GameEngine } from '../GameEngine';
import { CanvasMouseEvent } from '../Interfaces/CanvasMouseEvent';

export abstract class Input {

    private static _gameCanvas: HTMLCanvasElement;
    private static initialized: boolean = false;
    private static readonly keyMap = new Map<EventType.KeyDown | EventType.KeyUp, Map<KeyCode, ((event: KeyboardEvent) => void)[]>>();
    private static readonly mouseMap = new Map<EventType.Click | EventType.MouseDown | EventType.MouseUp, Map<number, ((event: CanvasMouseEvent) => void)[]>>();
    private static readonly genericEventMap = new Map<EventType, ((event: Event) => void)[]>();
    private static readonly currentListeners = new Map<EventType, ((event: Event) => void)>();
    private static readonly reservedEvents = new Set([EventType.Click, EventType.KeyDown, EventType.KeyUp]);
    private static readonly keyDownSet = new Set<KeyCode>();
    private static readonly mouseButtonDownSet = new Set<number>();


    /**
     * This function should be called once to add the event listeners required for getKey and getMouseButton.
     */
    public static initialize(): void {
        if (this.initialized) {
            return;
        }

        this.initialized = true;
        document.addEventListener('keydown', (event) => this.keyDownSet.add(event.keyCode));
        document.addEventListener('keyup', (event) => this.keyDownSet.delete(event.keyCode));
        document.addEventListener('mousedown', (event) => this.mouseButtonDownSet.add(event.button));
        document.addEventListener('mouseup', (event) => this.mouseButtonDownSet.delete(event.button));
    }

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
        
        for (const key of keyCodes) {
            if (this.keyMap.get(type).has(key)) {
                this.keyMap.get(type).get(key).push(handler);
            }
            else {
                this.keyMap.get(type).set(key, [handler]);
            }
        }
    }

    /**
     * This function will register a handler method for the passed in mouse event for the passed in mouse button (0, 1, 2).
     * 
     * @param type The event to listen for. Either mouseup, mousedown, or click
     * @param mouseButton 0 for left click, 1 for middle mouse, 2 for right click
     * @param handler the callback function to be called
     * @example Input.addMouseListener(EventType.MouseDown, 0, (event) => this.handleMouseDown(event));
     */
    public static addMouseListener(type: EventType.MouseDown | EventType.MouseUp | EventType.Click, mouseButton: 0 | 1 | 2, handler: ((event: CanvasMouseEvent) => void)): void {
        if (!this.currentListeners.has(type)) {
            document.addEventListener(type, (event) => this.invokeMouseHandlers(event));
            this.currentListeners.set(type, (event) => this.invokeMouseHandlers(event as MouseEvent));
        }

        if (!this.mouseMap.has(type)) {
            this.mouseMap.set(type, new Map<number, ((event: CanvasMouseEvent) => void)[]>());
        }
    
        if (this.mouseMap.get(type).has(mouseButton)) {
            this.mouseMap.get(type).get(mouseButton).push(handler);
        }
        else {
            this.mouseMap.get(type).set(mouseButton, [handler]);
        }
    }

    /**
     * This function will return true if the passed in keyCode is currently being pressed.
     * 
     * @param keyCode The key to check if it is currently being pressed.
     * @example if (Input.getKey(KeyCode.J)) { console.log('J is being pressed'); } 
     */
    public static getKey(keyCode: KeyCode): boolean {
        return this.keyDownSet.has(keyCode);
    }

    public static getMouseButton(mouseButton: 0 | 1 | 2): boolean {
        return this.mouseButtonDownSet.has(mouseButton);
    }

    public static clearListeners(): void {
        this.keyMap.clear();
        this.mouseMap.clear();
        this.genericEventMap.clear();
        
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
        if (this.genericEventMap.has(event.type as EventType)) {
            this.genericEventMap.get(event.type as EventType).forEach(handler => handler(event));
        }
    }

    private static invokeKeyHandlers(event: KeyboardEvent): void {
        const eventType = event.type as EventType.KeyUp | EventType.KeyDown;
        
        if (!this.keyMap.has(eventType)) {
            return;
        }

        if (this.keyMap.get(eventType).has(event.keyCode)) {
            this.keyMap.get(eventType).get(event.keyCode).forEach(handler => handler(event));
        }
    }

    private static invokeMouseHandlers(event: MouseEvent): void {
        const eventType = event.type as EventType.MouseDown | EventType.MouseUp | EventType.Click;
        
        if (!this.mouseMap.has(eventType)) {
            return;
        }

        const canvasMouseEvent = event as CanvasMouseEvent;
        canvasMouseEvent.cursorPositionOnCanvas = this.getCursorPosition(event);

        if (this.mouseMap.get(eventType).has(event.button)) {
            this.mouseMap.get(eventType).get(event.button).forEach(handler => handler(canvasMouseEvent));
        }
    }

    private static getCursorPosition(event: MouseEvent): Vector2 {
        const rect = this.gameCanvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        return new Vector2(x, y);
    }
}
