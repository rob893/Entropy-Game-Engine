import { Menu } from 'electron';
import type { BrowserWindow } from 'electron';
import { IPC_CHANNELS } from '../../shared/constants';
import type { MenuAction } from '../../shared/types';

function sendMenuAction(mainWindow: BrowserWindow, action: MenuAction): void {
  mainWindow.webContents.send(IPC_CHANNELS.MENU_ACTION, action);
}

export function createAppMenu(mainWindow: BrowserWindow): void {
  const isDev = process.env.VITE_DEV_SERVER_URL !== undefined;

  const viewSubmenu: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'Toggle Grid',
      accelerator: 'G',
      click: (): void => sendMenuAction(mainWindow, 'toggle-grid')
    },
    { type: 'separator' },
    { role: 'zoomIn' },
    { role: 'zoomOut' },
    { role: 'resetZoom' }
  ];

  if (isDev) {
    viewSubmenu.push({ type: 'separator' }, { role: 'toggleDevTools' });
  }

  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New',
          accelerator: 'CmdOrCtrl+N',
          click: (): void => sendMenuAction(mainWindow, 'file-new')
        },
        {
          label: 'Open...',
          accelerator: 'CmdOrCtrl+O',
          click: (): void => sendMenuAction(mainWindow, 'file-open')
        },
        { type: 'separator' },
        {
          label: 'Save',
          accelerator: 'CmdOrCtrl+S',
          click: (): void => sendMenuAction(mainWindow, 'file-save')
        },
        {
          label: 'Save As...',
          accelerator: 'CmdOrCtrl+Shift+S',
          click: (): void => sendMenuAction(mainWindow, 'file-save-as')
        },
        { type: 'separator' },
        {
          label: 'Import Tileset...',
          click: (): void => sendMenuAction(mainWindow, 'tileset-import')
        },
        { type: 'separator' },
        {
          label: 'Export as PNG...',
          click: (): void => sendMenuAction(mainWindow, 'export-png')
        },
        {
          label: 'Export as Tiled (.tmj)...',
          click: (): void => sendMenuAction(mainWindow, 'export-tiled')
        },
        { type: 'separator' },
        { role: 'quit' }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        {
          label: 'Undo',
          accelerator: 'CmdOrCtrl+Z',
          click: (): void => sendMenuAction(mainWindow, 'undo')
        },
        {
          label: 'Redo',
          accelerator: 'CmdOrCtrl+Y',
          click: (): void => sendMenuAction(mainWindow, 'redo')
        }
      ]
    },
    {
      label: 'View',
      submenu: viewSubmenu
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}
