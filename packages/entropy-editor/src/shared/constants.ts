export const FILE_EXTENSION = '.entropy-map';
export const PROJECT_FILE = 'entropy.project.json';
export const TILED_EXTENSION = '.tmj';
export const TILED_FILTER_NAME = 'Tiled JSON Map';
export const PNG_FILTER_NAME = 'PNG Image';

export const PROJECT_DIRS = {
  ASSETS: 'public/assets',
  TILESETS: 'public/assets/tilesets',
  OBJECTS: 'public/assets/objects',
  MAPS: 'maps'
} as const;

export const IPC_CHANNELS = {
  PROJECT_OPEN: 'project:open',
  PROJECT_SCAN: 'project:scan',
  PROJECT_READ_IMAGE: 'project:read-image',
  PROJECT_READ_MAP: 'project:read-map',
  PROJECT_SAVE_MAP: 'project:save-map',
  PROJECT_CREATE_MAP: 'project:create-map',
  PROJECT_IMPORT_TILESET: 'project:import-tileset',
  PROJECT_IMPORT_OBJECTS: 'project:import-objects',
  EXPORT_PNG: 'export:png',
  EXPORT_TILED: 'export:tiled',
  MENU_ACTION: 'menu:action'
} as const;
