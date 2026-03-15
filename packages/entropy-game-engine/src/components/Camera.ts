import { Component } from './Component';
import { Transform } from './Transform';
import { Vector2 } from '../core/helpers/Vector2';
import { GameObject } from '../game-objects/GameObject';
import { SerializedComponent } from '../core';
import { readBounds, readNumber, readString } from '../core/helpers/Serialization';

export class Camera extends Component {
  public static override readonly typeName: string = 'Camera';

  private _zoom: number = 1;
  private _followTarget: Transform | null = null;
  private _smoothSpeed: number = 5;
  private _bounds: { min: Vector2; max: Vector2 } | null = null;

  public viewportWidth: number = 0;
  public viewportHeight: number = 0;

  public static createFromSerialized(gameObject: GameObject, data: Record<string, unknown>): Camera {
    const camera = new Camera(gameObject);
    camera.deserialize(data);
    return camera;
  }

  public get zoom(): number {
    return this._zoom;
  }

  public set zoom(value: number) {
    this._zoom = Math.max(0.1, value);
  }

  public get followTarget(): Transform | null {
    return this._followTarget;
  }

  public set followTarget(target: Transform | null) {
    this._followTarget = target;
  }

  public get smoothSpeed(): number {
    return this._smoothSpeed;
  }

  public set smoothSpeed(value: number) {
    this._smoothSpeed = Math.max(0, value);
  }

  public override serialize(): SerializedComponent {
    return {
      typeName: this.typeName,
      data: {
        zoom: this.zoom,
        smoothSpeed: this.smoothSpeed,
        bounds:
          this._bounds === null
            ? null
            : {
                min: {
                  x: this._bounds.min.x,
                  y: this._bounds.min.y
                },
                max: {
                  x: this._bounds.max.x,
                  y: this._bounds.max.y
                }
              },
        viewportWidth: this.viewportWidth,
        viewportHeight: this.viewportHeight,
        followTargetId: this.followTarget?.gameObject.id ?? null
      }
    };
  }

  public override deserialize(data: Record<string, unknown>): void {
    const zoom = readNumber(data.zoom);
    if (zoom !== null) {
      this.zoom = zoom;
    }

    const smoothSpeed = readNumber(data.smoothSpeed);
    if (smoothSpeed !== null) {
      this.smoothSpeed = smoothSpeed;
    }

    const viewportWidth = readNumber(data.viewportWidth);
    if (viewportWidth !== null) {
      this.viewportWidth = viewportWidth;
    }

    const viewportHeight = readNumber(data.viewportHeight);
    if (viewportHeight !== null) {
      this.viewportHeight = viewportHeight;
    }

    if (data.bounds === null) {
      this.clearBounds();
    } else {
      const bounds = readBounds(data.bounds);
      if (bounds !== null) {
        this.setBounds(bounds.min.x, bounds.min.y, bounds.max.x, bounds.max.y);
      }
    }

    const followTargetId = readString(data.followTargetId);
    if (followTargetId === null) {
      if (data.followTargetId === null) {
        this.followTarget = null;
      }
      return;
    }

    const followTargetObject = this.findGameObjectById(followTargetId);
    if (followTargetObject !== null) {
      this.followTarget = followTargetObject.transform;
    }
  }

  public setBounds(minX: number, minY: number, maxX: number, maxY: number): void {
    this._bounds = { min: new Vector2(minX, minY), max: new Vector2(maxX, maxY) };
  }

  public clearBounds(): void {
    this._bounds = null;
  }

  public override update(): void {
    if (this._followTarget !== null) {
      const targetPos = this._followTarget.position;
      const currentPos = this.transform.position;
      const deltaTime = this.time.deltaTime;
      const lerpFactor = 1 - Math.exp(-this._smoothSpeed * deltaTime);
      const newX = currentPos.x + (targetPos.x - currentPos.x) * lerpFactor;
      const newY = currentPos.y + (targetPos.y - currentPos.y) * lerpFactor;

      this.transform.setPosition(newX, newY);
    }

    if (this._bounds !== null) {
      const pos = this.transform.position;
      const halfW = this.viewportWidth / 2 / this._zoom;
      const halfH = this.viewportHeight / 2 / this._zoom;
      const clampedX = Math.max(this._bounds.min.x + halfW, Math.min(this._bounds.max.x - halfW, pos.x));
      const clampedY = Math.max(this._bounds.min.y + halfH, Math.min(this._bounds.max.y - halfH, pos.y));

      this.transform.setPosition(clampedX, clampedY);
    }
  }

  public applyTransform(context: CanvasRenderingContext2D): void {
    const halfW = this.viewportWidth / 2;
    const halfH = this.viewportHeight / 2;

    context.save();
    context.translate(halfW, halfH);
    context.scale(this._zoom, this._zoom);
    context.translate(-this.transform.position.x, -this.transform.position.y);
  }

  public restoreTransform(context: CanvasRenderingContext2D): void {
    context.restore();
  }

  public screenToWorld(screenX: number, screenY: number): Vector2 {
    const worldX = (screenX - this.viewportWidth / 2) / this._zoom + this.transform.position.x;
    const worldY = (screenY - this.viewportHeight / 2) / this._zoom + this.transform.position.y;

    return new Vector2(worldX, worldY);
  }

  public worldToScreen(worldX: number, worldY: number): Vector2 {
    const screenX = (worldX - this.transform.position.x) * this._zoom + this.viewportWidth / 2;
    const screenY = (worldY - this.transform.position.y) * this._zoom + this.viewportHeight / 2;

    return new Vector2(screenX, screenY);
  }
}
