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

    const { width, height } = await getImageDimensions(imageDataUrl);

    return { filePath, imageDataUrl, width, height };
  });
}

function getImageDimensions(dataUrl: string): Promise<{ width: number; height: number }> {
  // Main process doesn't have Image — return 0,0 and let renderer measure
  const sizeMatch = dataUrl.match(/^data:image\/png;base64,/);

  if (sizeMatch !== null) {
    return Promise.resolve({ width: 0, height: 0 });
  }

  return Promise.resolve({ width: 0, height: 0 });
}
