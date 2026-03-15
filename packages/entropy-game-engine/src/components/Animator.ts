import { Component } from './Component';
import type { GameObject } from '../game-objects/GameObject';
import type { Animation } from '../core/helpers/Animation';
import type { IRenderable } from '../core/types';
import type { ISerializedComponent } from '../core';
import { createAnimationFromSource, getElementSource, readBoolean, readNumber, readString } from '../core/helpers/Serialization';

export class Animator extends Component implements IRenderable {
  public static override readonly typeName: string = 'Animator';
  private animation: Animation;
  private renderWidth: number;
  private renderHeight: number;
  private halfRWidth: number;
  private halfRHeight: number;

  public constructor(gameObject: GameObject, renderWidth: number, renderHeight: number, initialAnimation: Animation) {
    super(gameObject);

    this.renderWidth = renderWidth;
    this.halfRWidth = renderWidth / 2;
    this.renderHeight = renderHeight;
    this.halfRHeight = renderHeight / 2;
    this.animation = initialAnimation;
  }

  public static createFromSerialized(gameObject: GameObject, data: Record<string, unknown>): Animator {
    const animator = new Animator(
      gameObject,
      readNumber(data.renderWidth) ?? 0,
      readNumber(data.renderHeight) ?? 0,
      createAnimationFromSource(readString(data.currentFrameSource))
    );
    animator.deserialize(data);
    return animator;
  }

  public get currentAnimation(): Animation {
    return this.animation;
  }

  public override serialize(): ISerializedComponent {
    return {
      typeName: this.typeName,
      data: {
        renderWidth: this.renderWidth,
        renderHeight: this.renderHeight,
        currentFrameSource: getElementSource(this.animation.currentFrame) ?? null,
        loop: this.animation.loop,
        playToFinish: this.animation.playToFinish,
        speedPercentage: this.animation.speedPercentage
      }
    };
  }

  public override deserialize(data: Record<string, unknown>): void {
    const renderWidth = readNumber(data.renderWidth);
    if (renderWidth !== null) {
      this.renderWidth = renderWidth;
      this.halfRWidth = renderWidth / 2;
    }

    const renderHeight = readNumber(data.renderHeight);
    if (renderHeight !== null) {
      this.renderHeight = renderHeight;
      this.halfRHeight = renderHeight / 2;
    }

    const currentFrameSource = readString(data.currentFrameSource);
    if (currentFrameSource !== null) {
      this.setAnimation(createAnimationFromSource(currentFrameSource));
    }

    const loop = readBoolean(data.loop);
    if (loop !== null) {
      this.animation.loop = loop;
    }

    const playToFinish = readBoolean(data.playToFinish);
    if (playToFinish !== null) {
      this.animation.playToFinish = playToFinish;
    }

    const speedPercentage = readNumber(data.speedPercentage);
    if (speedPercentage !== null && speedPercentage > 0) {
      this.animation.speedPercentage = speedPercentage;
    }
  }

  public setAnimation(animation: Animation): void {
    if (this.animation.playToFinish && !this.animation.isComplete) {
      return;
    }

    this.animation = animation;
  }

  public override update(): void {
    this.animation.updateAnimation(this.time.deltaTime);
  }

  public render(context: CanvasRenderingContext2D): void {
    context.save();
    context.translate(this.transform.position.x, this.transform.position.y - this.halfRHeight);
    context.rotate(this.transform.rotation);

    context.drawImage(
      this.animation.currentFrame,
      0 - this.halfRWidth,
      0 - this.halfRHeight,
      this.renderWidth,
      this.renderHeight
    );

    context.restore();
  }
}
