import { Vector2 } from "../Core/Vector2";
import { Component } from "./Component";
import { LiteEvent } from "../Core/Helpers/LiteEvent";
import { Physics } from "../Core/Physics";
export class RectangleCollider extends Component {
    constructor(gameObject) {
        super(gameObject);
        this.onCollide = new LiteEvent();
        this.transform = gameObject.getTransform();
        let transform = this.transform;
        transform.onMoved.add(() => this.onTransformMoved());
        this.topLeft = new Vector2(transform.position.x, transform.position.y);
        this.topRight = new Vector2(transform.position.x + transform.width, transform.position.y);
        this.bottomLeft = new Vector2(transform.position.x, transform.position.y + transform.height);
        this.bottomRight = new Vector2(transform.position.x + transform.width, transform.position.y + transform.height);
        Physics.Instance.addCollider(this);
    }
    detectCollision(other) {
        if (!(other.topLeft.x > this.topRight.x ||
            other.topRight.x < this.topLeft.x ||
            other.topLeft.y > this.bottomLeft.y ||
            other.bottomLeft.y < this.topLeft.y)) {
            this.onCollide.trigger(other);
            return true;
        }
        return false;
    }
    get onCollided() {
        return this.onCollide.expose();
    }
    onTransformMoved() {
        this.topLeft.x = this.transform.position.x;
        this.topLeft.y = this.transform.position.y;
        this.topRight.x = this.transform.position.x + this.transform.width;
        this.topRight.y = this.transform.position.y;
        this.bottomLeft.x = this.transform.position.x;
        this.bottomLeft.y = this.transform.position.y + this.transform.height;
        this.bottomRight.x = this.transform.position.x + this.transform.width;
        this.bottomRight.y = this.transform.position.y + this.transform.height;
    }
}
//# sourceMappingURL=RectangleCollider.js.map