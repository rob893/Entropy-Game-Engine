import { registerExportHandlers } from './export-handlers';
import { registerFileHandlers } from './file-handlers';
import { registerTilesetHandlers } from './tileset-handlers';

export function registerAllHandlers(): void {
  registerFileHandlers();
  registerTilesetHandlers();
  registerExportHandlers();
}
