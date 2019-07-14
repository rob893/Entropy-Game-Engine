import { Component } from "../../GameEngine/Components/Component";
export class Motor extends Component {
    constructor(gameObject) {
        super(gameObject);
        this.xVelocity = 0;
        this.yVelocity = 0;
        this.speed = 5;
        this.transform = gameObject.getTransform();
    }
    start() {
        this.gameCanvas = this.gameObject.getGameCanvas();
    }
    update() {
        this.move();
        this.handleOutOfBounds();
    }
}
//# sourceMappingURL=Motor.js.map