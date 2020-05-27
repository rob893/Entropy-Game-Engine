import { Component, Vector2, RectangleCollider } from '@entropy-engine/entropy-game-engine';
import { Border } from '../game-objects/Border';

export class BorderManager extends Component {
  private readonly topBorders: Border[] = [];
  private readonly bottomBorders: Border[] = [];

  public start(): void {
    const w = this.gameCanvas.width + 50;

    let currX = -50;

    while (currX <= w) {
      const topBorder = this.instantiate(Border, new Vector2(currX, 100));
      const borderCollider = topBorder.getComponent(RectangleCollider);

      if (!borderCollider) {
        throw new Error('No collider attached to border');
      }

      currX += borderCollider.width + 5;

      if (topBorder instanceof Border) {
        this.topBorders.push(topBorder);
      }
    }
  }

  public update(): void {
    for (let i = this.topBorders.length - 1; i >= 0; i--) {
      const border = this.topBorders[i];
      if (border.transform.position.x < -100) {
        this.topBorders.splice(i, 1);
        this.destroy(border);
      }
    }

    const lastBorder = this.topBorders.reduce((prev, curr) =>
      prev.transform.position.x > curr.transform.position.x ? prev : curr
    );
    const lastCollider = lastBorder.getComponent(RectangleCollider);

    if (!lastCollider) {
      throw new Error('No collider on border');
    }

    let currX = lastCollider.bottomRight.x + 5;

    while (currX <= this.gameCanvas.width + 50) {
      const topBorder = this.instantiate(Border, new Vector2(currX, 100));
      const borderCollider = topBorder.getComponent(RectangleCollider);

      if (!borderCollider) {
        throw new Error('No collider attached to border');
      }

      currX += borderCollider.width;

      if (topBorder instanceof Border) {
        this.topBorders.push(topBorder);
      }
    }
  }
}
