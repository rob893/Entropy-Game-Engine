import { Vector2 } from './Vector2';
import { EventType } from '../enums/EventType';
import { CanvasMouseEvent } from '../interfaces/CanvasMouseEvent';
import { MouseButton } from '../enums/MouseButton';
import { Key } from '../enums';

export class Input {
  private boundingRect: ClientRect | DOMRect;
  private previousKeyHandled: string | null = null;
  private readonly gameCanvas: HTMLCanvasElement;
  private readonly keyMap = new Map<
    EventType.KeyDown | EventType.KeyUp,
    Map<string, ((event: KeyboardEvent) => void)[]>
  >();
  private readonly mouseMap = new Map<
    EventType.Click | EventType.MouseDown | EventType.MouseUp,
    Map<number, ((event: CanvasMouseEvent) => void)[]>
  >();
  private readonly genericEventMap = new Map<EventType, ((event: Event) => void)[]>();
  private readonly currentListeners = new Map<EventType, (event: Event) => void>();
  private readonly reservedEvents = new Set([EventType.Click, EventType.KeyDown, EventType.KeyUp]);
  private readonly keyDownSet = new Set<string>();
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
    return new Vector2(
      this.currentMousePosition.x - this.boundingRect.left,
      this.currentMousePosition.y - this.boundingRect.top
    );
  }

  public addEventListener(eventType: EventType, handler: (event: Event) => void): void {
    if (this.reservedEvents.has(eventType)) {
      console.error(eventType + ' is a reserved event. Please use the correct method to add a listener for it.');
      return;
    }

    const handlers = this.genericEventMap.get(eventType);
    if (handlers !== undefined) {
      handlers.push(handler);
    } else {
      if (!this.currentListeners.has(eventType)) {
        document.addEventListener(eventType, this.invokeGenericHandlers);
        this.currentListeners.set(eventType, this.invokeGenericHandlers);
      }

      this.genericEventMap.set(eventType, [handler]);
    }
  }

  public addKeyListener(
    type: EventType.KeyUp | EventType.KeyDown,
    keys: string | Key | string[] | Key[],
    handler: (event: KeyboardEvent) => void
  ): void {
    if (!this.currentListeners.has(type)) {
      document.addEventListener(type, this.invokeKeyHandlers);
      this.currentListeners.set(type, this.invokeKeyHandlers);
    }

    if (!this.keyMap.has(type)) {
      this.keyMap.set(type, new Map<string, ((event: KeyboardEvent) => void)[]>());
    }

    if (typeof keys === 'string') {
      keys = [keys];
    }

    for (const key of keys) {
      const keyMap = this.keyMap.get(type);

      if (keyMap === undefined) {
        throw new Error('Invalid key');
      }

      const handlers = keyMap.get(key);
      if (handlers !== undefined) {
        handlers.push(handler);
      } else {
        keyMap.set(key, [handler]);
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
  public addMouseListener(
    type: EventType.MouseDown | EventType.MouseUp | EventType.Click,
    mouseButton: 0 | 1 | 2 | MouseButton,
    handler: (event: CanvasMouseEvent) => void
  ): void {
    if (!this.currentListeners.has(type)) {
      document.addEventListener(type, this.invokeMouseHandlers);
      this.currentListeners.set(type, this.invokeMouseHandlers);
    }

    if (!this.mouseMap.has(type)) {
      this.mouseMap.set(type, new Map<number, ((event: CanvasMouseEvent) => void)[]>());
    }

    const mouseButtonMap = this.mouseMap.get(type);

    if (mouseButtonMap === undefined) {
      throw new Error('Missing type');
    }

    if (mouseButtonMap.has(mouseButton)) {
      const handlers = mouseButtonMap.get(mouseButton);

      if (handlers !== undefined) {
        handlers.push(handler);
      }
    } else {
      mouseButtonMap.set(mouseButton, [handler]);
    }
  }

  /**
   * This function will return true if the passed in key is currently being pressed.
   *
   * @param key The key to check if it is currently being pressed.
   * @example if (Input.getKey('j)) { console.log('J is being pressed'); }
   */
  public getKey(key: string | Key): boolean {
    return this.keyDownSet.has(key);
  }

  public getMouseButton(mouseButton: 0 | 1 | 2 | MouseButton): boolean {
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

  /**
   * This is needed in this syntax (name = () =>) in order to keep a reference to this correctly.
   * When defined as a normal class function and passed in without using an arrow function, this is lost.
   * The reference needs to be kept to this function in order to remove the event listener, so anonymous arrow
   * functions cannot be used.
   */
  private readonly invokeGenericHandlers = (event: Event): void => {
    const handlers = this.genericEventMap.get(event.type as EventType);
    if (handlers !== undefined) {
      handlers.forEach(handler => handler(event));
    }
  };

  private readonly invokeKeyHandlers = (event: Event): void => {
    if (!(event instanceof KeyboardEvent)) {
      console.error('Invalid event');
      return;
    }

    const eventType = event.type as EventType.KeyUp | EventType.KeyDown;

    if (eventType === EventType.KeyDown) {
      //Handle autofiring of event when key is held down. We want to only fire once per keydown.
      if (this.previousKeyHandled === event.key) {
        return;
      }

      this.previousKeyHandled = event.key;
    }

    if (!this.keyMap.has(eventType)) {
      return;
    }

    const keyMap = this.keyMap.get(eventType);

    if (keyMap === undefined) {
      throw new Error('Invalid event type.');
    }

    const handlers = keyMap.get(event.key);
    if (handlers !== undefined) {
      handlers.forEach(handler => handler(event));
    }
  };

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

    const mouseButtonMap = this.mouseMap.get(eventType);

    if (mouseButtonMap === undefined) {
      throw new Error('Invalid event type');
    }

    const handlers = mouseButtonMap.get(event.button);
    if (handlers !== undefined) {
      handlers.forEach(handler => handler(canvasMouseEvent));
    }
  };

  private readonly updateCursorPosition = (event: MouseEvent): void => {
    this.currentMousePosition.x = event.clientX;
    this.currentMousePosition.y = event.clientY;
  };

  private readonly updateKeyDownSet = (event: KeyboardEvent): void => {
    if (event.type === 'keydown') {
      this.keyDownSet.add(event.key);
    } else if (event.type === 'keyup') {
      this.previousKeyHandled = null;
      this.keyDownSet.delete(event.key);
    }
  };

  private readonly updateMouseDownSet = (event: MouseEvent): void => {
    if (event.type === 'mousedown') {
      this.mouseButtonDownSet.add(event.button);
    } else if (event.type === 'mouseup') {
      this.mouseButtonDownSet.delete(event.button);
    }
  };

  private readonly updateBoundingClientRect = (): void => {
    this.boundingRect = this.gameCanvas.getBoundingClientRect();
  };
}
