import { Unsubscribable } from '../core/helpers/types';
import { Vector2 } from '../core/helpers/Vector2';
import { GameObject } from '../game-objects/GameObject';
import { Component } from './Component';
import { Transform } from './Transform';

export class Camera extends Component {
  private _zoom: number = 1;
  private currentFollowTarget: Transform | null = null;
  private currentFollowSub: Unsubscribable | null = null;
  private currentFollowDestroySub: Unsubscribable | null = null;

  public get zoom(): number {
    return this._zoom;
  }

  public set zoom(value: number) {
    if (value === 0) {
      throw new Error('Zoom cannot be 0.');
    }

    this._zoom = value;

    // const { x, y } = this.transform.position;

    // this.centerOn(new Vector2(-x + this.gameCanvas.width / 2, -y + this.gameCanvas.height / 2));
  }

  public screenPointToGameWorld(point: Vector2): Vector2 {
    return Vector2.subtract(point, this.transform.position).divideScalar(this.zoom);
  }

  public centerOn({ x, y }: Vector2): void {
    this.transform.setPosition(-x * this.zoom + this.gameCanvas.width / 2, -y * this.zoom + this.gameCanvas.height / 2);
  }

  public followTarget(target: GameObject | Transform): void {
    this.stopFollowingTarget();

    this.currentFollowTarget = target instanceof GameObject ? target.transform : target;

    const { position } = this.currentFollowTarget.transform;
    this.centerOn(position);

    this.currentFollowSub = this.currentFollowTarget.onMoved.subscribe(() => {
      if (!this.currentFollowTarget) {
        this.stopFollowingTarget();
        return;
      }

      const { position } = this.currentFollowTarget.transform;
      this.centerOn(position);
    });

    this.currentFollowDestroySub = this.currentFollowTarget.onDestroyed.subscribe(() => this.stopFollowingTarget());
  }

  public stopFollowingTarget(): void {
    if (this.currentFollowSub) {
      this.currentFollowSub.unsubscribe();
    }

    if (this.currentFollowDestroySub) {
      this.currentFollowDestroySub.unsubscribe();
    }

    this.currentFollowSub = null;
    this.currentFollowDestroySub = null;
    this.currentFollowTarget = null;
  }
}
