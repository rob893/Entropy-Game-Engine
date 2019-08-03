import { Vector2 } from '../Helpers/Vector2';

export interface CanvasMouseEvent extends MouseEvent {
    cursorPositionOnCanvas: Vector2;
}