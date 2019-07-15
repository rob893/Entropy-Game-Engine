import { Component } from "./Component";
import { Vector2 } from "../Core/Vector2";
import { Physics } from "../Core/Physics";
import { Time } from "../Core/Time";
export class Rigidbody extends Component {
    constructor(gameObject, mass = 70) {
        super(gameObject);
        this.isKinomatic = false;
        this.transform = gameObject.getTransform();
        this.mass = mass;
        this.velocity = new Vector2(0, 0);
        this.acceleration = new Vector2(0, 0);
        this.force = Vector2.zero;
        Physics.Instance.addRigidbody(this);
    }
    update() {
        if (this.isKinomatic) {
            return;
        }
        this.addGravity(665);
        this.velocity.add(this.force.divideScalar(this.mass));
        this.transform.translate(this.velocity);
    }
    addForce(force) {
        this.force.add(force);
    }
    addGravity(newtonsDown) {
        this.addForce(Vector2.down.multiplyScalar(newtonsDown).multiplyScalar(Time.DeltaTime));
    }
    resetForce() {
        this.force.zero();
        this.velocity.zero();
    }
}
//# sourceMappingURL=Rigidbody.js.map