import { Component, Vector2, KeyCode, RectangleCollider } from '@entropy-engine/entropy-game-engine';

export class PlayerMotor extends Component {
  private dy: number = 0;

  public start(): void {
    const collider = this.getComponent(RectangleCollider);

    if (!collider) {
      throw new Error('No collider attached to player');
    }

    collider.onCollided.add(() => {
      this.destroy(this.gameObject);
      console.log('Player is dead');
    });
  }

  public update(): void {
    if (this.input.getKey(KeyCode.Space)) {
      this.dy -= 1;
    } else {
      this.dy += 1;
    }

    if (this.dy > 14) {
      this.dy = 14;
    }

    if (this.dy < -14) {
      this.dy = -14;
    }

    this.transform.translate(new Vector2(0, this.dy));
  }
}
