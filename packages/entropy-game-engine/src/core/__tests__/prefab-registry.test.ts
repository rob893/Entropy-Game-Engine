import { PrefabRegistry } from '../../index';
import type { ISerializedGameObject } from '../../index';

function createTemplate(name: string): ISerializedGameObject {
  return {
    id: `id-${name}`,
    name,
    tag: 'default',
    layer: 0,
    enabled: true,
    components: [
      {
        typeName: 'Transform',
        data: { position: { x: 0, y: 0 }, rotation: 0 }
      }
    ],
    children: []
  };
}

describe('PrefabRegistry', () => {
  let registry: PrefabRegistry;

  beforeEach(() => {
    registry = new PrefabRegistry();
  });

  test('register and get return the stored template', () => {
    const template = createTemplate('Enemy');
    registry.register('Enemy', template);

    expect(registry.get('Enemy')).toBe(template);
  });

  test('get returns undefined for an unregistered name', () => {
    expect(registry.get('NonExistent')).toBeUndefined();
  });

  test('has returns true for a registered name', () => {
    registry.register('Player', createTemplate('Player'));

    expect(registry.has('Player')).toBe(true);
  });

  test('has returns false for an unregistered name', () => {
    expect(registry.has('Ghost')).toBe(false);
  });

  test('loadFromManifest registers all templates by name', () => {
    const manifest = [createTemplate('A'), createTemplate('B'), createTemplate('C')];
    registry.loadFromManifest(manifest);

    expect(registry.has('A')).toBe(true);
    expect(registry.has('B')).toBe(true);
    expect(registry.has('C')).toBe(true);
    expect(registry.get('A')).toBe(manifest[0]);
    expect(registry.get('B')).toBe(manifest[1]);
    expect(registry.get('C')).toBe(manifest[2]);
  });

  test('getRegisteredNames returns all registered prefab names', () => {
    registry.register('X', createTemplate('X'));
    registry.register('Y', createTemplate('Y'));

    const names = registry.getRegisteredNames();

    expect(names).toEqual(expect.arrayContaining(['X', 'Y']));
    expect(names).toHaveLength(2);
  });

  test('clear removes all registered prefabs', () => {
    registry.register('One', createTemplate('One'));
    registry.register('Two', createTemplate('Two'));

    registry.clear();

    expect(registry.has('One')).toBe(false);
    expect(registry.has('Two')).toBe(false);
    expect(registry.getRegisteredNames()).toHaveLength(0);
  });

  test('register overwrites an existing prefab with the same name', () => {
    const first = createTemplate('Dup');
    const second = createTemplate('Dup');
    second.tag = 'updated';

    registry.register('Dup', first);
    registry.register('Dup', second);

    expect(registry.get('Dup')).toBe(second);
    expect(registry.getRegisteredNames()).toHaveLength(1);
  });
});
