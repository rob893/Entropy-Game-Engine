import path from 'node:path';
import { app, BrowserWindow } from 'electron';

export function createMainWindow(): BrowserWindow {
  const isDev = process.env.VITE_DEV_SERVER_URL !== undefined;
  const iconPath = path.join(app.getAppPath(), 'resources', 'icon.png');

  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 960,
    minHeight: 600,
    title: 'Entropy Terrain Editor',
    icon: iconPath,
    show: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
      devTools: isDev,
      preload: path.join(__dirname, '../preload/preload.js')
    }
  });

  mainWindow.maximize();
  mainWindow.show();

  mainWindow.webContents.on('will-navigate', (event, url) => {
    // Allow dev server reloads (HMR full refresh), block everything else
    const devServerUrl = process.env.VITE_DEV_SERVER_URL;

    if (devServerUrl === undefined || !url.startsWith(devServerUrl)) {
      event.preventDefault();
    }
  });

  mainWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));

  return mainWindow;
}
