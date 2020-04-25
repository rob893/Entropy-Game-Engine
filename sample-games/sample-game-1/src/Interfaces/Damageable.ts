export interface Damageable {
  isDead: boolean;
  health: number;
  takeDamage(amount: number): void;
  die(): void;
}
