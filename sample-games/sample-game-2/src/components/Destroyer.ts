import { Component, GameObject } from '@entropy-engine/entropy-game-engine';

export class Destroyer extends Component {
  private readonly conditions: ((gameObject: GameObject) => boolean)[] = [];

  public constructor(gameObject: GameObject, conditions: ((gameObject: GameObject) => boolean)[]) {
    super(gameObject);
    this.conditions = conditions;
  }

  public override update(): void {
    if (this.conditions.some(condition => condition(this.gameObject))) {
      this.destroy(this.gameObject);
    }
  }
}
