import { Component } from './Component';
import { RectangleCollider } from './RectangleCollider';
import { GameObject } from '../game-objects/GameObject';
import { Topic } from '../core/helpers/Topic';
import { Geometry } from '../core/helpers/Geometry';
import { EventType } from '../core/enums/EventType';
import { Subscribable } from '../core';

export class ClickedOnDetector extends Component {
  private readonly collider: RectangleCollider;
  private readonly onClickedOn: Topic<void> = new Topic<void>();

  public constructor(gameObject: GameObject, collider: RectangleCollider) {
    super(gameObject);

    this.collider = collider;

    this.input.addMouseListener(EventType.Click, 0, () => this.handleClickEvent());
  }

  public get onClicked(): Subscribable<void> {
    return this.onClickedOn;
  }

  private handleClickEvent(): void {
    const mousePosition = this.input.canvasMousePosition;

    if (Geometry.rectangleContainsPoint(this.collider.topLeft, this.collider.bottomRight, mousePosition)) {
      this.onClickedOn.publish();
    }
  }
}
