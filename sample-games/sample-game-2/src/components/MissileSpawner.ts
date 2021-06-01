import { Component, GameObject, Vector2 } from '@entropy-engine/entropy-game-engine';
import { Missile } from '../game-objects/Missile';
import { BorderManager } from './BorderManager';
import { MissileMotor } from './MissileMotor';
import { ScoreManager } from './ScoreManager';

export class MissileSpawner extends Component {
  private timer: number = 0;

  private readonly borderManager: BorderManager;
  private readonly scoreManager: ScoreManager;

  public constructor(gameObject: GameObject, borderManager: BorderManager, scoreManager: ScoreManager) {
    super(gameObject);
    this.borderManager = borderManager;
    this.scoreManager = scoreManager;
  }

  public override update(): void {
    if (!this.scoreManager.playing) {
      return;
    }

    this.timer += this.time.deltaTime;

    if (this.timer > Math.max(5 - this.scoreManager.score / 100, 0.25)) {
      this.timer = 0;

      const { maxPossibleBorderHeight } = this.borderManager;
      const y =
        Math.random() * (this.gameCanvas.height - maxPossibleBorderHeight - maxPossibleBorderHeight) +
        maxPossibleBorderHeight;
      const missile = this.instantiate(Missile, new Vector2(this.gameCanvas.width, y));
      const missileMotor = missile.getComponent(MissileMotor);

      if (!missileMotor) {
        throw new Error('No missle motor on missile');
      }

      missileMotor.speed = 300 + (Math.random() * 100 * this.scoreManager.score) / this.scoreManager.progressDenom;
    }
  }
}
