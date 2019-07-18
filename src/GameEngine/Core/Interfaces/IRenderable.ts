import { Component } from "../../Components/Component";

export interface IRenderable extends Component {
    render(context: CanvasRenderingContext2D): void;
}