import { KeyCode } from "../Enums/KeyCode";
import { Vector2 } from "./Vector2";
import { EventType } from "../Enums/EventType";

export abstract class Input {

    private static gameCanvas: HTMLCanvasElement;
    private static keyDownMap: Map<KeyCode, ((event: KeyboardEvent) => void)[]> = new Map<KeyCode, ((event: KeyboardEvent) => void)[]>();
    private static keyUpMap: Map<KeyCode, ((event: KeyboardEvent) => void)[]> = new Map<KeyCode, ((event: KeyboardEvent) => void)[]>();
    private static clickMap: Map<number, ((event: MouseEvent) => void)[]> = new Map<number, ((event: MouseEvent) => void)[]>();
    private static genericEventMap: Map<EventType,((event: Event) => void)[]> = new Map<EventType,((event: Event) => void)[]>();
    private static keyDownSet: Set<KeyCode> = new Set<KeyCode>();
    private static mouseButtonDownSet: Set<number> = new Set<number>();


    public static init(gameCanvas: HTMLCanvasElement): void {
        this.gameCanvas = gameCanvas;
        //possible lazy load of this?
        document.addEventListener('keydown', () => this.invokeKeyDown(<KeyboardEvent>event));
        document.addEventListener('keyup', () => this.invokeKeyUp(<KeyboardEvent>event));
        document.addEventListener('click', () => this.invokeClick(<MouseEvent>event));
    }

    public static addEventListener(eventType: EventType, handler: ((event: Event) => void)): void {
        if (this.genericEventMap.has(eventType)) {
            this.genericEventMap.get(eventType).push(handler);
        }
        else {
            document.addEventListener(eventType, () => this.invokeGenericEvent(event));
            this.genericEventMap.set(eventType, [handler]);
        }
    }

    public static addKeyDownListener(keyCode: KeyCode, handler: ((event: KeyboardEvent) => void)): void {
        if (this.keyDownMap.has(keyCode)) {
            this.keyDownMap.get(keyCode).push(handler);
        }
        else {
            this.keyDownMap.set(keyCode, [handler]);
        }
    }

    public static addKeyUpListener(keyCode: KeyCode, handler: ((event: KeyboardEvent) => void)): void {
        if (this.keyUpMap.has(keyCode)) {
            this.keyUpMap.get(keyCode).push(handler);
        }
        else {
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
    public static addClickListener(mouseButton: number, handler: ((event: MouseEvent) => void)): void {
        if (this.clickMap.has(mouseButton)) {
            this.clickMap.get(mouseButton).push(handler);
        }
        else {
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
    }

    public static getCursorPosition(event: MouseEvent): Vector2 {
        const rect = this.gameCanvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        return new Vector2(x, y);
    }

    private static invokeGenericEvent(event: Event): void {
        if (this.genericEventMap.has(<EventType>event.type)) {
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
            this.clickMap.get(event.button).forEach(handler => handler(event));
        }
    }
}