import { Motor } from './Motor';
import { RectangleCollider } from '../../GameEngine/Components/RectangleCollider';
import { GameObject } from '../../GameEngine/Core/GameObject';
import { Vector2 } from '../../GameEngine/Core/Helpers/Vector2';

export class BallMotor extends Motor {

    private readonly collider: RectangleCollider;
    private ready: boolean = true;


    public constructor(gameObject: GameObject, gameCanvas: HTMLCanvasElement, collider: RectangleCollider) {
        super(gameObject, gameCanvas);

        this.collider = collider;

        this.reset();
    }

    protected handleOutOfBounds(): void {
        if(this.transform.position.y <= 0) {
            this.yVelocity = Math.abs(this.yVelocity);
        }
        else if(this.transform.position.y >= this.gameCanvas.height - this.collider.height) {
            this.yVelocity *= -1;
        }

        if(this.transform.position.x + this.collider.width <= 0) {
            this.reset();
        }
        else if(this.transform.position.x >= this.gameCanvas.width) {
            this.reset();
        }
    }

    protected move(): void {
        this.transform.translate(new Vector2(this.xVelocity, this.yVelocity).multiplyScalar(this.speed));
    }

    private handleCollision(other: RectangleCollider): void {
        if (this.ready) {
            this.ready = false;
            this.speed += 0.125;
            const direction = Vector2.direction(other.transform.position, this.transform.position);
            
            this.xVelocity = direction.x;
            this.yVelocity = direction.y;

            setTimeout(() => {
                this.ready = true;
            }, 15);
        }
    }

    private reset(): void {
        this.transform.setPosition(345, 195);
        this.xVelocity = Math.random() < 0.5 ? -1 : 1;
        this.yVelocity = Math.random() < 0.5 ? -1 : 1;
        this.speed = 3;
    }
}