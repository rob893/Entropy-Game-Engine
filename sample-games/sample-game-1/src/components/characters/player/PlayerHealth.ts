import { AudioSource, Component, GameObject } from '@entropy-engine/entropy-game-engine';
import type { IDamageable } from '../../../types';
import { GameManager } from '../../GameManager';

export class PlayerHealth extends Component implements IDamageable {
  private gameManager: GameManager | null = null;

  private readonly audioSource: AudioSource;

  #health: number;

  #isDead: boolean;

  public constructor(gameObject: GameObject, audioSource: AudioSource, health: number = 100) {
    super(gameObject);

    this.#health = health;
    this.#isDead = false;
    this.audioSource = audioSource;
  }

  public get health(): number {
    return this.#health;
  }

  public get isDead(): boolean {
    return this.#isDead;
  }

  public override start(): void {
    const gm = this.findGameObjectWithTag('gameManager');

    if (gm === null) {
      throw new Error('Cound not find game manager');
    }

    this.gameManager = gm.getComponent(GameManager);
  }

  public sayOuch(): void {
    this.audioSource.playOneShot();
  }

  public takeDamage(amount: number): void {
    this.#health -= amount;

    if (this.gameManager !== null) {
      this.gameManager.showMessage(`You were hit for ${amount} damage!`, 1, 'red');
    }

    if (this.#health <= 0) {
      this.die();
    }
  }

  public die(): void {
    this.#isDead = true;
    //this.gameManager.endGame();
    console.log('You are dead!');
  }
}
