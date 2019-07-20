import { Motor } from "./Motor";
import { RectangleCollider } from "../../GameEngine/Components/RectangleCollider";
import { GameObject } from "../../GameEngine/Core/GameObject";
import { GameEngine } from "../../GameEngine/Core/GameEngine";
import { Vector2 } from "../../GameEngine/Core/Vector2";

export class BallMotor extends Motor {

    private collider: RectangleCollider;
    private ready: boolean = true;


    public constructor(gameObject: GameObject) {
        super(gameObject);

        this.reset();
    }

    public start(): void {
        super.start();
        
        this.collider = this.gameObject.getComponent<RectangleCollider>(RectangleCollider);

        this.collider.onCollided.add((other: RectangleCollider) => this.handleCollision(other));
    }

    private handleCollision(other: RectangleCollider): void {
        if (this.ready) {
            this.ready = false;
            this.speed += 0.125;
            let direction = Vector2.direction(other.transform.position, this.transform.position);
            
            this.xVelocity = direction.x;
            this.yVelocity = direction.y;

            setTimeout(() => {
                this.ready = true;
            }, 15);
        }
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

    private reset(): void {
        this.transform.setPosition(345, 195);
        this.xVelocity = Math.random() < 0.5 ? -1 : 1;
        this.yVelocity = Math.random() < 0.5 ? -1 : 1;
        this.speed = 3;
    }
}