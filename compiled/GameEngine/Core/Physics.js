export class Physics {
    constructor() {
        this.rigidbodies = [];
        this.colliders = [];
        this.gravity = 1;
    }
    static get Instance() {
        return this.instance || (this.instance = new Physics());
    }
    updatePhysics() {
        for (let i = 0, l = this.rigidbodies.length; i < l; i++) {
            this.rigidbodies[i].addGravity(this.gravity);
        }
    }
    addRigidbody(rb) {
        this.rigidbodies.push(rb);
    }
    static raycast() { }
    static sphereCast() { }
    static overlapSphere() { return []; }
}
//# sourceMappingURL=Physics.js.map