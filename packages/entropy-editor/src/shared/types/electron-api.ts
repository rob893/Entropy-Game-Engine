import type { IEditorMapFile, IFileOpenResult, ITilesetImportResult } from './terrain';

export type MenuAction =
  | 'file-new'
  | 'file-open'
  | 'file-save'
  | 'file-save-as'
  | 'tileset-import'
  | 'export-png'
  | 'export-tiled'
  | 'undo'
  | 'redo'
  | 'toggle-grid';

export interface IElectronAPI {
  // File operations
  fileNew(): Promise<void>;
  fileOpen(): Promise<IFileOpenResult | null>;
  fileSave(filePath: string, data: IEditorMapFile): Promise<void>;
  fileSaveAs(data: IEditorMapFile): Promise<string | null>;

  // Tileset operations
  tilesetImport(): Promise<ITilesetImportResult | null>;

  // Export operations
  exportPng(pngDataUrl: string): Promise<boolean>;
  exportTiled(jsonData: string): Promise<boolean>;

  // Menu events (main → renderer push)
  onMenuAction(callback: (action: MenuAction) => void): () => void;
}
