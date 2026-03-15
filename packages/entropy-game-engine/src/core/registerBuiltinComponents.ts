import { Animator } from '../components/Animator';
import { AudioSource } from '../components/AudioSource';
import { Camera } from '../components/Camera';
import { ClickedOnDetector } from '../components/ClickedOnDetector';
import type { Component, SerializableComponentType } from '../components/Component';
import { FPSCounter } from '../components/FPSCounter';
import { GraphVisualizer, WeightedGraphVisualizer } from '../components/GraphVisualizer';
import { ImageRenderer } from '../components/ImageRenderer';
import { NavAgent } from '../components/NavAgent';
import { RectangleCollider } from '../components/RectangleCollider';
import { RectangleRenderer } from '../components/RectangleRenderer';
import { Rigidbody } from '../components/Rigidbody';
import { Slider } from '../components/Slider';
import { TextRenderer } from '../components/TextRenderer';
import { Transform } from '../components/Transform';
import { ComponentRegistry } from './ComponentRegistry';

const builtinComponents = [
  [Transform.typeName, Transform],
  [Camera.typeName, Camera],
  [Rigidbody.typeName, Rigidbody],
  [RectangleCollider.typeName, RectangleCollider],
  [ImageRenderer.typeName, ImageRenderer],
  [RectangleRenderer.typeName, RectangleRenderer],
  [TextRenderer.typeName, TextRenderer],
  [Animator.typeName, Animator],
  [AudioSource.typeName, AudioSource],
  [NavAgent.typeName, NavAgent],
  [Slider.typeName, Slider],
  [ClickedOnDetector.typeName, ClickedOnDetector],
  [FPSCounter.typeName, FPSCounter],
  [GraphVisualizer.typeName, GraphVisualizer],
  [WeightedGraphVisualizer.typeName, WeightedGraphVisualizer]
] satisfies ReadonlyArray<readonly [string, SerializableComponentType<Component>]>;

let builtinComponentsRegistered = false;

export function registerBuiltinComponents(): void {
  if (builtinComponentsRegistered) {
    return;
  }

  for (const [name, constructor] of builtinComponents) {
    ComponentRegistry.register(name, constructor);
  }

  builtinComponentsRegistered = true;
}
