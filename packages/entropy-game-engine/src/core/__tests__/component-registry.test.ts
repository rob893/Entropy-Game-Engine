import {
  Animator,
  AudioSource,
  Camera,
  ClickedOnDetector,
  ComponentRegistry,
  FPSCounter,
  GraphVisualizer,
  ImageRenderer,
  NavAgent,
  RectangleCollider,
  RectangleRenderer,
  Rigidbody,
  Slider,
  TextRenderer,
  Transform,
  WeightedGraphVisualizer
} from '../../index';

test('Registers built-in component types', () => {
  const builtInComponents = [
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
  ] as const;

  for (const [typeName, component] of builtInComponents) {
    expect(ComponentRegistry.has(typeName)).toBe(true);
    expect(ComponentRegistry.get(typeName)).toBe(component);
  }

  expect(ComponentRegistry.getRegisteredNames()).toEqual(
    expect.arrayContaining(builtInComponents.map(([typeName]) => typeName))
  );
});
