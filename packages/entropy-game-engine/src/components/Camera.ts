import type { ISerializedComponent } from '../core';
import { readBounds, readNumber, readString } from '../core/helpers/Serialization';
import { Vector2 } from '../core/helpers/Vector2';
import type { GameObject } from '../game-objects/GameObject';
import { Component } from './Component';
import type { Transform } from './Transform';

export class Camera extends Component {
  public static override readonly typeName: string = 'Camera';

  public viewportWidth: number = 0;

  public viewportHeight: number = 0;

  #zoom: number = 1;

  #followTarget: Transform | null = null;

  #smoothSpeed: number = 5;

  #bounds: { min: Vector2; max: Vector2 } | null = null;

  public get zoom(): number {
    return this.#zoom;
  }

  public set zoom(value: number) {
    this.#zoom = Math.max(0.1, value);
  }

  public get followTarget(): Transform | null {
    return this.#followTarget;
  }

  public set followTarget(target: Transform | null) {
    this.#followTarget = target;
  }

  public get smoothSpeed(): number {
    return this.#smoothSpeed;
  }

  public set smoothSpeed(value: number) {
    this.#smoothSpeed = Math.max(0, value);
  }

  public static createFromSerialized(gameObject: GameObject, data: Record<string, unknown>): Camera {
    const camera = new Camera(gameObject);
    camera.deserialize(data);
    return camera;
  }

  public override serialize(): ISerializedComponent {
    return {
      typeName: this.typeName,
      data: {
        zoom: this.zoom,
        smoothSpeed: this.smoothSpeed,
        bounds:
          this.#bounds === null
            ? null
            : {
                min: {
                  x: this.#bounds.min.x,
                  y: this.#bounds.min.y
                },
                max: {
                  x: this.#bounds.max.x,
                  y: this.#bounds.max.y
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
    this.#bounds = { min: new Vector2(minX, minY), max: new Vector2(maxX, maxY) };
  }

  public clearBounds(): void {
    this.#bounds = null;
  }

  public override update(): void {
    if (this.#followTarget !== null) {
      const targetPos = this.#followTarget.position;
      const currentPos = this.transform.position;
      const deltaTime = this.time.deltaTime;
      const lerpFactor = 1 - Math.exp(-this.#smoothSpeed * deltaTime);
      const newX = currentPos.x + (targetPos.x - currentPos.x) * lerpFactor;
      const newY = currentPos.y + (targetPos.y - currentPos.y) * lerpFactor;

      this.transform.setPosition(newX, newY);
    }

    if (this.#bounds !== null) {
      const pos = this.transform.position;
      const halfW = this.viewportWidth / 2 / this.#zoom;
      const halfH = this.viewportHeight / 2 / this.#zoom;
      const clampedX = Math.max(this.#bounds.min.x + halfW, Math.min(this.#bounds.max.x - halfW, pos.x));
      const clampedY = Math.max(this.#bounds.min.y + halfH, Math.min(this.#bounds.max.y - halfH, pos.y));

      this.transform.setPosition(clampedX, clampedY);
    }
  }

  public applyTransform(context: CanvasRenderingContext2D): void {
    const halfW = this.viewportWidth / 2;
    const halfH = this.viewportHeight / 2;

    context.save();
    context.translate(halfW, halfH);
    context.scale(this.#zoom, this.#zoom);
    context.translate(-this.transform.position.x, -this.transform.position.y);
  }

  public restoreTransform(context: CanvasRenderingContext2D): void {
    context.restore();
  }

  public screenToWorld(screenX: number, screenY: number): Vector2 {
    const worldX = (screenX - this.viewportWidth / 2) / this.#zoom + this.transform.position.x;
    const worldY = (screenY - this.viewportHeight / 2) / this.#zoom + this.transform.position.y;

    return new Vector2(worldX, worldY);
  }

  public worldToScreen(worldX: number, worldY: number): Vector2 {
    const screenX = (worldX - this.transform.position.x) * this.#zoom + this.viewportWidth / 2;
    const screenY = (worldY - this.transform.position.y) * this.#zoom + this.viewportHeight / 2;

    return new Vector2(screenX, screenY);
  }
}
