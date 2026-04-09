export const FILE_EXTENSION = '.entropy-map.json';
export const PROJECT_FILE = 'entropy.project.json';
export const TILED_EXTENSION = '.tmj';
export const TILED_FILTER_NAME = 'Tiled JSON Map';
export const PNG_FILTER_NAME = 'PNG Image';
export const SCENE_FILTER_NAME = 'Entropy Scene';
export const SCENE_EXTENSION = '.entropy-scene.json';
export const PREFAB_MANIFEST_FILTER_NAME = 'Prefab Manifest';
export const PREFAB_TYPES_FILTER_NAME = 'TypeScript Declaration';

export const PROJECT_DIRS = {
  ASSETS: 'public/assets',
  TILESETS: 'public/assets/tilesets',
  OBJECTS: 'public/assets/objects',
  PREFABS: 'prefabs',
  MAPS: 'maps'
} as const;

export const PREFAB_EXTENSION = '.entropy-prefab.json';

export const IPC_CHANNELS = {
  PROJECT_OPEN: 'project:open',
  PROJECT_SCAN: 'project:scan',
  PROJECT_READ_IMAGE: 'project:read-image',
  PROJECT_READ_MAP: 'project:read-map',
  PROJECT_SAVE_MAP: 'project:save-map',
  PROJECT_CREATE_MAP: 'project:create-map',
  PROJECT_IMPORT_TILESET: 'project:import-tileset',
  PREFAB_DISCOVER: 'prefab:discover',
  PREFAB_READ: 'prefab:read',
  PREFAB_WRITE: 'prefab:write',
  PREFAB_DELETE: 'prefab:delete',
  EXPORT_PNG: 'export:png',
  EXPORT_TILED: 'export:tiled',
  EXPORT_SCENE: 'export:scene',
  EXPORT_PREFAB_MANIFEST: 'export:prefab-manifest',
  EXPORT_PREFAB_TYPES: 'export:prefab-types',
  MENU_ACTION: 'menu:action',
  SETTINGS_LOAD_GLOBAL: 'settings:load-global',
  SETTINGS_SAVE_GLOBAL: 'settings:save-global',
  SETTINGS_LOAD_PROJECT: 'settings:load-project',
  SETTINGS_SAVE_PROJECT: 'settings:save-project'
} as const;
