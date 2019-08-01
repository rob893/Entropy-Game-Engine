import { Vector2 } from "../Helpers/Vector2";

export interface ICanvasMouseEvent extends MouseEvent {
    cursorPositionOnCanvas: Vector2;
}