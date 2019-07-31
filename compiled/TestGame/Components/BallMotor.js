import { Motor } from "./Motor";
import { RectangleCollider } from "../../GameEngine/Components/RectangleCollider";
import { Vector2 } from "../../GameEngine/Core/Helpers/Vector2";
export class BallMotor extends Motor {
    constructor(gameObject) {
        super(gameObject);
        this.ready = true;
        this.reset();
    }
    start() {
        super.start();
        this.collider = this.gameObject.getComponent(RectangleCollider);
        this.collider.onCollided.add((other) => this.handleCollision(other));
    }
    handleCollision(other) {
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
    handleOutOfBounds() {
        if (this.transform.position.y <= 0) {
            this.yVelocity = Math.abs(this.yVelocity);
        }
        else if (this.transform.position.y >= this.gameCanvas.height - this.collider.height) {
            this.yVelocity *= -1;
        }
        if (this.transform.position.x + this.collider.width <= 0) {
            this.reset();
        }
        else if (this.transform.position.x >= this.gameCanvas.width) {
            this.reset();
        }
    }
    move() {
        this.transform.translate(new Vector2(this.xVelocity, this.yVelocity).multiplyScalar(this.speed));
    }
    reset() {
        this.transform.setPosition(345, 195);
        this.xVelocity = Math.random() < 0.5 ? -1 : 1;
        this.yVelocity = Math.random() < 0.5 ? -1 : 1;
        this.speed = 3;
    }
}
//# sourceMappingURL=BallMotor.js.map