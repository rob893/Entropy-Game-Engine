import { Component, Vector2, RectangleCollider } from '@entropy-engine/entropy-game-engine';

export class MissileMotor extends Component {
  public speed: number = 350;

  public start(): void {
    const collider = this.getComponent(RectangleCollider);

    if (!collider) {
      throw new Error('No collider attached to player');
    }

    collider.onCollided.add(() => {
      this.destroy(this.gameObject);
    });
  }

  public update(): void {
    this.transform.translate(new Vector2(this.time.deltaTime * -this.speed, 0));

    if (this.transform.position.x < -100) {
      this.destroy(this.gameObject);
    }
  }
}
