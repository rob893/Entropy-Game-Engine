/**
 * Enum of common dom events.
 * Info gathered from https://developer.mozilla.org/en-US/docs/Web/Events
 */
export enum EventType {
    /** ANY key is pressed */
    KeyDown = 'keydown',

    /** ANY key is released */
    KeyUp = 'keyup',

    /** ANY key except Shift, Fn, CapsLock is in pressed position. (Fired continously.) */
    KeyPress = 'keypress',

    /** A pointing device button (ANY non-primary button) has been pressed and released on an element. */
    AuxClick = 'auxclick',

    /** A pointing device button (ANY button; soon to be primary button only) has been pressed and released on an element. */
    Click = 'click',

    /** The right button of the mouse is clicked (before the context menu is displayed). */
    ContextMenu = 'contextmenu',

    /** A pointing device button is clicked twice on an element. */
    DoubleClick = 'dblclick',

    /** A pointing device button is pressed on an element. */
    MouseDown = 'mousedown',

    /** A pointing device is moved onto the element that has the listener attached. */
    MouseEnter = 'mouseenter',

    /** A pointing device is moved off the element that has the listener attached. */
    MouseLeave = 'mouseleave',

    /** A pointing device is moved over an element. (Fired continously as the mouse moves.) */
    MouseMove = 'mousemove',

    /** A pointing device is moved onto the element that has the listener attached or onto one of its children. */
    MouseOver = 'mouseover',

    /** A pointing device is moved off the element that has the listener attached or off one of its children. */
    MouseOut = 'mouseout',

    /** A pointing device button is released over an element. */
    MouseUp = 'mouseup',

    /** The pointer was locked or released. */
    PointerLockChange = 'pointerlockchange',

    /** It was impossible to lock the pointer for technical reasons or because the permission was denied. */
    PointerLockError = 'pointerlockerror',

    /** Some text is being selected. */
    Select = 'select',

    /** A wheel button of a pointing device is rotated in any direction. */
    Wheel = 'wheel'
}