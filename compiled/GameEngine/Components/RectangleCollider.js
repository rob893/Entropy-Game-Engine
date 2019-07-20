import { Vector2 } from "../Core/Vector2";
import { Component } from "./Component";
import { LiteEvent } from "../Core/Helpers/LiteEvent";
import { PhysicsEngine } from "../Core/PhysicsEngine";
import { RenderingEngine } from "../Core/RenderingEngine";
export class RectangleCollider extends Component {
    constructor(gameObject, width, height) {
        super(gameObject);
        this.onCollide = new LiteEvent();
        this.width = width;
        this.height = height;
        let transform = this.transform;
        this._topLeft = new Vector2(transform.position.x - (width / 2), transform.position.y - height);
        this._topRight = new Vector2(transform.position.x + (width / 2), transform.position.y - height);
        this._bottomLeft = new Vector2(transform.position.x - (width / 2), transform.position.y);
        this._bottomRight = new Vector2(transform.position.x + (width / 2), transform.position.y);
        PhysicsEngine.instance.addCollider(this);
        RenderingEngine.instance.addRenderableGizmo(this);
    }
    get topLeft() {
        this._topLeft.x = this.transform.position.x - (this.width / 2);
        this._topLeft.y = this.transform.position.y - this.height;
        return this._topLeft;
    }
    get topRight() {
        this._topRight.x = this.transform.position.x + (this.width / 2);
        this._topRight.y = this.transform.position.y - this.height;
        return this._topRight;
    }
    get bottomLeft() {
        this._bottomLeft.x = this.transform.position.x - (this.width / 2);
        this._bottomLeft.y = this.transform.position.y;
        return this._bottomLeft;
    }
    get bottomRight() {
        this._bottomRight.x = this.transform.position.x + (this.width / 2);
        this._bottomRight.y = this.transform.position.y;
        return this._bottomRight;
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
    renderGizmo(context) {
        context.beginPath();
        context.moveTo(this.topLeft.x, this.topLeft.y);
        context.lineTo(this.bottomLeft.x, this.bottomLeft.y);
        context.lineTo(this.bottomRight.x, this.bottomRight.y);
        context.lineTo(this.topRight.x, this.topRight.y);
        context.lineTo(this.topLeft.x, this.topLeft.y);
        context.strokeStyle = '#2fff0f';
        context.stroke();
    }
}
//# sourceMappingURL=RectangleCollider.js.map