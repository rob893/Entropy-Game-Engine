import { Component, Vector2, KeyCode, RectangleCollider } from '@entropy-engine/entropy-game-engine';
import { Explosion } from '../game-objects/Explosion';

export class PlayerMotor extends Component {
  private dy: number = 0;

  public start(): void {
    const collider = this.getComponent(RectangleCollider);

    if (!collider) {
      throw new Error('No collider attached to player');
    }

    collider.onCollided.add(() => {
      this.destroy(this.gameObject);
      this.instantiate(Explosion, this.transform.position);
    });
  }

  public update(): void {
    if (this.input.getKey(KeyCode.Space)) {
      this.dy -= 60 * this.time.deltaTime;
    } else {
      this.dy += 60 * this.time.deltaTime;
    }
    if (this.dy > 15) {
      this.dy = 15;
    }
    if (this.dy < -15) {
      this.dy = -15;
    }
    this.transform.translate(new Vector2(0, this.dy));
  }
}
