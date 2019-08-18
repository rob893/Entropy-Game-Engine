import { Component } from '../../GameEngine/Components/Component';
import { GameEngine } from '../../GameEngine/Core/GameEngine';
import { GameObject } from '../../GameEngine/Core/GameObject';

export abstract class Motor extends Component {

    protected gameCanvas: HTMLCanvasElement;
    protected xVelocity: number = 0;
    protected yVelocity: number = 0;
    protected speed: number = 5


    public constructor(gameObject: GameObject, gameCanvas: HTMLCanvasElement) {
        super(gameObject);
        
        this.gameCanvas = gameCanvas;
    }

    public update(): void {
        this.move();
        this.handleOutOfBounds();
    }

    protected abstract move(): void;

    protected abstract handleOutOfBounds(): void;
}