import { Component, GameObject, Vector2 } from '@entropy-engine/entropy-game-engine';

export class Scroller extends Component {
  public xScrollSpeed: number = 0;
  public yScrollSpeed: number = 0;

  public constructor(gameObject: GameObject, xScrollSpeed?: number, yScrollSpeed?: number) {
    super(gameObject);
    if (xScrollSpeed) {
      this.xScrollSpeed = xScrollSpeed;
    }

    if (yScrollSpeed) {
      this.yScrollSpeed = yScrollSpeed;
    }
  }

  public update(): void {
    this.transform.translate(new Vector2(this.xScrollSpeed, this.yScrollSpeed).multiplyScalar(this.time.deltaTime));
  }
}
