import { Component } from "./Component";
import { Vector2 } from "../Core/Vector2";
import { LiteEvent } from "../Core/Helpers/LiteEvent";
export class Transform extends Component {
    constructor(gameObject, x, y, width, height) {
        super(gameObject);
        this.width = 0;
        this.height = 0;
        this.onMove = new LiteEvent();
        this.width = width;
        this.height = height;
        this.position = new Vector2(x, y);
        this.rotation = 0;
    }
    get onMoved() {
        return this.onMove.expose();
    }
    get center() {
        return new Vector2(this.position.x + (this.width / 2), this.position.y + (this.height / 2));
    }
    get bottomCenter() {
        return new Vector2(this.position.x + (this.width / 2), this.position.y + this.height);
    }
    translate(translation) {
        this.position.x += translation.x;
        this.position.y += (-1 * translation.y);
        this.onMove.trigger();
    }
    setPosition(x, y) {
        this.position.x = x;
        this.position.y = y;
        this.onMove.trigger();
    }
}
//# sourceMappingURL=Transform.js.map