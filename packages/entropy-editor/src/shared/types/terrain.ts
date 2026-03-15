export interface IEditorMapFile {
  name: string;
  tileWidth: number;
  tileHeight: number;
  layers: IEditorLayer[];
  tilesets: IEditorTileset[];
}

export interface IEditorLayer {
  name: string;
  grid: number[][];
  tileSetId: string;
  visible: boolean;
  opacity: number;
  passability?: boolean[][];
  weights?: number[][];
}

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

export interface IFileOpenResult {
  filePath: string;
  data: IEditorMapFile;
}

export interface ITilesetImportResult {
  filePath: string;
  imageDataUrl: string;
  width: number;
  height: number;
}
