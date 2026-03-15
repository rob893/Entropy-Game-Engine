import type { ISerializedComponent, ISubscribable, IUnsubscribable } from '../core';
import { readNumber, readVector2 } from '../core/helpers/Serialization';
import { Topic } from '../core/helpers/Topic';
import { Vector2 } from '../core/helpers/Vector2';
import type { GameObject } from '../game-objects/GameObject';
import { Component } from './Component';

export class Transform extends Component {
  public static override readonly typeName: string = 'Transform';

  //Rotation in radians
  public rotation: number;

  //Position is the top left of the agent with width growing right and height growing down.
  public readonly position: Vector2;

  public readonly localPosition: Vector2;

  public readonly scale: Vector2;

  private parentOnMoved: IUnsubscribable | null = null;

  private readonly onMove = new Topic<void>();

  #parent: Transform | null = null;

  readonly #children: Transform[] = [];

  public constructor(
    gameObject: GameObject,
    x: number,
    y: number,
    rotation: number = 0,
    parent: Transform | null = null
  ) {
    super(gameObject);

    this.position = new Vector2(x, y);
    this.localPosition = new Vector2(0, 0);
    this.rotation = rotation;
    this.parent = parent;
    this.scale = new Vector2(1, 1);
  }

  public get onMoved(): ISubscribable<void> {
    return this.onMove;
  }

  public get parent(): Transform | null {
    return this.#parent;
  }

  public set parent(newParent: Transform | null) {
    if (this.#parent !== null) {
      this.#parent.#children.splice(this.#parent.#children.indexOf(this), 1);
      this.parentOnMoved?.unsubscribe();
      this.parentOnMoved = null;
    }

    if (newParent !== null) {
      newParent.#children.push(this);
      this.parentOnMoved = newParent.onMoved.subscribe(this.updatePositionBasedOnParent);

      this.localPosition.x = this.position.x - newParent.position.x;
      this.localPosition.y = this.position.y - newParent.position.y;
    } else {
      this.localPosition.x = 0;
      this.localPosition.y = 0;
    }

    this.#parent = newParent;
  }

  public get children(): Transform[] {
    return [...this.#children];
  }

  public override serialize(): ISerializedComponent {
    return {
      typeName: this.typeName,
      data: {
        position: {
          x: this.position.x,
          y: this.position.y
        },
        rotation: this.rotation,
        scale: {
          x: this.scale.x,
          y: this.scale.y
        },
        localPosition: {
          x: this.localPosition.x,
          y: this.localPosition.y
        },
        parentId: this.parent?.gameObject.id ?? null
      }
    };
  }

  public override deserialize(data: Record<string, unknown>): void {
    const parentId = data.parentId;
    if (parentId === null) {
      this.parent = null;
    } else if (typeof parentId === 'string') {
      const parentGameObject = this.findGameObjectById(parentId);
      if (parentGameObject !== null) {
        this.parent = parentGameObject.transform;
      }
    }

    const position = readVector2(data.position);
    if (position !== null) {
      this.setPosition(position.x, position.y);
    }

    const rotation = readNumber(data.rotation);
    if (rotation !== null) {
      this.rotation = rotation;
    }

    const scale = readVector2(data.scale);
    if (scale !== null) {
      this.scale.x = scale.x;
      this.scale.y = scale.y;
    }

    const localPosition = readVector2(data.localPosition);
    if (localPosition !== null) {
      this.localPosition.x = localPosition.x;
      this.localPosition.y = localPosition.y;

      if (this.parent !== null) {
        this.setPosition(this.parent.position.x + localPosition.x, this.parent.position.y + localPosition.y);
      }
    }
  }

  public translate(translation: Vector2): void {
    this.position.add(translation);
    this.onMove.publish();
  }

  public lookAt(target: Vector2): void {
    this.rotation = Math.atan2(target.y - this.position.y, target.x - this.position.x) - Math.PI / 2;
  }

  public setPosition(x: number, y: number): void {
    this.position.x = x;
    this.position.y = y;
    this.onMove.publish();
  }

  public isChildOf(parent: Transform): boolean {
    if (parent === this) {
      return true;
    }

    let current = this.parent;

    while (current !== null) {
      if (current === parent) {
        return true;
      }

      current = current.parent;
    }

    return false;
  }

  private readonly updatePositionBasedOnParent = (): void => {
    if (this.#parent === null) {
      return;
    }

    this.setPosition(this.#parent.position.x + this.localPosition.x, this.#parent.position.y + this.localPosition.y);
  };
}
