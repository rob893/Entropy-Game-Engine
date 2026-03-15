import 'vitest-canvas-mock';
import { EventType } from '../enums/EventType';
import { Input } from '../helpers/Input';

const dispatchKeyboardEvent = (type: 'keydown' | 'keyup', key: string): void => {
  document.dispatchEvent(new KeyboardEvent(type, { key, bubbles: true }));
};

const dispatchMouseEvent = (
  type: 'mousedown' | 'mouseup' | 'mousemove',
  options: MouseEventInit = {}
): void => {
  document.dispatchEvent(new MouseEvent(type, { bubbles: true, ...options }));
};

describe('Input', () => {
  let canvas: HTMLCanvasElement;
  let input: Input;

  beforeEach(() => {
    canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    input = new Input(canvas);
  });

  afterEach(() => {
    input.clearListeners();
    canvas.remove();
    vi.restoreAllMocks();
  });

  it('returns false initially for keys that have not been pressed', () => {
    expect(input.getKey('a')).toBe(false);
    expect(input.getKey('Enter')).toBe(false);
  });

  it('tracks keydown and keyup events', () => {
    dispatchKeyboardEvent('keydown', 'a');
    expect(input.getKey('a')).toBe(true);

    dispatchKeyboardEvent('keyup', 'a');
    expect(input.getKey('a')).toBe(false);
  });

  it('tracks mousedown and mouseup events', () => {
    dispatchMouseEvent('mousedown', { button: 0 });
    expect(input.getMouseButton(0)).toBe(true);

    dispatchMouseEvent('mouseup', { button: 0 });
    expect(input.getMouseButton(0)).toBe(false);
  });

  it('registers generic event listeners that fire on matching events', () => {
    const handler = vi.fn();

    input.addEventListener(EventType.MouseMove, handler);
    dispatchMouseEvent('mousemove', { clientX: 12, clientY: 34 });

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(expect.any(MouseEvent));
  });

  it('fires key listeners for the specified keys only', () => {
    const handler = vi.fn();

    input.addKeyListener(EventType.KeyDown, 'a', handler);
    dispatchKeyboardEvent('keydown', 'b');
    dispatchKeyboardEvent('keydown', 'a');

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(expect.objectContaining({ key: 'a' }));
  });

  it('clears all listeners and stops tracking future input', () => {
    const genericHandler = vi.fn();
    const keyHandler = vi.fn();

    input.addEventListener(EventType.MouseMove, genericHandler);
    input.addKeyListener(EventType.KeyDown, 'a', keyHandler);
    input.clearListeners();

    dispatchMouseEvent('mousemove', { clientX: 10, clientY: 20 });
    dispatchMouseEvent('mousedown', { button: 0 });
    dispatchKeyboardEvent('keydown', 'a');

    expect(genericHandler).not.toHaveBeenCalled();
    expect(keyHandler).not.toHaveBeenCalled();
    expect(input.getMouseButton(0)).toBe(false);
    expect(input.getKey('a')).toBe(false);
  });
});
