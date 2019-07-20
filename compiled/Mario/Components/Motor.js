import { Component } from "../../GameEngine/Components/Component";
import { GameEngine } from "../../GameEngine/Core/GameEngine";
export class Motor extends Component {
    constructor() {
        super(...arguments);
        this.xVelocity = 0;
        this.yVelocity = 0;
        this.speed = 5;
    }
    start() {
        this.gameCanvas = GameEngine.instance.getGameCanvas();
    }
    update() {
        this.move();
        this.handleOutOfBounds();
    }
}
//# sourceMappingURL=Motor.js.map