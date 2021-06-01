import { Component } from '@entropy-engine/entropy-game-engine';
import { Explosion } from '../game-objects/Explosion';

export class Grenade extends Component {
  public override start(): void {
    this.destroy(this.gameObject, 5);
  }

  public override onDestroy(): void {
    this.instantiate(Explosion, this.transform.position);
  }
}
