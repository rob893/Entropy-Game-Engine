import { Component } from './Component';
import { RectangleCollider } from './RectangleCollider';
import { GameObject } from '../game-objects/GameObject';
import { LiteEvent } from '../core/helpers/LiteEvent';
import { CustomLiteEvent } from '../core/interfaces/CustomLiteEvent';
import { Geometry } from '../core/helpers/Geometry';
import { EventType } from '../core/enums/EventType';

export class ClickedOnDetector extends Component {
  private readonly collider: RectangleCollider;
  private readonly onClickedOn: LiteEvent<void> = new LiteEvent<void>();

  public constructor(gameObject: GameObject, collider: RectangleCollider) {
    super(gameObject);

    this.collider = collider;

    this.input.addMouseListener(EventType.Click, 0, () => this.handleClickEvent());
  }

  public get onClicked(): CustomLiteEvent<void> {
    return this.onClickedOn.expose();
  }

  private handleClickEvent(): void {
    const mousePosition = this.input.canvasMousePosition;

    if (Geometry.rectangleContainsPoint(this.collider.topLeft, this.collider.bottomRight, mousePosition)) {
      this.onClickedOn.trigger();
    }
  }
}
