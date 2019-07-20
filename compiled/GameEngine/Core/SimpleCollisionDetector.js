import { LiteEvent } from "./LiteEvent";
export class SimpleCollisionDetector {
    constructor() {
        this._onCollisionDetected = new LiteEvent();
        this._colliders = [];
    }
    get colliders() {
        return this._colliders;
    }
    get onCollisionDetected() {
        return this._onCollisionDetected.expose();
    }
    detectCollisions() {
        for (let i = 0, l = this._colliders.length; i < l; i++) {
            if (!this._colliders[i].enabled) {
                continue;
            }
            for (let j = 0; j < l; j++) {
                if (this._colliders[i] !== this._colliders[j] && this._colliders[i].detectCollision(this._colliders[j])) {
                    this._onCollisionDetected.trigger(this._colliders[i], this._colliders[j]);
                }
            }
        }
    }
    addCollider(collider) {
        this._colliders.push(collider);
    }
    addColliders(colliders) {
        colliders.forEach(c => this.addCollider(c));
    }
}
//# sourceMappingURL=SimpleCollisionDetector.js.map