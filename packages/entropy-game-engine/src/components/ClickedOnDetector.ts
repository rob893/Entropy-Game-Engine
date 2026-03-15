import { Component } from './Component';
import { RectangleCollider } from './RectangleCollider';
import type { GameObject } from '../game-objects/GameObject';
import { Topic } from '../core/helpers/Topic';
import { Geometry } from '../core/helpers/Geometry';
import { EventType } from '../core/enums/EventType';
import type { ISerializedComponent, ISubscribable } from '../core';
import { readString } from '../core/helpers/Serialization';

export class ClickedOnDetector extends Component {
  public static override readonly typeName: string = 'ClickedOnDetector';
  private readonly collider: RectangleCollider;
  private readonly onClickedOn: Topic<void> = new Topic<void>();

  public constructor(gameObject: GameObject, collider: RectangleCollider) {
    super(gameObject);

    this.collider = collider;

    this.input.addMouseListener(EventType.Click, 0, () => this.handleClickEvent());
  }

  public static createFromSerialized(gameObject: GameObject, data: Record<string, unknown>): ClickedOnDetector {
    const colliderGameObjectId = readString(data.colliderGameObjectId);
    const colliderGameObject = colliderGameObjectId === null ? gameObject : gameObject.findGameObjectById(colliderGameObjectId) ?? gameObject;
    const collider = colliderGameObject.getComponent(RectangleCollider);

    if (collider === null) {
      throw new Error('ClickedOnDetector requires a RectangleCollider to deserialize.');
    }

    return new ClickedOnDetector(gameObject, collider);
  }

  public get onClicked(): ISubscribable<void> {
    return this.onClickedOn;
  }

  public override serialize(): ISerializedComponent {
    return {
      typeName: this.typeName,
      data: {
        colliderGameObjectId: this.collider.gameObject.id
      }
    };
  }

  public override deserialize(_data: Record<string, unknown>): void {}

  private handleClickEvent(): void {
    const mousePosition = this.input.canvasMousePosition;

    if (Geometry.rectangleContainsPoint(this.collider.topLeft, this.collider.bottomRight, mousePosition)) {
      this.onClickedOn.publish();
    }
  }
}
