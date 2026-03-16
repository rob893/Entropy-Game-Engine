import { contextBridge, ipcRenderer } from 'electron';
import { IPC_CHANNELS } from '../../shared/constants';
import type { IElectronAPI, MenuAction } from '../../shared/types';

const electronAPI: IElectronAPI = {
  fileNew: () => ipcRenderer.invoke(IPC_CHANNELS.FILE_NEW),
  fileOpen: () => ipcRenderer.invoke(IPC_CHANNELS.FILE_OPEN),
  fileSave: (filePath, data) => ipcRenderer.invoke(IPC_CHANNELS.FILE_SAVE, filePath, data),
  fileSaveAs: data => ipcRenderer.invoke(IPC_CHANNELS.FILE_SAVE_AS, data),

  tilesetImport: () => ipcRenderer.invoke(IPC_CHANNELS.TILESET_IMPORT),

  exportPng: pngDataUrl => ipcRenderer.invoke(IPC_CHANNELS.EXPORT_PNG, pngDataUrl),
  exportTiled: jsonData => ipcRenderer.invoke(IPC_CHANNELS.EXPORT_TILED, jsonData),

  onMenuAction: (callback: (action: MenuAction) => void) => {
    const handler = (_event: unknown, action: MenuAction): void => callback(action);
    ipcRenderer.on(IPC_CHANNELS.MENU_ACTION, handler);
    return () => {
      ipcRenderer.removeListener(IPC_CHANNELS.MENU_ACTION, handler);
    };
  }
};

contextBridge.exposeInMainWorld('electronAPI', electronAPI);
