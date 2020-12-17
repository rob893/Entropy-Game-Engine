import { Vector2 } from '../core/helpers/Vector2';
import { Component } from './Component';
import { Transform } from './Transform';
import { Topic } from '../core/helpers/LiteEvent';
import { GameObject } from '../game-objects/GameObject';
import { CustomLiteEvent } from '../core/interfaces/CustomLiteEvent';
import { RenderableGizmo } from '../core/interfaces/RenderableGizmo';
import { Rigidbody } from './Rigidbody';
import { Color } from '../core/enums/Color';
import { PhysicalMaterial } from '../core/helpers/PhysicalMaterial';
import { CollisionManifold } from '../core/helpers/CollisionManifold';

export class RectangleCollider extends Component implements RenderableGizmo {
  public isTrigger: boolean = false;
  public physicalMaterial: PhysicalMaterial = PhysicalMaterial.zero;
  public readonly attachedRigidbody: Rigidbody | null;

  private _width: number;
  private _height: number;
  private _offset: Vector2;
  private readonly _onCollided = new Topic<CollisionManifold>();
  private readonly _onResize = new Topic<void>();
  private readonly _topLeft: Vector2;
  private readonly _topRight: Vector2;
  private readonly _bottomLeft: Vector2;
  private readonly _bottomRight: Vector2;

  public constructor(
    gameObject: GameObject,
    rb: Rigidbody | null,
    width: number,
    height: number,
    offsetX: number = 0,
    offsetY: number = 0
  ) {
    super(gameObject);

    this._width = width;
    this._height = height;
    this._offset = new Vector2(offsetX, offsetY);
    this.attachedRigidbody = rb;

    const { transform } = this;

    this._topLeft = new Vector2(
      transform.position.x + this._offset.x - width / 2,
      transform.position.y + this._offset.y - height
    );
    this._topRight = new Vector2(
      transform.position.x + this._offset.x + width / 2,
      transform.position.y + this._offset.y - height
    );
    this._bottomLeft = new Vector2(
      transform.position.x + this._offset.x - width / 2,
      transform.position.y + this._offset.y
    );
    this._bottomRight = new Vector2(
      transform.position.x + this._offset.x + width / 2,
      transform.position.y + this._offset.y
    );
  }

  public get width(): number {
    return this._width;
  }

  /**
   * Sets the width of the collider and triggers onResize after it has been set.
   */
  public set width(value: number) {
    this._width = value;
    this._onResize.trigger();
  }

  public get height(): number {
    return this._height;
  }

  public set height(value: number) {
    this._height = value;
    this._onResize.trigger();
  }

  public get offset(): Vector2 {
    return this._offset;
  }

  public set offset(value: Vector2) {
    this._offset = value;
    this._onResize.trigger();
  }

  public get topLeft(): Vector2 {
    this._topLeft.x = this.transform.position.x + this._offset.x - this._width / 2;
    this._topLeft.y = this.transform.position.y + this._offset.y - this._height;

    return this._topLeft;
  }

  public get topRight(): Vector2 {
    this._topRight.x = this.transform.position.x + this._offset.x + this._width / 2;
    this._topRight.y = this.transform.position.y + this._offset.y - this._height;

    return this._topRight;
  }

  public get bottomLeft(): Vector2 {
    this._bottomLeft.x = this.transform.position.x + this._offset.x - this._width / 2;
    this._bottomLeft.y = this.transform.position.y + this._offset.y;

    return this._bottomLeft;
  }

  public get bottomRight(): Vector2 {
    this._bottomRight.x = this.transform.position.x + this._offset.x + this._width / 2;
    this._bottomRight.y = this.transform.position.y + this._offset.y;

    return this._bottomRight;
  }

  public get center(): Vector2 {
    return new Vector2(this.topLeft.x + this._width / 2, this.topLeft.y + this._height / 2);
  }

  public get onCollided(): CustomLiteEvent<CollisionManifold> {
    return this._onCollided.expose();
  }

  public get onResized(): CustomLiteEvent<void> {
    return this._onResize.expose();
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
    this._onCollided.trigger(manifold);
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
