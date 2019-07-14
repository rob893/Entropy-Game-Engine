import { GameObject } from "../../GameEngine/Core/GameObject";
import { RectangleCollider } from "../../GameEngine/Components/RectangleCollider";
import { BallMotor } from "../Components/BallMotor";
import { RectangleRenderer } from "../../GameEngine/Components/RectangleRenderer";
export class Ball extends GameObject {
    constructor(id) {
        super(id, 345, 195, 10, 10);
        let ballComponents = [];
        ballComponents.push(new RectangleCollider(this));
        ballComponents.push(new BallMotor(this));
        ballComponents.push(new RectangleRenderer(this, "white"));
        this.setComponents(ballComponents);
    }
}
//# sourceMappingURL=Ball.js.map