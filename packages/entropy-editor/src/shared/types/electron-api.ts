import type { IGlobalSettings, IProjectSettings } from './editor-settings';
import type { IEditorPrefab } from './prefab';
import type { IEditorMapFile, IFileOpenResult, IProjectScanResult } from './terrain';

export type MenuAction =
  | 'file-new'
  | 'file-save'
  | 'open-project'
  | 'tileset-import'
  | 'export-png'
  | 'export-tiled'
  | 'undo'
  | 'redo'
  | 'toggle-grid';

export interface IDiscoveredPrefab {
  readonly filePath: string;
  readonly prefab: IEditorPrefab;
}

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

  // Prefab operations
  discoverPrefabs(projectPath: string): Promise<IDiscoveredPrefab[]>;
  readPrefab(filePath: string): Promise<IEditorPrefab>;
  writePrefab(filePath: string, prefab: IEditorPrefab): Promise<void>;
  deletePrefab(filePath: string): Promise<void>;

  // Export operations
  exportPng(pngDataUrl: string): Promise<boolean>;
  exportTiled(jsonData: string): Promise<boolean>;

  // Settings operations
  settingsLoadGlobal(): Promise<IGlobalSettings>;
  settingsSaveGlobal(settings: Partial<IGlobalSettings>): Promise<void>;
  settingsLoadProject(projectPath: string): Promise<IProjectSettings>;
  settingsSaveProject(projectPath: string, settings: Partial<IProjectSettings>): Promise<void>;

  // Menu events (main → renderer push)
  onMenuAction(callback: (action: MenuAction) => void): () => void;
}
