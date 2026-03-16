import fs from 'node:fs/promises';
import path from 'node:path';
import { BrowserWindow, dialog } from 'electron';
import { IPC_CHANNELS } from '../../../shared/constants';
import type { ITilesetImportResult } from '../../../shared/types';
import { handle } from '../utils';

export function registerTilesetHandlers(): void {
  handle(IPC_CHANNELS.TILESET_IMPORT, async (): Promise<ITilesetImportResult | null> => {
    const window = BrowserWindow.getFocusedWindow();

    if (window === null) {
      return null;
    }

    const result = await dialog.showOpenDialog(window, {
      filters: [{ name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'webp'] }],
      properties: ['openFile']
    });

    if (result.canceled || result.filePaths.length === 0) {
      return null;
    }

    const filePath = result.filePaths[0];
    const buffer = await fs.readFile(filePath);
    const ext = path.extname(filePath).slice(1).toLowerCase();
    const mimeType = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : `image/${ext}`;
    const imageDataUrl = `data:${mimeType};base64,${buffer.toString('base64')}`;

    // Dimensions are measured in the renderer via Image element
    return { filePath, imageDataUrl, width: 0, height: 0 };
  });
}
