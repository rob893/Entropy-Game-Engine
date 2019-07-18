import { Component } from "../../GameEngine/Components/Component";
export class PlayerHealth extends Component {
    constructor(gameObject, health = 100) {
        super(gameObject);
        this._health = health;
        this._isDead = false;
    }
    get health() {
        return this._health;
    }
    get isDead() {
        return this._isDead;
    }
    takeDamage(amount) {
        this._health -= amount;
        if (this._health <= 0) {
            this.die();
        }
    }
    die() {
        this._isDead = true;
        console.log('You are dead!');
    }
}
//# sourceMappingURL=PlayerHealth.js.map