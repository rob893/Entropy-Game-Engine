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
  projectImportObjects: projectPath => ipcRenderer.invoke(IPC_CHANNELS.PROJECT_IMPORT_OBJECTS, projectPath),

  exportPng: pngDataUrl => ipcRenderer.invoke(IPC_CHANNELS.EXPORT_PNG, pngDataUrl),
  exportTiled: jsonData => ipcRenderer.invoke(IPC_CHANNELS.EXPORT_TILED, jsonData),

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
