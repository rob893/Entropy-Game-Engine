import { KeyCode } from '../Enums/KeyCode';
import { Vector2 } from './Vector2';
import { EventType } from '../Enums/EventType';
import { GameEngine } from '../GameEngine';
import { CanvasMouseEvent } from '../Interfaces/CanvasMouseEvent';

export abstract class Input {

    private static  gameCanvas: HTMLCanvasElement;
    private static initialized: boolean = false;
    private static readonly keyMap = new Map<EventType.KeyDown | EventType.KeyUp, Map<KeyCode, ((event: KeyboardEvent) => void)[]>>();
    private static readonly mouseMap = new Map<EventType.Click | EventType.MouseDown | EventType.MouseUp, Map<number, ((event: CanvasMouseEvent) => void)[]>>();
    private static readonly genericEventMap = new Map<EventType, ((event: Event) => void)[]>();
    private static readonly currentListeners = new Map<EventType, ((event: Event) => void)>();
    private static readonly reservedEvents = new Set([EventType.Click, EventType.KeyDown, EventType.KeyUp]);
    private static readonly keyDownSet = new Set<KeyCode>();
    private static readonly mouseButtonDownSet = new Set<number>();
    private static readonly currentMousePosition = Vector2.zero;


    /**
     * This function should be called once to add the event listeners required for getKey and getMouseButton.
     */
    public static initialize(gameCanvas: HTMLCanvasElement): void {
        if (this.initialized) {
            return;
        }

        this.initialized = true;
        this.gameCanvas = gameCanvas;
        document.addEventListener('keydown', (event) => this.keyDownSet.add(event.keyCode));
        document.addEventListener('keyup', (event) => this.keyDownSet.delete(event.keyCode));
        document.addEventListener('mousedown', (event) => this.mouseButtonDownSet.add(event.button));
        document.addEventListener('mouseup', (event) => this.mouseButtonDownSet.delete(event.button));
        document.addEventListener('mousemove', this.updateCursorPosition);
    }

    public static get canvasMousePosition(): Vector2 {
        const rect = this.gameCanvas.getBoundingClientRect();

        return new Vector2(this.currentMousePosition.x - rect.left, this.currentMousePosition.y - rect.top);
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
                document.addEventListener(eventType, this.invokeGenericHandlers);
                this.currentListeners.set(eventType, this.invokeGenericHandlers);
            }
            
            this.genericEventMap.set(eventType, [handler]);
        }
    }

    public static addKeyListener(type: EventType.KeyUp | EventType.KeyDown, keyCodes: KeyCode | KeyCode[], handler: ((event: KeyboardEvent) => void)): void {
        if (!this.currentListeners.has(type)) {
            document.addEventListener(type, this.invokeKeyHandlers);
            this.currentListeners.set(type, this.invokeKeyHandlers);
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
            document.addEventListener(type, this.invokeMouseHandlers);
            this.currentListeners.set(type, this.invokeMouseHandlers);
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

        this.currentListeners.clear();
    }

    private static readonly invokeGenericHandlers = (event: Event): void => {
        if (Input.genericEventMap.has(event.type as EventType)) {
            Input.genericEventMap.get(event.type as EventType).forEach(handler => handler(event));
        }
    }

    private static readonly invokeKeyHandlers = (event: KeyboardEvent): void => {
        const eventType = event.type as EventType.KeyUp | EventType.KeyDown;
        
        if (!Input.keyMap.has(eventType)) {
            return;
        }

        if (Input.keyMap.get(eventType).has(event.keyCode)) {
            Input.keyMap.get(eventType).get(event.keyCode).forEach(handler => handler(event));
        }
    }

    private static readonly invokeMouseHandlers = (event: MouseEvent): void => {
        const eventType = event.type as EventType.MouseDown | EventType.MouseUp | EventType.Click;
        
        if (!Input.mouseMap.has(eventType)) {
            return;
        }

        const canvasMouseEvent = event as CanvasMouseEvent;
        Input.updateCursorPosition(event);
        canvasMouseEvent.cursorPositionOnCanvas = Input.canvasMousePosition;

        if (Input.mouseMap.get(eventType).has(event.button)) {
            Input.mouseMap.get(eventType).get(event.button).forEach(handler => handler(canvasMouseEvent));
        }
    }

    private static readonly updateCursorPosition = (event: MouseEvent): void => {
        Input.currentMousePosition.x = event.clientX;
        Input.currentMousePosition.y = event.clientY;
    }
}