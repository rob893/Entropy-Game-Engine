import { Component } from '../../GameEngine/Components/Component';
import { Damageable } from '../Interfaces/Damageable';
import { GameObject } from '../../GameEngine/Core/GameObject';
import { GameManager } from './GameManager';

export class PlayerHealth extends Component implements Damageable {

    private _health: number;
    private _isDead: boolean;
    

    public constructor(gameObject: GameObject, health: number = 100) {
        super(gameObject);

        this._health = health;
        this._isDead = false;
    }

    public get health(): number {
        return this._health;
    }

    public get isDead(): boolean {
        return this._isDead;
    }

    public takeDamage(amount: number): void {
        this._health -= amount;

        GameManager.instance.showMessage('You were hit for ' + amount + ' damage!', 1, 'red');

        if (this._health <= 0) {
            this.die();
        }
    }

    public die(): void {
        this._isDead = true;
        GameManager.instance.endGame();
        console.log('You are dead!');
    }
}