import type { IDiscoveredUserComponent } from './prefab';
import type { IEditorPrefabInstance } from './prefab';

// ── Tile Layer Types ──

export interface IEditorTileLayer {
  type: 'tile';
  name: string;
  grid: number[][];
  tileSetId: string;
  visible: boolean;
  opacity: number;
  passability?: boolean[][];
  weights?: number[][];
}

// ── Object Layer Types ──

export interface IEditorObjectLayer {
  type: 'object';
  name: string;
  instances: IEditorPrefabInstance[];
  visible: boolean;
  opacity: number;
}

export type EditorLayer = IEditorTileLayer | IEditorObjectLayer;

// ── Map File ──

export interface IEditorMapFile {
  name: string;
  tileWidth: number;
  tileHeight: number;
  layers: EditorLayer[];
  tilesets: IEditorTileset[];
  prefabIds: string[];
}

// ── Tileset ──

export interface IEditorTileset {
  id: string;
  name: string;
  imagePath: string;
  imageDataUrl: string;
  tileWidth: number;
  tileHeight: number;
  columns: number;
  rows: number;
  tileCount: number;
}

// ── IPC Result Types ──

export interface IFileOpenResult {
  filePath: string;
  data: IEditorMapFile;
}

// ── Project Types ──

export interface IEntropyProject {
  name: string;
  version: string;
  defaultScene: string;
}

export interface IProjectScanResult {
  projectPath: string;
  config: IEntropyProject;
  maps: string[];
  tilesets: IDiscoveredAsset[];
  userComponents: IDiscoveredUserComponent[];
}

export interface IDiscoveredAsset {
  relativePath: string;
  name: string;
  category: string;
  imageDataUrl: string;
  width: number;
  height: number;
}
