export interface IDamageable {
    takeDamage(amount: number): void;
    die(): void;
    isDead: boolean;
    health: number;
}