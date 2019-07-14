import { Component } from "./Component";
import { Vector2 } from "../Core/Vector2";
import { Physics } from "../Core/Physics";
export class Rigidbody extends Component {
    constructor(gameObject, mass = 1) {
        super(gameObject);
        this.transform = gameObject.getTransform();
        this.mass = mass;
        this.velocity = new Vector2(0, 0);
        this.acceleration = new Vector2(0, 0);
        Physics.Instance.addRigidbody(this);
    }
    update() {
    }
    addForce(force) {
    }
    addGravity(force) {
    }
    updateVelocity() {
    }
}
//# sourceMappingURL=Rigidbody.js.map