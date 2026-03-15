import { PhysicalMaterial } from '../PhysicalMaterial';

test('PhysicalMaterial constructor stores the provided values', (): void => {
  const material = new PhysicalMaterial(0.25, 0.5, 0.75);

  expect(material.dynamicFriction).toBe(0.25);
  expect(material.staticFriction).toBe(0.5);
  expect(material.bounciness).toBe(0.75);
});

test.each([
  ['ice', () => PhysicalMaterial.ice, { dynamicFriction: 0.1, staticFriction: 0.1, bounciness: 0 }],
  ['bouncy', () => PhysicalMaterial.bouncy, { dynamicFriction: 0.3, staticFriction: 0.3, bounciness: 1 }],
  ['maxFriction', () => PhysicalMaterial.maxFriction, { dynamicFriction: 1, staticFriction: 1, bounciness: 0 }],
  ['metal', () => PhysicalMaterial.metal, { dynamicFriction: 0.15, staticFriction: 0.15, bounciness: 0.597 }],
  ['rubber', () => PhysicalMaterial.rubber, { dynamicFriction: 1, staticFriction: 1, bounciness: 0.828 }],
  ['wood', () => PhysicalMaterial.wood, { dynamicFriction: 0.45, staticFriction: 0.45, bounciness: 0.603 }],
  ['zero', () => PhysicalMaterial.zero, { dynamicFriction: 0, staticFriction: 0, bounciness: 0 }]
])('PhysicalMaterial.%s returns a material with the expected values', (_, getMaterial, expected): void => {
  const material = getMaterial();

  expect(material).toBeInstanceOf(PhysicalMaterial);
  expect(material.dynamicFriction).toBe(expected.dynamicFriction);
  expect(material.staticFriction).toBe(expected.staticFriction);
  expect(material.bounciness).toBe(expected.bounciness);
});

test('PhysicalMaterial properties are readonly and retain constructor values', (): void => {
  const material = new PhysicalMaterial(0.2, 0.4, 0.6);

  expectTypeOf(material).toEqualTypeOf<{
    readonly dynamicFriction: number;
    readonly staticFriction: number;
    readonly bounciness: number;
  }>();

  expect(material.dynamicFriction).toBe(0.2);
  expect(material.staticFriction).toBe(0.4);
  expect(material.bounciness).toBe(0.6);
});
