import { registerExportHandlers } from './export-handlers';
import { registerProjectHandlers } from './project-handlers';
import { registerSettingsHandlers } from './settings-handlers';

export function registerAllHandlers(): void {
  registerProjectHandlers();
  registerExportHandlers();
  registerSettingsHandlers();
}
