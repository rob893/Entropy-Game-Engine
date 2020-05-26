import { Component, Vector2, KeyCode } from '@entropy-engine/entropy-game-engine';

export class PlayerMotor extends Component {
  private dy: number = 0;

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
