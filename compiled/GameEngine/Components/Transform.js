import { Component } from "./Component";
import { Vector2 } from "../Core/Vector2";
import { LiteEvent } from "../Core/Helpers/LiteEvent";
export class Transform extends Component {
    constructor(gameObject, x, y) {
        super(gameObject);
        this.onMove = new LiteEvent();
        this.position = new Vector2(x, y);
        this.rotation = 0;
        this.scale = Vector2.one;
    }
    get onMoved() {
        return this.onMove.expose();
    }
    translate(translation) {
        this.position.add(translation);
        this.onMove.trigger();
    }
    setPosition(x, y) {
        this.position.x = x;
        this.position.y = y;
        this.onMove.trigger();
    }
}
//# sourceMappingURL=Transform.js.map