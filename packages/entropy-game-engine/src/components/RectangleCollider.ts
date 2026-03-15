import type { ISerializedComponent, ISubscribable } from '../core';
import { Color } from '../core/enums/Color';
import type { CollisionManifold } from '../core/helpers/CollisionManifold';
import { PhysicalMaterial } from '../core/helpers/PhysicalMaterial';
import { isRecord, readBoolean, readNumber, readString, readVector2 } from '../core/helpers/Serialization';
import { Topic } from '../core/helpers/Topic';
import { Vector2 } from '../core/helpers/Vector2';
import type { IRenderableGizmo } from '../core/types';
import type { GameObject } from '../game-objects/GameObject';
import { Component } from './Component';
import { Rigidbody } from './Rigidbody';

export class RectangleCollider extends Component implements IRenderableGizmo {
  public static override readonly typeName: string = 'RectangleCollider';

  public isTrigger: boolean = false;

  public physicalMaterial: PhysicalMaterial = PhysicalMaterial.zero;

  public readonly attachedRigidbody: Rigidbody | null;

  #width: number;

  #height: number;

  #offset: Vector2;

  readonly #onCollided = new Topic<CollisionManifold>();

  readonly #onResize = new Topic<void>();

  readonly #topLeft: Vector2;

  readonly #topRight: Vector2;

  readonly #bottomLeft: Vector2;

  readonly #bottomRight: Vector2;

  public constructor(
    gameObject: GameObject,
    rb: Rigidbody | null,
    width: number,
    height: number,
    offsetX: number = 0,
    offsetY: number = 0
  ) {
    super(gameObject);

    this.#width = width;
    this.#height = height;
    this.#offset = new Vector2(offsetX, offsetY);
    this.attachedRigidbody = rb;

    const { transform } = this;

    this.#topLeft = new Vector2(
      transform.position.x + this.#offset.x - width / 2,
      transform.position.y + this.#offset.y - height
    );
    this.#topRight = new Vector2(
      transform.position.x + this.#offset.x + width / 2,
      transform.position.y + this.#offset.y - height
    );
    this.#bottomLeft = new Vector2(
      transform.position.x + this.#offset.x - width / 2,
      transform.position.y + this.#offset.y
    );
    this.#bottomRight = new Vector2(
      transform.position.x + this.#offset.x + width / 2,
      transform.position.y + this.#offset.y
    );
  }

  public get width(): number {
    return this.#width;
  }

  /**
   * Sets the width of the collider and triggers onResize after it has been set.
   */
  public set width(value: number) {
    this.#width = value;
    this.#onResize.publish();
  }

  public get height(): number {
    return this.#height;
  }

  public set height(value: number) {
    this.#height = value;
    this.#onResize.publish();
  }

  public get offset(): Vector2 {
    return this.#offset;
  }

  public set offset(value: Vector2) {
    this.#offset = value;
    this.#onResize.publish();
  }

  public get topLeft(): Vector2 {
    this.#topLeft.x = this.transform.position.x + this.#offset.x - this.#width / 2;
    this.#topLeft.y = this.transform.position.y + this.#offset.y - this.#height;

    return this.#topLeft;
  }

  public get topRight(): Vector2 {
    this.#topRight.x = this.transform.position.x + this.#offset.x + this.#width / 2;
    this.#topRight.y = this.transform.position.y + this.#offset.y - this.#height;

    return this.#topRight;
  }

  public get bottomLeft(): Vector2 {
    this.#bottomLeft.x = this.transform.position.x + this.#offset.x - this.#width / 2;
    this.#bottomLeft.y = this.transform.position.y + this.#offset.y;

    return this.#bottomLeft;
  }

  public get bottomRight(): Vector2 {
    this.#bottomRight.x = this.transform.position.x + this.#offset.x + this.#width / 2;
    this.#bottomRight.y = this.transform.position.y + this.#offset.y;

    return this.#bottomRight;
  }

  public get center(): Vector2 {
    return new Vector2(this.topLeft.x + this.#width / 2, this.topLeft.y + this.#height / 2);
  }

  public get onCollided(): ISubscribable<CollisionManifold> {
    return this.#onCollided;
  }

  public get onResized(): ISubscribable<void> {
    return this.#onResize;
  }

  public static createFromSerialized(gameObject: GameObject, data: Record<string, unknown>): RectangleCollider {
    const offset = readVector2(data.offset);
    const width = readNumber(data.width) ?? 0;
    const height = readNumber(data.height) ?? 0;
    const attachedRigidbodyId = readString(data.attachedRigidbodyId);
    let attachedRigidbody = gameObject.getComponent(Rigidbody);

    if (attachedRigidbodyId !== null && attachedRigidbodyId !== gameObject.id) {
      attachedRigidbody =
        gameObject.findGameObjectById(attachedRigidbodyId)?.getComponent(Rigidbody) ?? attachedRigidbody;
    }

    const collider = new RectangleCollider(
      gameObject,
      attachedRigidbody,
      width,
      height,
      offset?.x ?? 0,
      offset?.y ?? 0
    );
    collider.deserialize(data);
    return collider;
  }

  public override serialize(): ISerializedComponent {
    return {
      typeName: this.typeName,
      data: {
        width: this.width,
        height: this.height,
        offset: {
          x: this.offset.x,
          y: this.offset.y
        },
        isTrigger: this.isTrigger,
        attachedRigidbodyId: this.attachedRigidbody?.gameObject.id ?? null,
        physicalMaterial: {
          dynamicFriction: this.physicalMaterial.dynamicFriction,
          staticFriction: this.physicalMaterial.staticFriction,
          bounciness: this.physicalMaterial.bounciness
        }
      }
    };
  }

  public override deserialize(data: Record<string, unknown>): void {
    const width = readNumber(data.width);
    if (width !== null) {
      this.width = width;
    }

    const height = readNumber(data.height);
    if (height !== null) {
      this.height = height;
    }

    const offset = readVector2(data.offset);
    if (offset !== null) {
      this.offset = new Vector2(offset.x, offset.y);
    }

    const isTrigger = readBoolean(data.isTrigger);
    if (isTrigger !== null) {
      this.isTrigger = isTrigger;
    }

    if (isRecord(data.physicalMaterial)) {
      const dynamicFriction = readNumber(data.physicalMaterial.dynamicFriction);
      const staticFriction = readNumber(data.physicalMaterial.staticFriction);
      const bounciness = readNumber(data.physicalMaterial.bounciness);

      if (dynamicFriction !== null && staticFriction !== null && bounciness !== null) {
        this.physicalMaterial = new PhysicalMaterial(dynamicFriction, staticFriction, bounciness);
      }
    }
  }

  public detectCollision(other: RectangleCollider): boolean {
    if (
      !(
        other.topLeft.x > this.topRight.x ||
        other.topRight.x < this.topLeft.x ||
        other.topLeft.y > this.bottomLeft.y ||
        other.bottomLeft.y < this.topLeft.y
      )
    ) {
      return true;
    }

    return false;
  }

  public triggerCollision(manifold: CollisionManifold): void {
    this.#onCollided.publish(manifold);
  }

  public renderGizmo(context: CanvasRenderingContext2D): void {
    context.beginPath();
    context.moveTo(this.topLeft.x, this.topLeft.y);
    context.lineTo(this.bottomLeft.x, this.bottomLeft.y);
    context.lineTo(this.bottomRight.x, this.bottomRight.y);
    context.lineTo(this.topRight.x, this.topRight.y);
    context.lineTo(this.topLeft.x, this.topLeft.y);
    context.strokeStyle = Color.LightGreen;
    context.stroke();
  }
}
