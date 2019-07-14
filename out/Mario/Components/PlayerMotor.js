import { Motor } from "./Motor";
import { Vector2 } from "../../GameEngine/Core/Vector2";
import { Keys } from "../../GameEngine/Core/Helpers/Keys";
export class PlayerMotor extends Motor {
    constructor(gameObject) {
        super(gameObject);
        this.movingUp = false;
        this.movingDown = false;
        this.movingRight = false;
        this.movingLeft = false;
        document.addEventListener('keydown', () => this.onKeyDown(event));
        document.addEventListener('keyup', () => this.onKeyUp(event));
    }
    get isMoving() {
        return this.xVelocity !== 0 || this.yVelocity !== 0;
    }
    handleOutOfBounds() {
        if (this.transform.position.y <= 0) {
            this.transform.position.y = 0;
        }
        else if (this.transform.position.y + this.transform.height >= this.gameCanvas.height) {
            this.transform.position.y = this.gameCanvas.height - this.transform.height;
        }
        if (this.transform.position.x <= 0) {
            this.transform.position.x = 0;
        }
        else if (this.transform.position.x + this.transform.width >= this.gameCanvas.width) {
            this.transform.position.x = this.gameCanvas.width - this.transform.width;
        }
    }
    move() {
        if (this.movingUp) {
            this.yVelocity = 1;
        }
        else if (this.movingDown) {
            this.yVelocity = -1;
        }
        else {
            this.yVelocity = 0;
        }
        if (this.movingRight) {
            this.xVelocity = 1;
        }
        else if (this.movingLeft) {
            this.xVelocity = -1;
        }
        else {
            this.xVelocity = 0;
        }
        if (this.isMoving) {
            this.transform.translate(new Vector2(this.xVelocity, this.yVelocity).multiplyScalar(this.speed));
        }
    }
    jump() {
    }
    onKeyDown(event) {
        if (event.keyCode == Keys.UP || event.keyCode == Keys.W) {
            this.movingUp = true;
            this.movingDown = false;
        }
        else if (event.keyCode == Keys.DOWN || event.keyCode == Keys.S) {
            this.movingDown = true;
            this.movingUp = false;
        }
        if (event.keyCode == Keys.RIGHT || event.keyCode == Keys.D) {
            this.movingRight = true;
            this.movingLeft = false;
        }
        else if (event.keyCode == Keys.LEFT || event.keyCode == Keys.A) {
            this.movingRight = false;
            this.movingLeft = true;
        }
    }
    onKeyUp(event) {
        if (event.keyCode == Keys.UP || event.keyCode == Keys.W) {
            this.movingUp = false;
        }
        else if (event.keyCode == Keys.DOWN || event.keyCode == Keys.S) {
            this.movingDown = false;
        }
        if (event.keyCode == Keys.RIGHT || event.keyCode == Keys.D) {
            this.movingRight = false;
        }
        else if (event.keyCode == Keys.LEFT || event.keyCode == Keys.A) {
            this.movingLeft = false;
        }
    }
}
//# sourceMappingURL=PlayerMotor.js.map