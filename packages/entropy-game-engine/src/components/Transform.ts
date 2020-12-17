import { Component } from './Component';
import { Vector2 } from '../core/helpers/Vector2';
import { Topic } from '../core/helpers/LiteEvent';
import { GameObject } from '../game-objects/GameObject';
import { CustomLiteEvent } from '../core/interfaces/CustomLiteEvent';

export class Transform extends Component {
  //Rotation in radians
  public rotation: number;
  //Position is the top left of the agent with width growing right and height growing down.
  public readonly position: Vector2;
  public readonly localPosition: Vector2;
  public readonly scale: Vector2;

  private _parent: Transform | null = null;
  private readonly _children: Transform[] = [];
  private readonly onMove = new Topic<void>();

  public constructor(
    gameObject: GameObject,
    x: number,
    y: number,
    rotation: number = 0,
    parent: Transform | null = null
  ) {
    super(gameObject);

    this.position = new Vector2(x, y);
    this.localPosition = Vector2.zero;
    this.rotation = rotation;
    this.parent = parent;
    this.scale = Vector2.one;
  }

  public get onMoved(): CustomLiteEvent<void> {
    return this.onMove.expose();
  }

  public get parent(): Transform | null {
    return this._parent;
  }

  public set parent(newParent: Transform | null) {
    if (this._parent !== null) {
      this._parent._children.splice(this._parent._children.indexOf(this), 1);
      this._parent.onMoved.remove(this.updatePositionBasedOnParent);
    }

    if (newParent !== null) {
      newParent._children.push(this);
      newParent.onMoved.add(this.updatePositionBasedOnParent);

      this.localPosition.x = this.position.x - newParent.position.x;
      this.localPosition.y = this.position.y - newParent.position.y;
    } else {
      this.localPosition.x = 0;
      this.localPosition.y = 0;
    }

    this._parent = newParent;
  }

  public get children(): Transform[] {
    return [...this._children];
  }

  public translate(translation: Vector2): void {
    this.position.add(translation);
    this.onMove.trigger();
  }

  public lookAt(target: Vector2): void {
    this.rotation = Math.atan2(target.y - this.position.y, target.x - this.position.x) - Math.PI / 2;
  }

  public setPosition(x: number, y: number): void {
    this.position.x = x;
    this.position.y = y;
    this.onMove.trigger();
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
    if (this._parent === null) {
      return;
    }

    this.setPosition(this._parent.position.x + this.localPosition.x, this._parent.position.y + this.localPosition.y);
  };
}
