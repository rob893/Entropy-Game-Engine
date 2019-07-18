import { Component } from "../../GameEngine/Components/Component";
import { IDamageable } from "../Interfaces/IDamageable";
import { GameObject } from "../../GameEngine/Core/GameObject";

export class PlayerHealth extends Component implements IDamageable {

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

        if (this._health <= 0) {
            this.die();
        }
    }

    public die(): void {
        this._isDead = true;
        console.log('You are dead!');
    }
}