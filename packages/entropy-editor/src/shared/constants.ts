export const FILE_EXTENSION = '.entropy-map';
export const FILE_FILTER_NAME = 'Entropy Map';
export const TILED_EXTENSION = '.tmj';
export const TILED_FILTER_NAME = 'Tiled JSON Map';
export const PNG_FILTER_NAME = 'PNG Image';

export const IPC_CHANNELS = {
  FILE_NEW: 'file:new',
  FILE_OPEN: 'file:open',
  FILE_SAVE: 'file:save',
  FILE_SAVE_AS: 'file:save-as',
  TILESET_IMPORT: 'tileset:import',
  EXPORT_PNG: 'export:png',
  EXPORT_TILED: 'export:tiled'
} as const;
