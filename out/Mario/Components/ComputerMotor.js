import { Motor } from "./Motor";
import { GameEngine } from "../../GameEngine/Core/GameEngine";
import { Time } from "../../GameEngine/Core/Time";
import { Vector2 } from "../../GameEngine/Core/Vector2";
export class ComputerMotor extends Motor {
    constructor(gameObject) {
        super(gameObject);
        this.timer = 0;
        this.yVelocity = 1;
    }
    start() {
        super.start();
        this.ballTransform = GameEngine.Instance.getGameObjectById("ball").getTransform();
        this.quarterFieldX = this.gameCanvas.width / 4;
        this.midFieldY = this.gameCanvas.height / 2;
    }
    handleOutOfBounds() {
        if (this.transform.position.y <= 0) {
            this.yVelocity = -1;
        }
        else if (this.transform.position.y >= this.gameCanvas.height - this.transform.height) {
            this.yVelocity = 1;
        }
    }
    move() {
        if (this.ballTransform.position.x < this.quarterFieldX) {
            if (this.transform.position.y > this.midFieldY + 5) {
                this.yVelocity = 1;
            }
            else if (this.transform.position.y < this.midFieldY - 5) {
                this.yVelocity = -1;
            }
            else {
                this.yVelocity = 0;
            }
        }
        else {
            this.timer += Time.DeltaTime;
            if (this.timer > 0.15) {
                if (this.transform.center.y < this.ballTransform.center.y - 10) {
                    this.yVelocity = -1;
                }
                else if (this.transform.center.y > this.ballTransform.center.y + 10) {
                    this.yVelocity = 1;
                }
                else {
                    this.yVelocity = 0;
                }
                this.timer = 0;
            }
        }
        this.transform.translate(new Vector2(this.xVelocity, this.yVelocity).multiplyScalar(this.speed));
    }
}
//# sourceMappingURL=ComputerMotor.js.map