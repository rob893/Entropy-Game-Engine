import fs from 'node:fs/promises';
import path from 'node:path';
import { BrowserWindow, dialog } from 'electron';
import { FILE_EXTENSION, FILE_FILTER_NAME, IPC_CHANNELS } from '../../../shared/constants';
import type { IEditorMapFile, IFileOpenResult } from '../../../shared/types';
import { handle } from '../utils';

function isValidMapFile(data: unknown): data is IEditorMapFile {
  if (data === null || typeof data !== 'object') {
    return false;
  }

  const obj = data as Record<string, unknown>;

  return (
    typeof obj.name === 'string' &&
    typeof obj.tileWidth === 'number' &&
    obj.tileWidth > 0 &&
    typeof obj.tileHeight === 'number' &&
    obj.tileHeight > 0 &&
    Array.isArray(obj.layers) &&
    Array.isArray(obj.tilesets)
  );
}

function validateSavePath(filePath: string): void {
  const normalized = path.normalize(filePath);

  if (!path.isAbsolute(normalized)) {
    throw new Error('File path must be absolute');
  }

  if (!normalized.endsWith(FILE_EXTENSION)) {
    throw new Error(`File must have ${FILE_EXTENSION} extension`);
  }
}

export function registerFileHandlers(): void {
  handle(IPC_CHANNELS.FILE_NEW, async (): Promise<void> => {
    // No-op on main side — renderer handles new map state
  });

  handle(IPC_CHANNELS.FILE_OPEN, async (): Promise<IFileOpenResult | null> => {
    const window = BrowserWindow.getFocusedWindow();

    if (window === null) {
      return null;
    }

    const result = await dialog.showOpenDialog(window, {
      filters: [{ name: FILE_FILTER_NAME, extensions: [FILE_EXTENSION.slice(1)] }],
      properties: ['openFile']
    });

    if (result.canceled || result.filePaths.length === 0) {
      return null;
    }

    const filePath = result.filePaths[0];
    const content = await fs.readFile(filePath, 'utf-8');

    let data: IEditorMapFile;

    try {
      const parsed: unknown = JSON.parse(content);

      if (!isValidMapFile(parsed)) {
        throw new Error('File does not contain a valid Entropy map');
      }

      data = parsed;
    } catch (err) {
      const detail = err instanceof Error ? err.message : String(err);
      throw new Error(`Failed to read map file: ${detail}`);
    }

    return { filePath, data };
  });

  handle(IPC_CHANNELS.FILE_SAVE, async (filePath: string, data: IEditorMapFile): Promise<void> => {
    validateSavePath(filePath);

    const content = JSON.stringify(data, null, 2);
    await fs.writeFile(filePath, content, 'utf-8');
  });

  handle(IPC_CHANNELS.FILE_SAVE_AS, async (data: IEditorMapFile): Promise<string | null> => {
    const window = BrowserWindow.getFocusedWindow();

    if (window === null) {
      return null;
    }

    const result = await dialog.showSaveDialog(window, {
      filters: [{ name: FILE_FILTER_NAME, extensions: [FILE_EXTENSION.slice(1)] }],
      defaultPath: `${data.name}${FILE_EXTENSION}`
    });

    if (result.canceled || result.filePath === undefined) {
      return null;
    }

    let savePath = result.filePath;

    if (!savePath.endsWith(FILE_EXTENSION)) {
      savePath += FILE_EXTENSION;
    }

    const content = JSON.stringify(data, null, 2);
    await fs.writeFile(savePath, content, 'utf-8');

    return savePath;
  });
}
