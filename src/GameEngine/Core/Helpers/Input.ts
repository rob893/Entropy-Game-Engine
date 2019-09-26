import { KeyCode } from '../Enums/KeyCode';
import { Vector2 } from './Vector2';
import { EventType } from '../Enums/EventType';
import { CanvasMouseEvent } from '../Interfaces/CanvasMouseEvent';

export class Input {

    private boundingRect: ClientRect | DOMRect;
    private readonly gameCanvas: HTMLCanvasElement;
    private readonly keyMap = new Map<EventType.KeyDown | EventType.KeyUp, Map<KeyCode, ((event: KeyboardEvent) => void)[]>>();
    private readonly mouseMap = new Map<EventType.Click | EventType.MouseDown | EventType.MouseUp, Map<number, ((event: CanvasMouseEvent) => void)[]>>();
    private readonly genericEventMap = new Map<EventType, ((event: Event) => void)[]>();
    private readonly currentListeners = new Map<EventType, ((event: Event) => void)>();
    private readonly reservedEvents = new Set([EventType.Click, EventType.KeyDown, EventType.KeyUp]);
    private readonly keyDownSet = new Set<KeyCode>();
    private readonly mouseButtonDownSet = new Set<number>();
    private readonly currentMousePosition = Vector2.zero;


    public constructor(gameCanvas: HTMLCanvasElement) {
        this.gameCanvas = gameCanvas;
        this.boundingRect = gameCanvas.getBoundingClientRect();

        //Add universal event listeners (for tracking mouse position, which keys/mouse buttons are down, and for recalculating client bounding rect)
        document.addEventListener('keydown', this.updateKeyDownSet);
        document.addEventListener('keyup', this.updateKeyDownSet);
        document.addEventListener('mousedown', this.updateMouseDownSet);
        document.addEventListener('mouseup', this.updateMouseDownSet);
        document.addEventListener('mousemove', this.updateCursorPosition);
        window.addEventListener('resize', this.updateBoundingClientRect);
        window.addEventListener('scroll', this.updateBoundingClientRect);
    }

    public get canvasMousePosition(): Vector2 {
        return new Vector2(this.currentMousePosition.x - this.boundingRect.left, this.currentMousePosition.y - this.boundingRect.top);
    }

    public addEventListener(eventType: EventType, handler: ((event: Event) => void)): void {
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

    public addKeyListener(type: EventType.KeyUp | EventType.KeyDown, keyCodes: KeyCode | KeyCode[], handler: ((event: KeyboardEvent) => void)): void {
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
    public addMouseListener(type: EventType.MouseDown | EventType.MouseUp | EventType.Click, mouseButton: 0 | 1 | 2, handler: ((event: CanvasMouseEvent) => void)): void {
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
    public getKey(keyCode: KeyCode): boolean {
        return this.keyDownSet.has(keyCode);
    }

    public getMouseButton(mouseButton: 0 | 1 | 2): boolean {
        return this.mouseButtonDownSet.has(mouseButton);
    }

    public clearListeners(): void {
        this.keyMap.clear();
        this.mouseMap.clear();
        this.genericEventMap.clear();
        
        this.currentListeners.forEach((handler, eventType) => {
            document.removeEventListener(eventType, handler);
        });

        //Remove universal listeners
        document.removeEventListener('keydown', this.updateKeyDownSet);
        document.removeEventListener('keyup', this.updateKeyDownSet);
        document.removeEventListener('mousedown', this.updateMouseDownSet);
        document.removeEventListener('mouseup', this.updateMouseDownSet);
        document.removeEventListener('mousemove', this.updateCursorPosition);
        window.removeEventListener('resize', this.updateBoundingClientRect);
        window.removeEventListener('scroll', this.updateBoundingClientRect);

        this.currentListeners.clear();
    }

    private readonly invokeGenericHandlers = (event: Event): void => {
        if (this.genericEventMap.has(event.type as EventType)) {
            this.genericEventMap.get(event.type as EventType).forEach(handler => handler(event));
        }
    }

    private readonly invokeKeyHandlers = (event: Event): void => {
        if (!(event instanceof KeyboardEvent)) {
            console.error('Invalid event');
            return;
        }

        const eventType = event.type as EventType.KeyUp | EventType.KeyDown;
        
        if (!this.keyMap.has(eventType)) {
            return;
        }

        if (this.keyMap.get(eventType).has(event.keyCode)) {
            this.keyMap.get(eventType).get(event.keyCode).forEach(handler => handler(event));
        }
    }

    private readonly invokeMouseHandlers = (event: Event): void => {
        if (!(event instanceof MouseEvent)) {
            console.log('Invalid event.');
            return;
        }

        const eventType = event.type as EventType.MouseDown | EventType.MouseUp | EventType.Click;
        
        if (!this.mouseMap.has(eventType)) {
            return;
        }

        const canvasMouseEvent = event as CanvasMouseEvent;
        this.updateCursorPosition(event);
        canvasMouseEvent.cursorPositionOnCanvas = this.canvasMousePosition;

        if (this.mouseMap.get(eventType).has(event.button)) {
            this.mouseMap.get(eventType).get(event.button).forEach(handler => handler(canvasMouseEvent));
        }
    }

    private readonly updateCursorPosition = (event: MouseEvent): void => {
        this.currentMousePosition.x = event.clientX;
        this.currentMousePosition.y = event.clientY;
    }

    private readonly updateKeyDownSet = (event: KeyboardEvent): void => {
        if (event.type === 'keydown') {
            this.keyDownSet.add(event.keyCode);
        }
        else if (event.type === 'keyup') {
            this.keyDownSet.delete(event.keyCode);
        }
    }

    private readonly updateMouseDownSet = (event: MouseEvent): void => {
        if (event.type === 'mousedown') {
            this.mouseButtonDownSet.add(event.button);
        }
        else if (event.type === 'mouseup') {
            this.mouseButtonDownSet.delete(event.button);
        }
    }

    private readonly updateBoundingClientRect = (): void => {
        this.boundingRect = this.gameCanvas.getBoundingClientRect();
    }
}