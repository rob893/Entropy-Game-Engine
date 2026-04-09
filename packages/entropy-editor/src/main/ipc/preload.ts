import { contextBridge, ipcRenderer } from 'electron';
import { IPC_CHANNELS } from '../../shared/constants';
import type { IElectronAPI, MenuAction } from '../../shared/types';

const electronAPI: IElectronAPI = {
  projectOpen: () => ipcRenderer.invoke(IPC_CHANNELS.PROJECT_OPEN),
  projectScan: projectPath => ipcRenderer.invoke(IPC_CHANNELS.PROJECT_SCAN, projectPath),
  projectReadImage: absolutePath => ipcRenderer.invoke(IPC_CHANNELS.PROJECT_READ_IMAGE, absolutePath),
  projectReadMap: filePath => ipcRenderer.invoke(IPC_CHANNELS.PROJECT_READ_MAP, filePath),
  projectSaveMap: (projectPath, filePath, data) => ipcRenderer.invoke(IPC_CHANNELS.PROJECT_SAVE_MAP, projectPath, filePath, data),
  projectCreateMap: (projectPath, name, tileWidth, tileHeight) =>
    ipcRenderer.invoke(IPC_CHANNELS.PROJECT_CREATE_MAP, projectPath, name, tileWidth, tileHeight),
  projectImportTileset: projectPath => ipcRenderer.invoke(IPC_CHANNELS.PROJECT_IMPORT_TILESET, projectPath),

  discoverPrefabs: projectPath => ipcRenderer.invoke(IPC_CHANNELS.PREFAB_DISCOVER, projectPath),
  readPrefab: filePath => ipcRenderer.invoke(IPC_CHANNELS.PREFAB_READ, filePath),
  writePrefab: (filePath, prefab) => ipcRenderer.invoke(IPC_CHANNELS.PREFAB_WRITE, filePath, prefab),
  deletePrefab: filePath => ipcRenderer.invoke(IPC_CHANNELS.PREFAB_DELETE, filePath),

  exportPng: pngDataUrl => ipcRenderer.invoke(IPC_CHANNELS.EXPORT_PNG, pngDataUrl),
  exportTiled: jsonData => ipcRenderer.invoke(IPC_CHANNELS.EXPORT_TILED, jsonData),
  exportScene: jsonData => ipcRenderer.invoke(IPC_CHANNELS.EXPORT_SCENE, jsonData),
  exportPrefabManifest: jsonData => ipcRenderer.invoke(IPC_CHANNELS.EXPORT_PREFAB_MANIFEST, jsonData),
  exportPrefabTypes: dtsContent => ipcRenderer.invoke(IPC_CHANNELS.EXPORT_PREFAB_TYPES, dtsContent),

  settingsLoadGlobal: () => ipcRenderer.invoke(IPC_CHANNELS.SETTINGS_LOAD_GLOBAL),
  settingsSaveGlobal: settings => ipcRenderer.invoke(IPC_CHANNELS.SETTINGS_SAVE_GLOBAL, settings),
  settingsLoadProject: projectPath => ipcRenderer.invoke(IPC_CHANNELS.SETTINGS_LOAD_PROJECT, projectPath),
  settingsSaveProject: (projectPath, settings) =>
    ipcRenderer.invoke(IPC_CHANNELS.SETTINGS_SAVE_PROJECT, projectPath, settings),

  onMenuAction: (callback: (action: MenuAction) => void) => {
    const handler = (_event: unknown, action: MenuAction): void => callback(action);
    ipcRenderer.on(IPC_CHANNELS.MENU_ACTION, handler);
    return () => {
      ipcRenderer.removeListener(IPC_CHANNELS.MENU_ACTION, handler);
    };
  }
};

contextBridge.exposeInMainWorld('electronAPI', electronAPI);
