import { Component } from "../../Components/Component";

export interface IRenderableGizmo extends Component {
    renderGizmo(context: CanvasRenderingContext2D): void;
}