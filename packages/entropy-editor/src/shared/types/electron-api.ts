import type { IEditorMapFile, IFileOpenResult, IProjectScanResult } from './terrain';

export type MenuAction =
  | 'file-new'
  | 'file-save'
  | 'open-project'
  | 'tileset-import'
  | 'objects-import'
  | 'export-png'
  | 'export-tiled'
  | 'undo'
  | 'redo'
  | 'toggle-grid';

export interface IElectronAPI {
  // Project operations
  projectOpen(): Promise<IProjectScanResult | null>;
  projectScan(projectPath: string): Promise<IProjectScanResult>;
  projectReadImage(absolutePath: string): Promise<string>;
  projectReadMap(filePath: string): Promise<IEditorMapFile>;
  projectSaveMap(projectPath: string, filePath: string, data: IEditorMapFile): Promise<void>;
  projectCreateMap(projectPath: string, name: string, tileWidth: number, tileHeight: number): Promise<IFileOpenResult>;

  // Asset operations
  projectImportTileset(projectPath: string): Promise<string | null>;
  projectImportObjects(projectPath: string): Promise<string[] | null>;

  // Export operations
  exportPng(pngDataUrl: string): Promise<boolean>;
  exportTiled(jsonData: string): Promise<boolean>;

  // Menu events (main → renderer push)
  onMenuAction(callback: (action: MenuAction) => void): () => void;
}
