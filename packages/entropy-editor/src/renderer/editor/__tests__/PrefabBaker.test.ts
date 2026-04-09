import type { ISerializedComponent, ISerializedGameObject } from '@entropy-engine/entropy-game-engine';
import type { IEditorPrefab, IEditorPrefabInstance } from '../../../shared/types';
import { bakeAllInstances, bakeInstance, setNestedValue } from '../PrefabBaker';

function createTemplate(overrides?: Partial<ISerializedGameObject>): ISerializedGameObject {
  return {
    id: 'template-id',
    name: 'TemplateName',
    tag: 'default',
    layer: 0,
    enabled: true,
    components: [
      {
        typeName: 'Transform',
        data: {
          position: { x: 0, y: 0 },
          rotation: 0,
          scale: { x: 1, y: 1 }
        }
      }
    ],
    children: [],
    ...overrides
  };
}

function createPrefab(overrides?: Partial<IEditorPrefab>): IEditorPrefab {
  return {
    id: 'prefab-1',
    name: 'TestPrefab',
    category: 'enemies',
    template: createTemplate(),
    ...overrides
  };
}

function createInstance(overrides?: Partial<IEditorPrefabInstance>): IEditorPrefabInstance {
  return {
    id: 'instance-1',
    prefabId: 'prefab-1',
    name: 'MyInstance',
    x: 100,
    y: 200,
    rotation: 1.5,
    scaleX: 2,
    scaleY: 3,
    componentOverrides: [],
    parentInstanceId: null,
    zIndex: 0,
    enabled: true,
    ...overrides
  };
}

describe('bakeInstance', () => {
  it('should clone the template and set instance-specific values', () => {
    const prefab = createPrefab();
    const instance = createInstance();
    const result = bakeInstance(instance, prefab);

    expect(result.id).toBe('instance-1');
    expect(result.name).toBe('MyInstance');
    expect(result.enabled).toBe(true);
    expect(result.tag).toBe('default');
    expect(result.layer).toBe(0);
  });

  it('should not mutate the original prefab template', () => {
    const prefab = createPrefab();
    const originalId = prefab.template.id;
    bakeInstance(createInstance(), prefab);

    expect(prefab.template.id).toBe(originalId);
    expect(prefab.template.name).toBe('TemplateName');
  });

  it('should apply transform overrides from instance position, rotation, and scale', () => {
    const result = bakeInstance(createInstance(), createPrefab());
    const transform = result.components.find(c => c.typeName === 'Transform');

    expect(transform).toBeDefined();
    expect(transform!.data.position).toEqual({ x: 100, y: 200 });
    expect(transform!.data.rotation).toBe(1.5);
    expect(transform!.data.scale).toEqual({ x: 2, y: 3 });
  });

  it('should handle a template without a Transform component', () => {
    const prefab = createPrefab({
      template: createTemplate({ components: [] })
    });

    const result = bakeInstance(createInstance(), prefab);

    expect(result.components).toHaveLength(0);
    expect(result.id).toBe('instance-1');
  });

  it('should apply component field overrides', () => {
    const template = createTemplate({
      components: [
        { typeName: 'Transform', data: { position: { x: 0, y: 0 }, rotation: 0, scale: { x: 1, y: 1 } } },
        { typeName: 'Rigidbody', data: { mass: 1, useGravity: true } }
      ]
    });

    const instance = createInstance({
      componentOverrides: [
        { typeName: 'Rigidbody', fieldPath: 'mass', value: 5 },
        { typeName: 'Rigidbody', fieldPath: 'useGravity', value: false }
      ]
    });

    const result = bakeInstance(instance, createPrefab({ template }));
    const rb = result.components.find(c => c.typeName === 'Rigidbody');

    expect(rb!.data.mass).toBe(5);
    expect(rb!.data.useGravity).toBe(false);
  });

  it('should apply dot-notation field paths', () => {
    const template = createTemplate({
      components: [
        { typeName: 'Transform', data: { position: { x: 0, y: 0 }, rotation: 0, scale: { x: 1, y: 1 } } },
        { typeName: 'RectangleCollider', data: { physicalMaterial: { bounciness: 0.5, friction: 0.3 } } }
      ]
    });

    const instance = createInstance({
      componentOverrides: [
        { typeName: 'RectangleCollider', fieldPath: 'physicalMaterial.bounciness', value: 0.9 }
      ]
    });

    const result = bakeInstance(instance, createPrefab({ template }));
    const collider = result.components.find(c => c.typeName === 'RectangleCollider');
    const material = collider!.data.physicalMaterial as Record<string, unknown>;

    expect(material.bounciness).toBe(0.9);
    expect(material.friction).toBe(0.3);
  });

  it('should skip overrides for components that do not exist in the template', () => {
    const instance = createInstance({
      componentOverrides: [
        { typeName: 'NonExistent', fieldPath: 'foo', value: 42 }
      ]
    });

    const result = bakeInstance(instance, createPrefab());
    expect(result.components).toHaveLength(1);
    expect(result.components[0].typeName).toBe('Transform');
  });

  it('should set enabled to false when instance is disabled', () => {
    const instance = createInstance({ enabled: false });
    const result = bakeInstance(instance, createPrefab());

    expect(result.enabled).toBe(false);
  });

  it('should regenerate IDs for child game objects', () => {
    const childTemplate: ISerializedGameObject = {
      id: 'child-original',
      name: 'Child',
      tag: 'default',
      layer: 0,
      enabled: true,
      components: [],
      children: []
    };

    const template = createTemplate({ children: [childTemplate] });
    const prefab = createPrefab({ template });
    const result = bakeInstance(createInstance(), prefab);

    expect(result.children).toHaveLength(1);
    expect(result.children[0].id).not.toBe('child-original');
    expect(typeof result.children[0].id).toBe('string');
    expect(result.children[0].id.length).toBeGreaterThan(0);
  });
});

describe('setNestedValue', () => {
  it('should set a simple top-level key', () => {
    const obj: Record<string, unknown> = { a: 1 };
    setNestedValue(obj, 'a', 42);
    expect(obj.a).toBe(42);
  });

  it('should set a deeply nested key', () => {
    const obj: Record<string, unknown> = { a: { b: { c: 1 } } };
    setNestedValue(obj, 'a.b.c', 99);
    expect((obj.a as Record<string, unknown> as Record<string, Record<string, unknown>>).b.c).toBe(99);
  });

  it('should create intermediate objects when missing', () => {
    const obj: Record<string, unknown> = {};
    setNestedValue(obj, 'a.b.c', 'hello');

    const a = obj.a as Record<string, unknown>;
    const b = a.b as Record<string, unknown>;
    expect(b.c).toBe('hello');
  });

  it('should reject __proto__ segments', () => {
    const obj: Record<string, unknown> = {};
    setNestedValue(obj, '__proto__.polluted', true);
    expect(({} as Record<string, unknown>).polluted).toBeUndefined();
  });

  it('should reject constructor segments', () => {
    const obj: Record<string, unknown> = {};
    setNestedValue(obj, 'constructor.prototype.bad', true);
    expect(obj.constructor).toBe(Object);
  });

  it('should reject prototype segments', () => {
    const obj: Record<string, unknown> = {};
    setNestedValue(obj, 'prototype.bad', true);
    expect(obj.prototype).toBeUndefined();
  });
});

describe('bakeAllInstances', () => {
  it('should bake instances from all object layers', () => {
    const prefab = createPrefab();
    const mapFile = {
      layers: [
        { type: 'tile' as const, name: 'ground', grid: [[0]], tileSetId: 'ts-1', visible: true, opacity: 1 },
        {
          type: 'object' as const,
          name: 'enemies',
          instances: [
            createInstance({ id: 'i-1', name: 'Enemy1', zIndex: 0 }),
            createInstance({ id: 'i-2', name: 'Enemy2', zIndex: 1 })
          ],
          visible: true,
          opacity: 1
        }
      ]
    };

    const result = bakeAllInstances(mapFile, [prefab]);

    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('Enemy1');
    expect(result[1].name).toBe('Enemy2');
  });

  it('should sort instances by zIndex within each layer', () => {
    const prefab = createPrefab();
    const mapFile = {
      layers: [
        {
          type: 'object' as const,
          name: 'objects',
          instances: [
            createInstance({ id: 'i-high', name: 'High', zIndex: 10 }),
            createInstance({ id: 'i-low', name: 'Low', zIndex: 1 }),
            createInstance({ id: 'i-mid', name: 'Mid', zIndex: 5 })
          ],
          visible: true,
          opacity: 1
        }
      ]
    };

    const result = bakeAllInstances(mapFile, [prefab]);

    expect(result[0].name).toBe('Low');
    expect(result[1].name).toBe('Mid');
    expect(result[2].name).toBe('High');
  });

  it('should skip instances with missing prefabs and log a warning', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const mapFile = {
      layers: [
        {
          type: 'object' as const,
          name: 'objects',
          instances: [
            createInstance({ id: 'i-1', prefabId: 'nonexistent', name: 'OrphanInstance' })
          ],
          visible: true,
          opacity: 1
        }
      ]
    };

    const result = bakeAllInstances(mapFile, []);

    expect(result).toHaveLength(0);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('OrphanInstance')
    );

    consoleSpy.mockRestore();
  });

  it('should skip non-object layers', () => {
    const mapFile = {
      layers: [
        { type: 'tile' as const, name: 'ground' }
      ]
    };

    const result = bakeAllInstances(mapFile, []);
    expect(result).toHaveLength(0);
  });

  it('should handle multiple object layers preserving layer order', () => {
    const prefab = createPrefab();
    const mapFile = {
      layers: [
        {
          type: 'object' as const,
          name: 'layer1',
          instances: [createInstance({ id: 'l1-1', name: 'Layer1Obj', zIndex: 0 })],
          visible: true,
          opacity: 1
        },
        {
          type: 'object' as const,
          name: 'layer2',
          instances: [createInstance({ id: 'l2-1', name: 'Layer2Obj', zIndex: 0 })],
          visible: true,
          opacity: 1
        }
      ]
    };

    const result = bakeAllInstances(mapFile, [prefab]);

    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('Layer1Obj');
    expect(result[1].name).toBe('Layer2Obj');
  });
});
