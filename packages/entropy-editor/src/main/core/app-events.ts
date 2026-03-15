import { app } from 'electron';
import { logger } from '../platform/telemetry';

export function registerAppEvents(): void {
  app.on('window-all-closed', () => {
    logger.info('All windows closed', { platform: process.platform });

    if (process.platform !== 'darwin') {
      logger.info('Quitting application');
      logger.flush();
      app.quit();
    }
  });

  app.on('will-quit', () => {
    logger.info('Application will quit');
    logger.flush();
  });
}
