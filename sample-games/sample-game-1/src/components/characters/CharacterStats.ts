import { Component, ISubscribable, GameObject, Topic, Slider } from '@entropy-engine/entropy-game-engine';
import type { IDamageable } from '../../types';
import { CharacterAnimator } from './CharacterAnimator';
import { PlayerAnimator } from './player/PlayerAnimator';

export class CharacterStats extends Component implements IDamageable {
  private readonly maxHealth = 100;

  private healthbar: Slider | null = null;

  private readonly animator: CharacterAnimator | PlayerAnimator;

  private readonly onDie: Topic<void> = new Topic<void>();

  readonly #attackRange = 75;

  readonly #attackPower = 15;

  readonly #attackSpeed = 1.25;

  #isDead = false;

  #health = 100;

  public constructor(gameObject: GameObject, animator: CharacterAnimator | PlayerAnimator) {
    super(gameObject);

    this.animator = animator;
  }

  public get attackPower(): number {
    return this.#attackPower;
  }

  public get attackRange(): number {
    return this.#attackRange;
  }

  public get attackSpeed(): number {
    return this.#attackSpeed;
  }

  public get isDead(): boolean {
    return this.#isDead;
  }

  public get health(): number {
    return this.#health;
  }

  public get onDeath(): ISubscribable<void> {
    return this.onDie;
  }

  public override start(): void {
    this.healthbar = this.getComponentInChildren(Slider);
  }

  public takeDamage(amount: number): void {
    this.#health -= amount;

    if (this.healthbar !== null) {
      this.healthbar.fillAmount = this.#health / this.maxHealth;
    }

    if (this.#health <= 0) {
      this.die();
    }
  }

  public die(): void {
    this.#isDead = true;
    this.animator.playDeathAnimation();
    this.destroy(this.gameObject, 3);
    this.onDie.publish();
  }
}
