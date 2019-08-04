import { Motor } from './Motor';
import { GameEngine } from '../../GameEngine/Core/GameEngine';
import { Time } from '../../GameEngine/Core/Time';
import { Vector2 } from '../../GameEngine/Core/Helpers/Vector2';
import { RectangleCollider } from '../../GameEngine/Components/RectangleCollider';
export class ComputerMotor extends Motor {
    constructor(gameObject) {
        super(gameObject);
        this.timer = 0;
        this.yVelocity = 1;
    }
    start() {
        super.start();
        this.collider = this.gameObject.getComponent(RectangleCollider);
        this.ballTransform = GameEngine.instance.findGameObjectById('ball').transform;
        this.quarterFieldX = this.gameCanvas.width / 4;
        this.midFieldY = this.gameCanvas.height / 2;
    }
    handleOutOfBounds() {
        if (this.transform.position.y <= 0) {
            this.yVelocity = 1;
        }
        else if (this.transform.position.y >= this.gameCanvas.height - this.collider.height) {
            this.yVelocity = -1;
        }
    }
    move() {
        if (this.ballTransform.position.x < this.quarterFieldX) {
            if (this.transform.position.y > this.midFieldY + 5) {
                this.yVelocity = -1;
            }
            else if (this.transform.position.y < this.midFieldY - 5) {
                this.yVelocity = 1;
            }
            else {
                this.yVelocity = 0;
            }
        }
        else {
            this.timer += Time.DeltaTime;
            if (this.timer > 0.15) {
                if (this.collider.center.y < this.ballTransform.position.y - 10) {
                    this.yVelocity = 1;
                }
                else if (this.collider.center.y > this.ballTransform.position.y + 10) {
                    this.yVelocity = -1;
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