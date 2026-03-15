import { registerAllHandlers } from '../ipc/handlers';
import { logger } from '../platform/telemetry';
import { registerAppEvents } from './app-events';
import { createAppMenu } from './app-menu';
import { configureCSP } from './web-security';
import { createMainWindow } from './window-factory';

export async function initializeApp(): Promise<void> {
  const timer = logger.startTimer('app:startup');
  const isDev = process.env.VITE_DEV_SERVER_URL !== undefined;

  logger.info('Initializing application', { isDev, platform: process.platform, nodeVersion: process.version });

  logger.debug('Registering IPC handlers');
  registerAllHandlers();

  logger.debug('Configuring web security');
  configureCSP();

  logger.debug('Registering app events');
  registerAppEvents();

  logger.debug('Creating main window');
  const mainWindow = createMainWindow();

  logger.debug('Creating application menu');
  createAppMenu(mainWindow);

  if (isDev) {
    logger.info('Loading dev server', { url: process.env.VITE_DEV_SERVER_URL });
    await mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL as string);
  } else {
    logger.info('Loading production build');
    await mainWindow.loadFile('dist/index.html');
  }

  timer.done(true);
  logger.info('Application initialized successfully');
}
