import type { ISerializedComponent, ISubscribable } from '../core';
import { EventType } from '../core/enums/EventType';
import { Geometry } from '../core/helpers/Geometry';
import { readString } from '../core/helpers/Serialization';
import { Topic } from '../core/helpers/Topic';
import type { GameObject } from '../game-objects/GameObject';
import { Component } from './Component';
import { RectangleCollider } from './RectangleCollider';

export class ClickedOnDetector extends Component {
  public static override readonly typeName: string = 'ClickedOnDetector';

  private readonly collider: RectangleCollider;

  private readonly onClickedOn: Topic<void> = new Topic<void>();

  public constructor(gameObject: GameObject, collider: RectangleCollider) {
    super(gameObject);

    this.collider = collider;

    this.input.addMouseListener(EventType.Click, 0, () => this.handleClickEvent());
  }

  public get onClicked(): ISubscribable<void> {
    return this.onClickedOn;
  }

  public static createFromSerialized(gameObject: GameObject, data: Record<string, unknown>): ClickedOnDetector {
    const colliderGameObjectId = readString(data.colliderGameObjectId);
    const colliderGameObject =
      colliderGameObjectId === null ? gameObject : (gameObject.findGameObjectById(colliderGameObjectId) ?? gameObject);
    const collider = colliderGameObject.getComponent(RectangleCollider);

    if (collider === null) {
      throw new Error('ClickedOnDetector requires a RectangleCollider to deserialize.');
    }

    return new ClickedOnDetector(gameObject, collider);
  }

  public override serialize(): ISerializedComponent {
    return {
      typeName: this.typeName,
      data: {
        colliderGameObjectId: this.collider.gameObject.id
      }
    };
  }

  public override deserialize(): void {}

  private handleClickEvent(): void {
    const mousePosition = this.input.canvasMousePosition;

    if (Geometry.rectangleContainsPoint(this.collider.topLeft, this.collider.bottomRight, mousePosition)) {
      this.onClickedOn.publish();
    }
  }
}
