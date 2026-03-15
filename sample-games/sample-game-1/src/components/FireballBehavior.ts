import {
  CollisionManifold,
  Component,
  GameObject,
  RectangleCollider,
  Vector2
} from '@entropy-engine/entropy-game-engine';
import { Explosion } from '../game-objects/Explosion';

export class FireballBehavior extends Component {
  private readonly collider: RectangleCollider;

  #movementDirection: Vector2 = Vector2.zero;

  public constructor(gameObject: GameObject, collider: RectangleCollider) {
    super(gameObject);

    this.collider = collider;
    this.collider.onCollided.subscribe(manifold => this.hit(manifold));
  }

  public get movementDirection(): Vector2 {
    return this.#movementDirection.clone();
  }

  public set movementDirection(newDirection: Vector2) {
    this.#movementDirection = newDirection;
    this.transform.lookAt(this.input.canvasMousePosition);
    this.transform.rotation += 5;
  }

  public override update(): void {
    this.transform.translate(this.movementDirection.multiplyScalar(5));
  }

  private hit(manifold: CollisionManifold | undefined): void {
    if (manifold === undefined) {
      return;
    }

    if (manifold.getOtherCollider(this.collider).gameObject.name === 'player') {
      return;
    }

    this.instantiate(Explosion, this.transform.position);
    this.destroy(this.gameObject);
  }
}
