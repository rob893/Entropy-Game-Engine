import { Component } from "../../Components/Component";

export interface IRenderableGUI extends Component {
    renderGUI(context: CanvasRenderingContext2D): void;
}