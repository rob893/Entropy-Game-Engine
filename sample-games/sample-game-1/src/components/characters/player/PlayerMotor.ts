import {
  CollisionManifold,
  Component,
  EventType,
  GameObject,
  Key,
  Layer,
  RectangleCollider,
  Vector2
} from '@entropy-engine/entropy-game-engine';
import { CharacterAnimator } from '../CharacterAnimator';
import { CharacterStats } from '../CharacterStats';
import { Spawner } from '../../Spawner';
import { Fireball } from '../../../game-objects/Fireball';
import { FireballBehavior } from '../../FireballBehavior';
import { PlayerAnimator } from './PlayerAnimator';

export class PlayerMotor extends Component {
  public speed: number = 5;

  private xVelocity: -1 | 0 | 1 = 0;
  private yVelocity: -1 | 0 | 1 = 0;
  private jumping: boolean = false;
  private readonly animator: PlayerAnimator;
  private readonly collider: RectangleCollider;
  private readonly myStats: CharacterStats;

  public constructor(
    gameObject: GameObject,
    collider: RectangleCollider,
    animator: PlayerAnimator,
    myStats: CharacterStats
  ) {
    super(gameObject);

    this.collider = collider;
    this.animator = animator;
    this.myStats = myStats;

    this.collider.onCollided.add(manifold => this.handleCollisions(manifold));

    this.input.addKeyListener(EventType.KeyDown, Key.Space, () => this.jump());
    this.input.addKeyListener(EventType.KeyDown, 'r', () => this.fireball());
    this.input.addMouseListener(EventType.MouseDown, 0, () => this.meleeAttack());

    this.speed = 2;
  }

  public start(): void {
    const spawner = this.getComponent(Spawner);

    if (spawner !== null) {
      this.input.addKeyListener(EventType.KeyDown, Key.Backspace, () => spawner.toggleSpawn());
      this.input.addKeyListener(EventType.KeyDown, '0', () => spawner.stopSpawning());
      this.myStats.onDeath.add(() => spawner.stopSpawning());
    }
  }

  public update(): void {
    if (!this.myStats.isDead) {
      this.move();
    }
  }

  public get isMoving(): boolean {
    return this.xVelocity !== 0 || this.yVelocity !== 0;
  }

  private move(): void {
    if (this.input.getKey('d')) {
      this.xVelocity = 1;
    } else if (this.input.getKey('a')) {
      this.xVelocity = -1;
    } else {
      this.xVelocity = 0;
    }

    if (this.input.getKey('w')) {
      this.yVelocity = -1;
    } else if (this.input.getKey('s')) {
      this.yVelocity = 1;
    } else {
      this.yVelocity = 0;
    }

    this.animator.playRunAnimation(this.xVelocity, this.yVelocity);

    if (this.isMoving) {
      this.transform.translate(new Vector2(this.xVelocity, this.yVelocity).multiplyScalar(this.speed));
    } else {
      this.animator.playIdleAnimation();
    }
  }

  private handleCollisions(collisionManifold: CollisionManifold | undefined): void {
    if (collisionManifold === undefined) {
      throw new Error();
    }

    const other = collisionManifold.getOtherCollider(this.collider);

    if (other.isTrigger) {
      return;
    }

    const normal = collisionManifold.getCollisionNormalForCollider(this.collider);

    let moved = false;
    while (this.collider.detectCollision(other)) {
      this.transform.position.add(normal);
      moved = true;
    }

    if (moved) {
      this.transform.setPosition(this.transform.position.x, this.transform.position.y); //trigger the move event
    }
  }

  private meleeAttack(): void {
    // if (this.input.canvasMousePosition.x < this.transform.position.x) {
    //     this.animator.faceLeft();
    // }
    // else {
    //     this.animator.faceRight();
    // }

    this.animator.playRandomAttackAnimation();

    const colliders = this.physics.overlapSphere(this.transform.position, this.myStats.attackRange, Layer.Hostile);

    for (const collider of colliders) {
      const hitStats = collider.getComponent(CharacterStats);

      if (hitStats !== null) {
        hitStats.takeDamage(this.myStats.attackPower);
      }
    }
  }

  private fireball(): void {
    this.animator.playRandomAttackAnimation();
    const fireball = this.instantiate(Fireball, new Vector2(this.transform.position.x, this.transform.position.y - 20));
    const fbBehaviour = fireball.getComponent(FireballBehavior);

    if (fbBehaviour === null) {
      throw new Error('Invalid fb');
    }

    fbBehaviour.movementDirection = Vector2.direction(this.transform.position, this.input.canvasMousePosition);
  }

  private jump(): void {
    this.jumping = true;
    this.animator.playJumpAnimation();
  }
}
