import { Component } from '../../GameEngine/Components/Component';
import { Damageable } from '../Interfaces/Damageable';
import { GameObject } from '../../GameEngine/Core/GameObject';
import { GameManager } from './GameManager';
import { ObjectManager } from '../../GameEngine/Core/Helpers/ObjectManager';
import { AudioSource } from '../../GameEngine/Components/AudioSource';

export class PlayerHealth extends Component implements Damageable {

    private _health: number;
    private _isDead: boolean;
    private gameManager: GameManager;
    private readonly objectManager: ObjectManager;
    private readonly audioSource: AudioSource;
    

    public constructor(gameObject: GameObject, objectManager: ObjectManager, audioSource: AudioSource, health: number = 100) {
        super(gameObject);

        this._health = health;
        this.objectManager = objectManager;
        this._isDead = false;
        this.audioSource = audioSource;
    }

    public start(): void {
        this.gameManager = this.objectManager.findGameObjectById('gameManager').getComponent(GameManager);
    }

    public get health(): number {
        return this._health;
    }

    public get isDead(): boolean {
        return this._isDead;
    }

    public sayOuch(): void {
        this.audioSource.play();
    }

    public takeDamage(amount: number): void {
        this._health -= amount;

        this.gameManager.showMessage('You were hit for ' + amount + ' damage!', 1, 'red');

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