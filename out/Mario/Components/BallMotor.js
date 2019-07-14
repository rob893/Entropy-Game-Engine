import { Motor } from "./Motor";
import { RectangleCollider } from "../../GameEngine/Components/RectangleCollider";
import { GameEngine } from "../../GameEngine/Core/GameEngine";
import { Vector2 } from "../../GameEngine/Core/Vector2";
export class BallMotor extends Motor {
    constructor(gameObject) {
        super(gameObject);
        this.reset();
    }
    start() {
        super.start();
        this.collider = this.gameObject.getComponent(RectangleCollider);
        this.playerCollider = GameEngine.Instance.getGameObjectById("player").getComponent(RectangleCollider);
        this.computerCollider = GameEngine.Instance.getGameObjectById("computer").getComponent(RectangleCollider);
    }
    update() {
        super.update();
        this.handleCollisions();
    }
    whoIHit(other) {
        console.log("I hit " + other.gameObject.id);
    }
    handleOutOfBounds() {
        if (this.transform.position.y <= 0) {
            this.yVelocity *= -1;
        }
        else if (this.transform.position.y >= this.gameCanvas.height - this.transform.height) {
            this.yVelocity = Math.abs(this.yVelocity);
        }
        if (this.transform.position.x + this.transform.width <= 0) {
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
    handleCollisions() {
        if (this.collider.detectCollision(this.playerCollider)) {
            this.xVelocity = 1;
            this.speed += 0.125;
        }
        else if (this.collider.detectCollision(this.computerCollider)) {
            this.xVelocity = -1;
            this.speed += 0.125;
        }
    }
}
//# sourceMappingURL=BallMotor.js.map