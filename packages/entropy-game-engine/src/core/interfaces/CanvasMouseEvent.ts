import { Vector2 } from '../helpers/Vector2';

export interface CanvasMouseEvent extends MouseEvent {
  cursorPositionOnCanvas: Vector2;
}
