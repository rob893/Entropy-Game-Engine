import { Component } from "../../GameEngine/Components/Component";
import { Transform } from "../../GameEngine/Components/Transform";
import { GameObject } from "../../GameEngine/Core/GameObject";
import { GameEngine } from "../../GameEngine/Core/GameEngine";

export abstract class Motor extends Component {

    protected transform: Transform;
    protected gameCanvas: HTMLCanvasElement;
    protected xVelocity: number = 0;
    protected yVelocity: number = 0;
    protected speed: number = 5


    public constructor(gameObject: GameObject) {
        super(gameObject);
        this.transform = gameObject.getTransform();
    }

    public start(): void {
        this.gameCanvas = GameEngine.instance.getGameCanvas();
    }

    public update(): void {
        this.move();
        this.handleOutOfBounds();
    }

    protected abstract move(): void;

    protected abstract handleOutOfBounds(): void;
}