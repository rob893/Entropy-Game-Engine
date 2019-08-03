import { Component } from '../../GameEngine/Components/Component';
import { GameManager } from './GameManager';
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
        GameManager.instance.showMessage('You were hit for ' + amount + ' damage!', 1, 'red');
        if (this._health <= 0) {
            this.die();
        }
    }
    die() {
        this._isDead = true;
        GameManager.instance.endGame();
        console.log('You are dead!');
    }
}
//# sourceMappingURL=PlayerHealth.js.map