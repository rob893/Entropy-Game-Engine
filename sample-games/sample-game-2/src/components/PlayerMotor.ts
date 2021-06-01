import { Component, Key, MouseButton, RectangleCollider, Vector2 } from '@entropy-engine/entropy-game-engine';
import { Explosion } from '../game-objects/Explosion';
import { ScoreManager } from './ScoreManager';

export class PlayerMotor extends Component {
  private dy: number = 0;
  private scoreManager: ScoreManager | null = null;

  public override start(): void {
    const gameManager = this.findGameObjectById('gameManager');

    if (!gameManager) {
      throw new Error('No gameManager found');
    }

    this.scoreManager = gameManager.getComponent(ScoreManager);

    const collider = this.getComponent(RectangleCollider);

    if (!collider) {
      throw new Error('No collider attached to player');
    }

    collider.onCollided.subscribe(() => {
      this.destroy(this.gameObject);
      this.instantiate(Explosion, this.transform.position);
      this.invoke(() => this.sceneManager.loadScene(1), 3);
    });
  }

  public override update(): void {
    if (!this.scoreManager) {
      throw new Error('Scoremanager is null');
    }

    if (!this.scoreManager.playing) {
      return;
    }

    if (this.input.getKey(Key.Space) || this.input.getMouseButton(MouseButton.LeftMouseButton)) {
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
