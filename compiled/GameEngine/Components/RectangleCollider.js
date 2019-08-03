import { Vector2 } from '../Core/Helpers/Vector2';
import { Component } from './Component';
import { LiteEvent } from '../Core/Helpers/LiteEvent';
import { Rigidbody } from './Rigidbody';
import { Color } from '../Core/Enums/Color';
import { GameEngine } from '../Core/GameEngine';
export class RectangleCollider extends Component {
    constructor(gameObject, width, height) {
        super(gameObject);
        this._onCollided = new LiteEvent();
        this.width = width;
        this.height = height;
        const transform = this.transform;
        this._topLeft = new Vector2(transform.position.x - (width / 2), transform.position.y - height);
        this._topRight = new Vector2(transform.position.x + (width / 2), transform.position.y - height);
        this._bottomLeft = new Vector2(transform.position.x - (width / 2), transform.position.y);
        this._bottomRight = new Vector2(transform.position.x + (width / 2), transform.position.y);
        GameEngine.instance.physicsEngine.addCollider(this);
        GameEngine.instance.renderingEngine.addRenderableGizmo(this);
    }
    start() {
        this._attachedRigidbody = this.gameObject.hasComponent(Rigidbody) ? this.gameObject.getComponent(Rigidbody) : null;
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
    get center() {
        return new Vector2(this.topLeft.x + (this.width / 2), this.topLeft.y + (this.height / 2));
    }
    get attachedRigidbody() {
        return this._attachedRigidbody;
    }
    detectCollision(other) {
        if (!(other.topLeft.x > this.topRight.x ||
            other.topRight.x < this.topLeft.x ||
            other.topLeft.y > this.bottomLeft.y ||
            other.bottomLeft.y < this.topLeft.y)) {
            this._onCollided.trigger(other);
            return true;
        }
        return false;
    }
    get onCollided() {
        return this._onCollided.expose();
    }
    renderGizmo(context) {
        context.beginPath();
        context.moveTo(this.topLeft.x, this.topLeft.y);
        context.lineTo(this.bottomLeft.x, this.bottomLeft.y);
        context.lineTo(this.bottomRight.x, this.bottomRight.y);
        context.lineTo(this.topRight.x, this.topRight.y);
        context.lineTo(this.topLeft.x, this.topLeft.y);
        context.strokeStyle = Color.LightGreen;
        context.stroke();
    }
}
//# sourceMappingURL=RectangleCollider.js.map