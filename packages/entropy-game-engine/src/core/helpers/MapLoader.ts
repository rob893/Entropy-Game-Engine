import type { IMapFile, IMapLoaderOptions, IMapTileLayer, ITerrainLayer, ITerrainSpec } from '../types';

export class MapLoader {
  /**
   * Converts parsed .entropy-map JSON into an ITerrainSpec.
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
   * Fetches a .entropy-map file from a URL, parses it, and converts to ITerrainSpec.
   */
  public static async fromUrl(url: string, options?: IMapLoaderOptions): Promise<ITerrainSpec> {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to load map file from ${url}: ${response.status} ${response.statusText}`);
    }

    const mapData = (await response.json()) as IMapFile;
    return this.toTerrainSpec(mapData, options);
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
