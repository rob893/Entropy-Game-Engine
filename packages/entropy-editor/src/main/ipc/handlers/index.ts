import { registerExportHandlers } from './export-handlers';
import { registerProjectHandlers } from './project-handlers';

export function registerAllHandlers(): void {
  registerProjectHandlers();
  registerExportHandlers();
}
