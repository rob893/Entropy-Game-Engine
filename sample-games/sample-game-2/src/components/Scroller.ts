import { Component, GameObject, Vector2 } from '@entropy-engine/entropy-game-engine';
import { ScoreManager } from './ScoreManager';

export class Scroller extends Component {
  public xScrollSpeed: number = 0;
  public yScrollSpeed: number = 0;

  private scoreManager: ScoreManager | null = null;

  public constructor(gameObject: GameObject, xScrollSpeed?: number, yScrollSpeed?: number) {
    super(gameObject);
    if (xScrollSpeed) {
      this.xScrollSpeed = xScrollSpeed;
    }

    if (yScrollSpeed) {
      this.yScrollSpeed = yScrollSpeed;
    }
  }

  public start(): void {
    const gameManager = this.findGameObjectById('gameManager');

    if (!gameManager) {
      throw new Error('No gameManager found.');
    }

    this.scoreManager = gameManager.getComponent(ScoreManager);
  }

  public update(): void {
    if (!this.scoreManager) {
      throw new Error('Score manager is null.');
    }

    if (!this.scoreManager.playing) {
      return;
    }

    this.transform.translate(new Vector2(this.xScrollSpeed, this.yScrollSpeed).multiplyScalar(this.time.deltaTime));
  }
}
