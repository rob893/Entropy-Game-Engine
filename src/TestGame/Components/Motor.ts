import { Component } from '../../GameEngine/Components/Component';

export abstract class Motor extends Component {

    protected xVelocity: number = 0;
    protected yVelocity: number = 0;
    protected speed: number = 5


    public update(): void {
        this.move();
        this.handleOutOfBounds();
    }

    protected abstract move(): void;

    protected abstract handleOutOfBounds(): void;
}