import { Component } from '../../../../GameEngine/Components/Component';
import { Damageable } from '../../../Interfaces/Damageable';
import { GameObject } from '../../../../GameEngine/GameObjects/GameObject';
import { GameManager } from '../../GameManager';
import { AudioSource } from '../../../../GameEngine/Components/AudioSource';

export class PlayerHealth extends Component implements Damageable {

    private _health: number;
    private _isDead: boolean;
    private gameManager: GameManager | null = null;
    private readonly audioSource: AudioSource;
    

    public constructor(gameObject: GameObject, audioSource: AudioSource, health: number = 100) {
        super(gameObject);

        this._health = health;
        this._isDead = false;
        this.audioSource = audioSource;
    }

    public start(): void {
        const gm = this.findGameObjectById('gameManager');

        if (gm === null) {
            throw new Error('Cound not find game manager');
        }

        this.gameManager = gm.getComponent(GameManager);
    }

    public get health(): number {
        return this._health;
    }

    public get isDead(): boolean {
        return this._isDead;
    }

    public sayOuch(): void {
        this.audioSource.playOneShot();
    }

    public takeDamage(amount: number): void {
        this._health -= amount;

        if (this.gameManager !== null) {
            this.gameManager.showMessage('You were hit for ' + amount + ' damage!', 1, 'red'); 
        }

        if (this._health <= 0) {
            this.die();
        }
    }

    public die(): void {
        this._isDead = true;
        //this.gameManager.endGame();
        console.log('You are dead!');
    }
}