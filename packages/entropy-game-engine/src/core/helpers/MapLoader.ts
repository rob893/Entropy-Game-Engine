import type { GameObject } from '../../game-objects/GameObject';
import { Layer } from '../enums/Layer';
import type { GameEngine } from '../GameEngine';
import type {
  IGameObjectConstructionParams,
  IMapFile,
  IMapLoaderOptions,
  IMapObjectLayer,
  IMapTileLayer,
  ITerrainLayer,
  ITerrainSpec
} from '../types';

type GameObjectConstructor = new (params: IGameObjectConstructionParams) => GameObject;

export class MapLoader {
  /**
   * Converts parsed .entropy-map.json data into an ITerrainSpec.
   * The returned spec uses the layered terrain format that TerrainBuilder already supports.
   */
  public static toTerrainSpec(mapData: IMapFile, options?: IMapLoaderOptions): ITerrainSpec {
    const tileLayers = mapData.layers.filter(
      (layer): layer is IMapTileLayer => layer.type === 'tile'
    );

    if (tileLayers.length === 0) {
      throw new Error('Map file contains no tile layers.');
    }

    const tilesetMap = new Map(mapData.tilesets.map(ts => [ts.id, ts]));

    const layers: ITerrainLayer[] = tileLayers.map(layer =>
      this.convertTileLayer(layer, tilesetMap, options)
    );

    return {
      tileWidth: mapData.tileWidth,
      tileHeight: mapData.tileHeight,
      layers
    };
  }

  /**
   * Fetches a .entropy-map.json file from a URL, parses it, and converts to ITerrainSpec.
   */
  public static async fromUrl(url: string, options?: IMapLoaderOptions): Promise<ITerrainSpec> {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to load map file from ${url}: ${response.status} ${response.statusText}`);
    }

    const mapData = (await response.json()) as IMapFile;
    return this.toTerrainSpec(mapData, options);
  }

  /**
   * Instantiates GameObjects from the object layers of a map file.
   *
   * @param mapData - Parsed .entropy-map.json data
   * @param classRegistry - Map of className → constructor (e.g., new Map([['Player', Player]]))
   * @param gameEngine - The game engine instance
   * @returns Array of instantiated GameObjects
   */
  public static getGameObjects(
    mapData: IMapFile,
    classRegistry: ReadonlyMap<string, GameObjectConstructor>,
    gameEngine: GameEngine
  ): GameObject[] {
    const objectLayers = mapData.layers.filter(
      (layer): layer is IMapObjectLayer => layer.type === 'object'
    );

    const gameObjects: GameObject[] = [];

    for (const layer of objectLayers) {
      if (layer.instances === undefined) continue;

      const sortedInstances = [...layer.instances].sort((a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0));

      for (const instance of sortedInstances) {
        const Constructor = classRegistry.get(instance.gameObjectClass);

        if (Constructor === undefined) {
          console.warn(
            `MapLoader: Unknown game object class "${instance.gameObjectClass}". ` +
            `Register it in the class registry to instantiate it.`
          );
          continue;
        }

        const params: IGameObjectConstructionParams = {
          gameEngine,
          id: instance.id,
          name: instance.name ?? instance.gameObjectClass,
          x: instance.x,
          y: instance.y,
          rotation: instance.rotation,
          tag: instance.tag,
          layer: instance.layer as Layer | undefined
        };

        if (instance.properties !== undefined) {
          Object.assign(params, instance.properties);
        }

        const gameObject = new Constructor(params);

        if (instance.scaleX !== undefined && instance.scaleY !== undefined) {
          gameObject.transform.scale.x = instance.scaleX;
          gameObject.transform.scale.y = instance.scaleY;
        }

        if (instance.enabled === false) {
          gameObject.enabled = false;
        }

        gameObjects.push(gameObject);
      }
    }

    return gameObjects;
  }

  private static convertTileLayer(
    layer: IMapTileLayer,
    tilesetMap: Map<string, IMapFile['tilesets'][number]>,
    options?: IMapLoaderOptions
  ): ITerrainLayer {
    const hasNonZeroTile = layer.grid.some(row => row.some(id => id !== 0));

    if (!hasNonZeroTile) {
      return {
        name: layer.name,
        grid: layer.grid.map(row => [...row]),
        tileSet: {},
        visible: layer.visible,
        opacity: layer.opacity,
        passability: layer.passability?.map(row => [...row]),
        weights: layer.weights?.map(row => [...row])
      };
    }

    const tileset = tilesetMap.get(layer.tileSetId);

    if (tileset === undefined) {
      throw new Error(`Tileset "${layer.tileSetId}" not found for layer "${layer.name}".`);
    }

    const maxValidId = tileset.tileCount;
    const resolvedImagePath = this.resolveAssetPath(tileset.imagePath, options);
    const tileSet: Record<number, string> = {};
    const processedIds = new Set<number>();

    const grid = layer.grid.map(row =>
      row.map(tileId => {
        if (tileId === 0) {
          return 0;
        }

        if (tileId < 1 || tileId > maxValidId) {
          return 0;
        }

        if (!processedIds.has(tileId)) {
          processedIds.add(tileId);
          const column = (tileId - 1) % tileset.columns;
          const tileRow = Math.floor((tileId - 1) / tileset.columns);
          const sliceX = column * tileset.tileWidth;
          const sliceY = tileRow * tileset.tileHeight;
          tileSet[tileId] = `${resolvedImagePath}#${sliceX},${sliceY},${tileset.tileWidth},${tileset.tileHeight}`;
        }

        return tileId;
      })
    );

    return {
      name: layer.name,
      grid,
      tileSet,
      visible: layer.visible,
      opacity: layer.opacity,
      passability: layer.passability?.map(row => [...row]),
      weights: layer.weights?.map(row => [...row])
    };
  }

  private static resolveAssetPath(imagePath: string, options?: IMapLoaderOptions): string {
    if (options?.resolveAssetPath !== undefined) {
      return options.resolveAssetPath(imagePath);
    }

    if (options?.basePath !== undefined) {
      const base = options.basePath.endsWith('/') ? options.basePath.slice(0, -1) : options.basePath;
      const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
      return `${base}${path}`;
    }

    return imagePath;
  }
}
