import type { ISerializedGameObject } from '@entropy-engine/entropy-game-engine';
import type { IEditorPrefab } from '../../../shared/types';
import { generatePrefabManifest, generatePrefabTypeDeclaration } from '../PrefabManifestExporter';

function createPrefab(name: string, id?: string): IEditorPrefab {
  const template: ISerializedGameObject = {
    id: id ?? `id-${name}`,
    name,
    tag: 'default',
    layer: 0,
    enabled: true,
    components: [
      { typeName: 'Transform', data: { position: { x: 0, y: 0 }, rotation: 0, scale: { x: 1, y: 1 } } }
    ],
    children: []
  };

  return { id: id ?? `prefab-${name}`, name, category: 'general', template };
}

describe('generatePrefabManifest', () => {
  it('should return an array of cloned templates', () => {
    const prefabs = [createPrefab('Enemy'), createPrefab('Coin')];
    const manifest = generatePrefabManifest(prefabs);

    expect(manifest).toHaveLength(2);
    expect(manifest[0].name).toBe('Enemy');
    expect(manifest[1].name).toBe('Coin');
  });

  it('should deep-clone templates so mutations do not affect originals', () => {
    const prefabs = [createPrefab('Enemy')];
    const manifest = generatePrefabManifest(prefabs);

    manifest[0].name = 'Mutated';
    expect(prefabs[0].template.name).toBe('Enemy');
  });

  it('should return an empty array for no prefabs', () => {
    const manifest = generatePrefabManifest([]);
    expect(manifest).toEqual([]);
  });

  it('should throw on duplicate prefab names', () => {
    const prefabs = [createPrefab('Enemy', 'p1'), createPrefab('Enemy', 'p2')];

    expect(() => generatePrefabManifest(prefabs)).toThrow('Duplicate prefab name: "Enemy"');
  });
});

describe('generatePrefabTypeDeclaration', () => {
  it('should generate a never type for empty prefabs', () => {
    const result = generatePrefabTypeDeclaration([]);

    expect(result).toContain('export type PrefabName = never;');
    expect(result).toContain('do not edit manually');
  });

  it('should generate a union type for prefabs', () => {
    const prefabs = [createPrefab('Enemy'), createPrefab('Coin')];
    const result = generatePrefabTypeDeclaration(prefabs);

    expect(result).toContain("| 'Enemy'");
    expect(result).toContain("| 'Coin'");
    expect(result).toContain("declare module '@entropy-engine/entropy-game-engine'");
  });

  it('should escape single quotes in prefab names', () => {
    const prefabs = [createPrefab("Knight's Shield")];
    const result = generatePrefabTypeDeclaration(prefabs);

    expect(result).toContain("| 'Knight\\'s Shield'");
  });

  it('should generate a single-member union for one prefab', () => {
    const prefabs = [createPrefab('Player')];
    const result = generatePrefabTypeDeclaration(prefabs);

    expect(result).toContain("| 'Player'");
    expect(result).toContain('export type PrefabName =');
  });
});
