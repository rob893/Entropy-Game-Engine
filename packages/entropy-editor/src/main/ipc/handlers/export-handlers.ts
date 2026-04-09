import fs from 'node:fs/promises';
import { BrowserWindow, dialog } from 'electron';
import {
  IPC_CHANNELS,
  PNG_FILTER_NAME,
  PREFAB_MANIFEST_FILTER_NAME,
  PREFAB_TYPES_FILTER_NAME,
  SCENE_EXTENSION,
  SCENE_FILTER_NAME,
  TILED_EXTENSION,
  TILED_FILTER_NAME
} from '../../../shared/constants';
import { handle } from '../utils';

export function registerExportHandlers(): void {
  handle(IPC_CHANNELS.EXPORT_PNG, async (pngDataUrl: string): Promise<boolean> => {
    const window = BrowserWindow.getFocusedWindow();

    if (window === null) {
      return false;
    }

    const result = await dialog.showSaveDialog(window, {
      filters: [{ name: PNG_FILTER_NAME, extensions: ['png'] }]
    });

    if (result.canceled || result.filePath === undefined) {
      return false;
    }

    const base64Data = pngDataUrl.replace(/^data:image\/png;base64,/, '');
    await fs.writeFile(result.filePath, Buffer.from(base64Data, 'base64'));

    return true;
  });

  handle(IPC_CHANNELS.EXPORT_TILED, async (jsonData: string): Promise<boolean> => {
    const window = BrowserWindow.getFocusedWindow();

    if (window === null) {
      return false;
    }

    const result = await dialog.showSaveDialog(window, {
      filters: [{ name: TILED_FILTER_NAME, extensions: [TILED_EXTENSION.slice(1)] }]
    });

    if (result.canceled || result.filePath === undefined) {
      return false;
    }

    await fs.writeFile(result.filePath, jsonData, 'utf-8');

    return true;
  });

  handle(IPC_CHANNELS.EXPORT_SCENE, async (jsonData: string): Promise<boolean> => {
    const window = BrowserWindow.getFocusedWindow();

    if (window === null) {
      return false;
    }

    const result = await dialog.showSaveDialog(window, {
      filters: [{ name: SCENE_FILTER_NAME, extensions: [SCENE_EXTENSION.replace(/^\./, '')] }]
    });

    if (result.canceled || result.filePath === undefined) {
      return false;
    }

    await fs.writeFile(result.filePath, jsonData, 'utf-8');

    return true;
  });

  handle(IPC_CHANNELS.EXPORT_PREFAB_MANIFEST, async (jsonData: string): Promise<boolean> => {
    const window = BrowserWindow.getFocusedWindow();

    if (window === null) {
      return false;
    }

    const result = await dialog.showSaveDialog(window, {
      filters: [{ name: PREFAB_MANIFEST_FILTER_NAME, extensions: ['json'] }],
      defaultPath: 'prefabs.json'
    });

    if (result.canceled || result.filePath === undefined) {
      return false;
    }

    await fs.writeFile(result.filePath, jsonData, 'utf-8');

    return true;
  });

  handle(IPC_CHANNELS.EXPORT_PREFAB_TYPES, async (dtsContent: string): Promise<boolean> => {
    const window = BrowserWindow.getFocusedWindow();

    if (window === null) {
      return false;
    }

    const result = await dialog.showSaveDialog(window, {
      filters: [{ name: PREFAB_TYPES_FILTER_NAME, extensions: ['d.ts'] }],
      defaultPath: 'prefabs.d.ts'
    });

    if (result.canceled || result.filePath === undefined) {
      return false;
    }

    await fs.writeFile(result.filePath, dtsContent, 'utf-8');

    return true;
  });
}
