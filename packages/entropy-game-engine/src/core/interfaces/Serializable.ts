export interface SerializedComponent {
  typeName: string;
  data: Record<string, unknown>;
}

export interface SerializedGameObject {
  id: string;
  name: string;
  tag: string;
  layer: number;
  enabled: boolean;
  components: SerializedComponent[];
  children: SerializedGameObject[];
}

export interface SerializedScene {
  name: string;
  sceneId: number;
  gravity?: number;
  gameObjects: SerializedGameObject[];
  terrain?: SerializedTerrain;
}

export interface SerializedTerrain {
  tileWidth: number;
  tileHeight: number;
  // 0 = empty, positive values = passable tiles, negative values = impassable tiles.
  grid: number[][];
  tileSet?: Record<number, string>;
}
