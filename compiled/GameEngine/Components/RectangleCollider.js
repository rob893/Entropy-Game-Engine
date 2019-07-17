import { Vector2 } from "../Core/Vector2";
import { Component } from "./Component";
import { LiteEvent } from "../Core/Helpers/LiteEvent";
import { Physics } from "../Core/Physics";
export class RectangleCollider extends Component {
    constructor(gameObject, width, height) {
        super(gameObject);
        this.visualize = true;
        this.onCollide = new LiteEvent();
        this.width = width;
        this.height = height;
        this.transform = gameObject.getTransform();
        let transform = this.transform;
        transform.onMoved.add(() => this.onTransformMoved());
        this.topLeft = new Vector2(transform.position.x - (width / 2), transform.position.y - height);
        this.topRight = new Vector2(transform.position.x + (width / 2), transform.position.y - height);
        this.bottomLeft = new Vector2(transform.position.x - (width / 2), transform.position.y);
        this.bottomRight = new Vector2(transform.position.x + (width / 2), transform.position.y);
        Physics.Instance.addCollider(this);
    }
    start() {
        this.canvasContext = this.gameObject.getGameCanvas().getContext('2d');
    }
    update() {
        if (this.visualize) {
            this.drawCollider();
        }
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
    get center() {
        return new Vector2(this.topLeft.x + (this.width / 2), this.topLeft.y + (this.height / 2));
    }
    get onCollided() {
        return this.onCollide.expose();
    }
    onTransformMoved() {
        this.topLeft.x = this.transform.position.x - (this.width / 2);
        this.topLeft.y = this.transform.position.y - this.height;
        this.topRight.x = this.transform.position.x + (this.width / 2);
        this.topRight.y = this.transform.position.y - this.height;
        this.bottomLeft.x = this.transform.position.x - (this.width / 2);
        this.bottomLeft.y = this.transform.position.y;
        this.bottomRight.x = this.transform.position.x + (this.width / 2);
        this.bottomRight.y = this.transform.position.y;
    }
    drawCollider() {
        this.canvasContext.beginPath();
        this.canvasContext.moveTo(this.topLeft.x, this.topLeft.y);
        this.canvasContext.lineTo(this.bottomLeft.x, this.bottomLeft.y);
        this.canvasContext.lineTo(this.bottomRight.x, this.bottomRight.y);
        this.canvasContext.lineTo(this.topRight.x, this.topRight.y);
        this.canvasContext.lineTo(this.topLeft.x, this.topLeft.y);
        this.canvasContext.strokeStyle = '#2fff0f';
        this.canvasContext.stroke();
    }
}
//# sourceMappingURL=RectangleCollider.js.map