import type { IEditorMapFile, IEditorTileLayer } from '../../shared/types';

interface ITiledMap {
  tiledversion: string;
  type: 'map';
  version: string;
  orientation: 'orthogonal';
  renderorder: 'right-down';
  width: number;
  height: number;
  tilewidth: number;
  tileheight: number;
  layers: ITiledLayer[];
  tilesets: ITiledTileset[];
  infinite: false;
}

interface ITiledLayer {
  id: number;
  name: string;
  type: 'tilelayer';
  visible: boolean;
  opacity: number;
  x: number;
  y: number;
  width: number;
  height: number;
  data: number[];
}

interface ITiledTileset {
  firstgid: number;
  name: string;
  tilewidth: number;
  tileheight: number;
  columns: number;
  tilecount: number;
  image: string;
  imagewidth: number;
  imageheight: number;
}

export function exportToTiled(mapFile: IEditorMapFile): string {
  const tileLayers = mapFile.layers.filter((layer): layer is IEditorTileLayer => layer.type === 'tile');
  const rows = tileLayers[0]?.grid.length ?? 0;
  const cols = tileLayers[0]?.grid[0]?.length ?? 0;

  const tiledMap: ITiledMap = {
    tiledversion: '1.11.0',
    type: 'map',
    version: '1.10',
    orientation: 'orthogonal',
    renderorder: 'right-down',
    width: cols,
    height: rows,
    tilewidth: mapFile.tileWidth,
    tileheight: mapFile.tileHeight,
    infinite: false,
    layers: tileLayers.map((layer, index) => ({
      id: index + 1,
      name: layer.name,
      type: 'tilelayer' as const,
      visible: layer.visible,
      opacity: layer.opacity,
      x: 0,
      y: 0,
      width: cols,
      height: rows,
      data: layer.grid.flat()
    })),
    tilesets: mapFile.tilesets.map((tileset, index) => ({
      firstgid: index * tileset.tileCount + 1,
      name: tileset.name,
      tilewidth: tileset.tileWidth,
      tileheight: tileset.tileHeight,
      columns: tileset.columns,
      tilecount: tileset.tileCount,
      image: tileset.imagePath,
      imagewidth: tileset.columns * tileset.tileWidth,
      imageheight: tileset.rows * tileset.tileHeight
    }))
  };

  return JSON.stringify(tiledMap, null, 2);
}
