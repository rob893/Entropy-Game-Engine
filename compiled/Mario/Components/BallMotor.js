import { Motor } from "./Motor";
import { RectangleCollider } from "../../GameEngine/Components/RectangleCollider";
import { GameEngine } from "../../GameEngine/Core/GameEngine";
import { Vector2 } from "../../GameEngine/Core/Vector2";
export class BallMotor extends Motor {
    constructor(gameObject) {
        super(gameObject);
        this.ready = true;
        this.reset();
    }
    start() {
        super.start();
        this.collider = this.gameObject.getComponent(RectangleCollider);
        this.playerCollider = GameEngine.instance.getGameObjectById("player").getComponent(RectangleCollider);
        this.computerCollider = GameEngine.instance.getGameObjectById("computer").getComponent(RectangleCollider);
        this.collider.onCollided.add((other) => this.handleCollision(other));
    }
    update() {
        super.update();
        this.detectCollisions();
    }
    handleCollision(other) {
        if (this.ready) {
            this.ready = false;
            this.xVelocity *= -1;
            this.speed += 0.125;
            setTimeout(() => {
                this.ready = true;
            }, 250);
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
    detectCollisions() {
        this.collider.detectCollision(this.playerCollider);
        this.collider.detectCollision(this.computerCollider);
    }
}
//# sourceMappingURL=BallMotor.js.map