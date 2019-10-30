import { Component } from '../../../GameEngine/Components/Component';
import { CharacterAnimator } from './CharacterAnimator';
import { GameObject } from '../../../GameEngine/Core/GameObject';
import { Damageable } from '../../Interfaces/Damageable';

export class CharacterStats extends Component implements Damageable {
    
    private readonly _attackRange = 75;
    private readonly _attackPower = 15;
    private readonly _attackSpeed = 1.25;
    private _isDead = false;
    private _health = 100;
    private readonly animator: CharacterAnimator;


    public constructor(gameObject: GameObject, animator: CharacterAnimator) {
        super(gameObject);

        this.animator = animator;
    }

    public get attackPower(): number {
        return this._attackPower;
    }

    public get attackRange(): number {
        return this._attackRange;
    }

    public get attackSpeed(): number {
        return this._attackSpeed;
    }

    public get isDead(): boolean {
        return this._isDead;
    }

    public get health(): number {
        return this._health;
    }

    public takeDamage(amount: number): void {
        this._health -= amount;

        if (this._health <= 0) {
            this.die();
        }
    }

    public die(): void {
        this._isDead = true;
        this.animator.playDeathAnimation();
        this.destroy(this.gameObject, 3);
    }
}