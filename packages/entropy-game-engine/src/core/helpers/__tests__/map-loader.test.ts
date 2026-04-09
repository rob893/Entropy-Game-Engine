import 'vitest-canvas-mock';
import { Component } from '../../../components/Component';
import { GameObject } from '../../../game-objects/GameObject';
import { Layer } from '../../enums/Layer';
import { GameEngine } from '../../GameEngine';
import type { IGameObjectConstructionParams, IMapFile, IMapObjectInstance, IPrefabSettings, IScene } from '../../types';
import type { AssetPool } from '../AssetPool';
import { MapLoader } from '../MapLoader';
import type { RectangleBackground } from '../RectangleBackground';

function createMinimalMap(overrides?: Partial<IMapFile>): IMapFile {
  return {
    name: 'TestMap',
    tileWidth: 32,
    tileHeight: 32,
    layers: [
      {
        type: 'tile',
        name: 'Layer 1',
        grid: [
          [1, 2, 0],
          [3, 0, 4]
        ],
        tileSetId: 'ts-1',
        visible: true,
        opacity: 1
      }
    ],
    tilesets: [
      {
        id: 'ts-1',
        imagePath: 'assets/tilesets/test.png',
        tileWidth: 16,
        tileHeight: 16,
        columns: 4,
        rows: 4,
        tileCount: 16
      }
    ],
    ...overrides
  };
}

describe('MapLoader.toTerrainSpec', () => {
  test('converts a single-layer map to an ITerrainSpec with layered format', () => {
    const map = createMinimalMap();
    const spec = MapLoader.toTerrainSpec(map);

    expect(spec.tileWidth).toBe(32);
    expect(spec.tileHeight).toBe(32);
    expect(spec.layers).toBeDefined();
    expect(spec.layers).toHaveLength(1);

    const layer = spec.layers![0];
    expect(layer.name).toBe('Layer 1');
    expect(layer.visible).toBe(true);
    expect(layer.opacity).toBe(1);
    expect(layer.grid).toEqual([
      [1, 2, 0],
      [3, 0, 4]
    ]);
  });

  test('computes correct sprite sheet coordinates for tile IDs', () => {
    const map = createMinimalMap();
    const spec = MapLoader.toTerrainSpec(map);
    const tileSet = spec.layers![0].tileSet;

    // Tile 1: column 0, row 0 → sliceX=0, sliceY=0
    expect(tileSet[1]).toBe('assets/tilesets/test.png#0,0,16,16');
    // Tile 2: column 1, row 0 → sliceX=16, sliceY=0
    expect(tileSet[2]).toBe('assets/tilesets/test.png#16,0,16,16');
    // Tile 3: column 2, row 0 → sliceX=32, sliceY=0
    expect(tileSet[3]).toBe('assets/tilesets/test.png#32,0,16,16');
    // Tile 4: column 3, row 0 → sliceX=48, sliceY=0
    expect(tileSet[4]).toBe('assets/tilesets/test.png#48,0,16,16');
  });

  test('computes correct coordinates for end-of-row and next-row tiles', () => {
    const map = createMinimalMap({
      layers: [
        {
          type: 'tile',
          name: 'L1',
          grid: [[4, 5, 8, 16]],
          tileSetId: 'ts-1',
          visible: true,
          opacity: 1
        }
      ]
    });

    const spec = MapLoader.toTerrainSpec(map);
    const tileSet = spec.layers![0].tileSet;

    // Tile 4: last column of row 0 → col 3, row 0
    expect(tileSet[4]).toBe('assets/tilesets/test.png#48,0,16,16');
    // Tile 5: first column of row 1 → col 0, row 1
    expect(tileSet[5]).toBe('assets/tilesets/test.png#0,16,16,16');
    // Tile 8: last column of row 1 → col 3, row 1
    expect(tileSet[8]).toBe('assets/tilesets/test.png#48,16,16,16');
    // Tile 16: last tile → col 3, row 3
    expect(tileSet[16]).toBe('assets/tilesets/test.png#48,48,16,16');
  });

  test('converts multi-layer maps producing one ITerrainLayer per tile layer', () => {
    const map = createMinimalMap({
      layers: [
        {
          type: 'tile',
          name: 'Ground',
          grid: [[1, 2]],
          tileSetId: 'ts-1',
          visible: true,
          opacity: 1
        },
        {
          type: 'tile',
          name: 'Details',
          grid: [[0, 3]],
          tileSetId: 'ts-1',
          visible: false,
          opacity: 0.5
        }
      ]
    });

    const spec = MapLoader.toTerrainSpec(map);
    expect(spec.layers).toHaveLength(2);
    expect(spec.layers![0].name).toBe('Ground');
    expect(spec.layers![0].visible).toBe(true);
    expect(spec.layers![1].name).toBe('Details');
    expect(spec.layers![1].visible).toBe(false);
    expect(spec.layers![1].opacity).toBe(0.5);
  });

  test('silently skips object layers', () => {
    const map = createMinimalMap({
      layers: [
        {
          type: 'object',
          name: 'Objects',
          instances: []
        },
        {
          type: 'tile',
          name: 'Ground',
          grid: [[1]],
          tileSetId: 'ts-1',
          visible: true,
          opacity: 1
        }
      ]
    });

    const spec = MapLoader.toTerrainSpec(map);
    expect(spec.layers).toHaveLength(1);
    expect(spec.layers![0].name).toBe('Ground');
  });

  test('basePath option prepends to all image paths', () => {
    const map = createMinimalMap();
    const spec = MapLoader.toTerrainSpec(map, { basePath: '/game' });
    const tileSet = spec.layers![0].tileSet;

    expect(tileSet[1]).toBe('/game/assets/tilesets/test.png#0,0,16,16');
  });

  test('basePath with trailing slash is handled correctly', () => {
    const map = createMinimalMap();
    const spec = MapLoader.toTerrainSpec(map, { basePath: '/game/' });
    const tileSet = spec.layers![0].tileSet;

    expect(tileSet[1]).toBe('/game/assets/tilesets/test.png#0,0,16,16');
  });

  test('resolveAssetPath option is called for each unique image path and overrides basePath', () => {
    const map = createMinimalMap({
      tilesets: [
        {
          id: 'ts-1',
          imagePath: 'assets/tilesets/test.png',
          tileWidth: 16,
          tileHeight: 16,
          columns: 4,
          rows: 4,
          tileCount: 16
        },
        {
          id: 'ts-2',
          imagePath: 'assets/tilesets/other.png',
          tileWidth: 16,
          tileHeight: 16,
          columns: 4,
          rows: 4,
          tileCount: 16
        }
      ],
      layers: [
        {
          type: 'tile',
          name: 'L1',
          grid: [[1]],
          tileSetId: 'ts-1',
          visible: true,
          opacity: 1
        },
        {
          type: 'tile',
          name: 'L2',
          grid: [[2]],
          tileSetId: 'ts-2',
          visible: true,
          opacity: 1
        }
      ]
    });

    const resolver = vi.fn((path: string) => `/cdn/${path}`);
    const spec = MapLoader.toTerrainSpec(map, {
      basePath: '/should-be-ignored',
      resolveAssetPath: resolver
    });

    expect(resolver).toHaveBeenCalledWith('assets/tilesets/test.png');
    expect(resolver).toHaveBeenCalledWith('assets/tilesets/other.png');
    expect(spec.layers![0].tileSet[1]).toBe('/cdn/assets/tilesets/test.png#0,0,16,16');
    expect(spec.layers![1].tileSet[2]).toBe('/cdn/assets/tilesets/other.png#16,0,16,16');
  });

  test('throws for non-empty tile layer with missing tileset', () => {
    const map = createMinimalMap({
      layers: [
        {
          type: 'tile',
          name: 'Bad Layer',
          grid: [[1, 2]],
          tileSetId: 'nonexistent',
          visible: true,
          opacity: 1
        }
      ]
    });

    expect(() => MapLoader.toTerrainSpec(map)).toThrow('Tileset "nonexistent" not found');
  });

  test('throws when map file contains no tile layers', () => {
    const map = createMinimalMap({
      layers: [
        {
          type: 'object',
          name: 'Objects',
          instances: []
        }
      ]
    });

    expect(() => MapLoader.toTerrainSpec(map)).toThrow('Map file contains no tile layers');
  });

  test('handles map with only object layers (no tile layers)', () => {
    const map = createMinimalMap({
      layers: [
        {
          type: 'object',
          name: 'Objects',
          instances: [{ gameObjectClass: 'Player', x: 0, y: 0 }]
        }
      ]
    });

    expect(() => MapLoader.toTerrainSpec(map)).toThrow('Map file contains no tile layers');
  });

  test('empty grid (all zeros) produces a layer with an empty tileSet record', () => {
    const map = createMinimalMap({
      layers: [
        {
          type: 'tile',
          name: 'Empty',
          grid: [
            [0, 0],
            [0, 0]
          ],
          tileSetId: 'ts-1',
          visible: true,
          opacity: 1
        }
      ]
    });

    const spec = MapLoader.toTerrainSpec(map);
    expect(spec.layers![0].tileSet).toEqual({});
    expect(spec.layers![0].grid).toEqual([
      [0, 0],
      [0, 0]
    ]);
  });

  test('empty layer with blank tileSetId and all-zero grid does not throw', () => {
    const map = createMinimalMap({
      layers: [
        {
          type: 'tile',
          name: 'Blank',
          grid: [[0, 0]],
          tileSetId: '',
          visible: true,
          opacity: 1
        }
      ]
    });

    expect(() => MapLoader.toTerrainSpec(map)).not.toThrow();
    const spec = MapLoader.toTerrainSpec(map);
    expect(spec.layers![0].tileSet).toEqual({});
  });

  test('invalid tile IDs (negative, > tileCount) are replaced with 0 in output grid', () => {
    const map = createMinimalMap({
      layers: [
        {
          type: 'tile',
          name: 'L1',
          grid: [[-1, 0, 17, 1]],
          tileSetId: 'ts-1',
          visible: true,
          opacity: 1
        }
      ]
    });

    const spec = MapLoader.toTerrainSpec(map);
    expect(spec.layers![0].grid).toEqual([[0, 0, 0, 1]]);
    expect(spec.layers![0].tileSet[-1]).toBeUndefined();
    expect(spec.layers![0].tileSet[17]).toBeUndefined();
    expect(spec.layers![0].tileSet[1]).toBeDefined();
  });

  test('passability and weights arrays are passed through to the output', () => {
    const passability = [[true, false], [false, true]];
    const weights = [[1, 5], [3, 2]];

    const map = createMinimalMap({
      layers: [
        {
          type: 'tile',
          name: 'L1',
          grid: [[1, 2], [3, 4]],
          tileSetId: 'ts-1',
          visible: true,
          opacity: 1,
          passability,
          weights
        }
      ]
    });

    const spec = MapLoader.toTerrainSpec(map);
    expect(spec.layers![0].passability).toEqual(passability);
    expect(spec.layers![0].weights).toEqual(weights);
  });

  test('passability and weights are undefined when not provided', () => {
    const map = createMinimalMap();
    const spec = MapLoader.toTerrainSpec(map);
    expect(spec.layers![0].passability).toBeUndefined();
    expect(spec.layers![0].weights).toBeUndefined();
  });

  test('grid arrays are copied (not shared references)', () => {
    const map = createMinimalMap();
    const spec = MapLoader.toTerrainSpec(map);
    const originalRow = map.layers[0].type === 'tile' ? (map.layers[0] as { grid: number[][] }).grid[0] : [];
    expect(spec.layers![0].grid[0]).not.toBe(originalRow);
  });
});

describe('MapLoader.fromUrl', () => {
  test('fetches and parses JSON then delegates to toTerrainSpec', async () => {
    const map = createMinimalMap();

    const mockResponse = {
      ok: true,
      json: () => Promise.resolve(map)
    };

    const originalFetch = globalThis.fetch;
    globalThis.fetch = vi.fn().mockResolvedValue(mockResponse);

    try {
      const spec = await MapLoader.fromUrl('/maps/test.entropy-map.json');

      expect(globalThis.fetch).toHaveBeenCalledWith('/maps/test.entropy-map.json');
      expect(spec.tileWidth).toBe(32);
      expect(spec.layers).toHaveLength(1);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  test('throws on non-ok response', async () => {
    const mockResponse = {
      ok: false,
      status: 404,
      statusText: 'Not Found'
    };

    const originalFetch = globalThis.fetch;
    globalThis.fetch = vi.fn().mockResolvedValue(mockResponse);

    try {
      await expect(MapLoader.fromUrl('/maps/missing.entropy-map.json')).rejects.toThrow('404 Not Found');
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  test('passes options through to toTerrainSpec', async () => {
    const map = createMinimalMap();

    const mockResponse = {
      ok: true,
      json: () => Promise.resolve(map)
    };

    const originalFetch = globalThis.fetch;
    globalThis.fetch = vi.fn().mockResolvedValue(mockResponse);

    try {
      const spec = await MapLoader.fromUrl('/maps/test.entropy-map.json', { basePath: '/game' });
      expect(spec.layers![0].tileSet[1]).toBe('/game/assets/tilesets/test.png#0,0,16,16');
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});

// ── getGameObjects tests ──

class TestMapGameObject extends GameObject {
  protected buildInitialComponents(): Component[] {
    return [];
  }

  protected getPrefabSettings(): IPrefabSettings {
    return {
      x: 0,
      y: 0,
      rotation: 0,
      name: 'default',
      tag: 'default',
      layer: Layer.Default
    };
  }
}

class AnotherTestGameObject extends GameObject {
  protected buildInitialComponents(): Component[] {
    return [];
  }

  protected getPrefabSettings(): IPrefabSettings {
    return {
      x: 100,
      y: 200,
      rotation: 0,
      name: 'another',
      tag: 'another',
      layer: Layer.Hostile
    };
  }
}

function createObjectLayerMap(instances: IMapObjectInstance[], layerName: string = 'Object Layer 1'): IMapFile {
  return {
    name: 'TestMap',
    tileWidth: 32,
    tileHeight: 32,
    layers: [
      {
        type: 'tile',
        name: 'Ground',
        grid: [[1]],
        tileSetId: 'ts-1',
        visible: true,
        opacity: 1
      },
      {
        type: 'object',
        name: layerName,
        instances
      }
    ],
    tilesets: [
      {
        id: 'ts-1',
        imagePath: 'assets/tilesets/test.png',
        tileWidth: 16,
        tileHeight: 16,
        columns: 4,
        rows: 4,
        tileCount: 16
      }
    ]
  };
}

describe('MapLoader.getGameObjects', () => {
  let testEngine: GameEngine;
  const classRegistry = new Map<string, new (params: IGameObjectConstructionParams) => GameObject>([
    ['TestObj', TestMapGameObject],
    ['AnotherObj', AnotherTestGameObject]
  ]);

  const emptyScene: IScene = {
    name: 'Empty',
    loadOrder: 1,
    terrainSpec: null,
    getSkybox(): RectangleBackground { return null!; },
    getStartingGameObjects(): GameObject[] { return []; },
    async getAssetPool(): Promise<AssetPool> { return null!; }
  };

  beforeAll(async () => {
    const gameCanvas = document.createElement('canvas');
    testEngine = new GameEngine({ gameCanvas });
    testEngine.setScenes([emptyScene]);
    await testEngine.loadScene(1);
  });

  test('instantiates GameObjects from object layer instances', () => {
    const map = createObjectLayerMap([
      { gameObjectClass: 'TestObj', x: 100, y: 200 },
      { gameObjectClass: 'AnotherObj', x: 300, y: 400 }
    ]);

    const objects = MapLoader.getGameObjects(map, classRegistry, testEngine);

    expect(objects).toHaveLength(2);
    expect(objects[0]).toBeInstanceOf(TestMapGameObject);
    expect(objects[0].transform.position.x).toBe(100);
    expect(objects[0].transform.position.y).toBe(200);
    expect(objects[1]).toBeInstanceOf(AnotherTestGameObject);
    expect(objects[1].transform.position.x).toBe(300);
    expect(objects[1].transform.position.y).toBe(400);
  });

  test('applies name, tag, layer, rotation, and id from instance data', () => {
    const map = createObjectLayerMap([
      {
        id: 'custom-id',
        gameObjectClass: 'TestObj',
        name: 'MyPlayer',
        tag: 'player',
        layer: Layer.Friendly,
        x: 50,
        y: 60,
        rotation: 1.5
      }
    ]);

    const objects = MapLoader.getGameObjects(map, classRegistry, testEngine);

    expect(objects).toHaveLength(1);
    expect(objects[0].id).toBe('custom-id');
    expect(objects[0].name).toBe('MyPlayer');
    expect(objects[0].tag).toBe('player');
    expect(objects[0].layer).toBe(Layer.Friendly);
    expect(objects[0].transform.rotation).toBe(1.5);
  });

  test('uses gameObjectClass as default name when name is not provided', () => {
    const map = createObjectLayerMap([
      { gameObjectClass: 'TestObj', x: 0, y: 0 }
    ]);

    const objects = MapLoader.getGameObjects(map, classRegistry, testEngine);
    expect(objects[0].name).toBe('TestObj');
  });

  test('warns and skips unknown class names', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const map = createObjectLayerMap([
      { gameObjectClass: 'NonExistent', x: 0, y: 0 },
      { gameObjectClass: 'TestObj', x: 10, y: 20 }
    ]);

    const objects = MapLoader.getGameObjects(map, classRegistry, testEngine);

    expect(objects).toHaveLength(1);
    expect(objects[0]).toBeInstanceOf(TestMapGameObject);
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('Unknown game object class "NonExistent"')
    );

    warnSpy.mockRestore();
  });

  test('sorts instances by zIndex', () => {
    const map = createObjectLayerMap([
      { gameObjectClass: 'AnotherObj', x: 0, y: 0, zIndex: 5 },
      { gameObjectClass: 'TestObj', x: 10, y: 10, zIndex: 1 },
      { gameObjectClass: 'TestObj', x: 20, y: 20, zIndex: 3 }
    ]);

    const objects = MapLoader.getGameObjects(map, classRegistry, testEngine);

    expect(objects).toHaveLength(3);
    expect(objects[0]).toBeInstanceOf(TestMapGameObject);
    expect(objects[0].transform.position.x).toBe(10);
    expect(objects[1]).toBeInstanceOf(TestMapGameObject);
    expect(objects[1].transform.position.x).toBe(20);
    expect(objects[2]).toBeInstanceOf(AnotherTestGameObject);
    expect(objects[2].transform.position.x).toBe(0);
  });

  test('returns empty array when map has no object layers', () => {
    const map: IMapFile = {
      name: 'TestMap',
      tileWidth: 32,
      tileHeight: 32,
      layers: [
        { type: 'tile', name: 'Ground', grid: [[1]], tileSetId: 'ts-1', visible: true, opacity: 1 }
      ],
      tilesets: [
        { id: 'ts-1', imagePath: 'test.png', tileWidth: 16, tileHeight: 16, columns: 4, rows: 4, tileCount: 16 }
      ]
    };

    const objects = MapLoader.getGameObjects(map, classRegistry, testEngine);
    expect(objects).toEqual([]);
  });

  test('returns empty array when object layer has empty instances', () => {
    const map = createObjectLayerMap([]);
    const objects = MapLoader.getGameObjects(map, classRegistry, testEngine);
    expect(objects).toEqual([]);
  });

  test('applies scale from instance data', () => {
    const map = createObjectLayerMap([
      { gameObjectClass: 'TestObj', x: 0, y: 0, scaleX: 2, scaleY: 3 }
    ]);

    const objects = MapLoader.getGameObjects(map, classRegistry, testEngine);

    expect(objects[0].transform.scale.x).toBe(2);
    expect(objects[0].transform.scale.y).toBe(3);
  });

  test('does not modify scale when scaleX or scaleY is not provided', () => {
    const map = createObjectLayerMap([
      { gameObjectClass: 'TestObj', x: 0, y: 0, scaleX: 2 }
    ]);

    const objects = MapLoader.getGameObjects(map, classRegistry, testEngine);

    expect(objects[0].transform.scale.x).toBe(1);
    expect(objects[0].transform.scale.y).toBe(1);
  });

  test('sets enabled to false when instance specifies enabled: false', () => {
    const map = createObjectLayerMap([
      { gameObjectClass: 'TestObj', x: 0, y: 0, enabled: false }
    ]);

    const objects = MapLoader.getGameObjects(map, classRegistry, testEngine);
    expect(objects[0].enabled).toBe(false);
  });

  test('defaults enabled to true when not specified', () => {
    const map = createObjectLayerMap([
      { gameObjectClass: 'TestObj', x: 0, y: 0 }
    ]);

    const objects = MapLoader.getGameObjects(map, classRegistry, testEngine);
    expect(objects[0].enabled).toBe(true);
  });

  test('merges custom properties into constructor params', () => {
    const constructorSpy = vi.fn();

    class SpyGameObject extends GameObject {
      public constructor(params: IGameObjectConstructionParams) {
        super(params);
        constructorSpy(params);
      }

      protected buildInitialComponents(): Component[] { return []; }

      protected getPrefabSettings(): IPrefabSettings {
        return { x: 0, y: 0, rotation: 0, name: 'spy', tag: 'spy', layer: Layer.Default };
      }
    }

    const registry = new Map<string, new (params: IGameObjectConstructionParams) => GameObject>([
      ['SpyObj', SpyGameObject]
    ]);

    const map = createObjectLayerMap([
      { gameObjectClass: 'SpyObj', x: 5, y: 10, properties: { customField: 'hello', anotherField: 42 } }
    ]);

    MapLoader.getGameObjects(map, registry, testEngine);

    expect(constructorSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        x: 5,
        y: 10,
        customField: 'hello',
        anotherField: 42
      })
    );
  });

  test('handles multiple object layers', () => {
    const map: IMapFile = {
      name: 'TestMap',
      tileWidth: 32,
      tileHeight: 32,
      layers: [
        {
          type: 'object',
          name: 'Layer A',
          instances: [{ gameObjectClass: 'TestObj', x: 1, y: 1 }]
        },
        {
          type: 'tile',
          name: 'Ground',
          grid: [[1]],
          tileSetId: 'ts-1',
          visible: true,
          opacity: 1
        },
        {
          type: 'object',
          name: 'Layer B',
          instances: [{ gameObjectClass: 'AnotherObj', x: 2, y: 2 }]
        }
      ],
      tilesets: [
        { id: 'ts-1', imagePath: 'test.png', tileWidth: 16, tileHeight: 16, columns: 4, rows: 4, tileCount: 16 }
      ]
    };

    const objects = MapLoader.getGameObjects(map, classRegistry, testEngine);

    expect(objects).toHaveLength(2);
    expect(objects[0]).toBeInstanceOf(TestMapGameObject);
    expect(objects[1]).toBeInstanceOf(AnotherTestGameObject);
  });
});
