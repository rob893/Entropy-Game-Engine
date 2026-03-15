interface IAppSettings {
  recentFiles: string[];
  lastTileSize: number;
  showGrid: boolean;
}

const DEFAULT_SETTINGS: IAppSettings = {
  recentFiles: [],
  lastTileSize: 32,
  showGrid: true
};

export function getDefaultSettings(): IAppSettings {
  return { ...DEFAULT_SETTINGS };
}

export type { IAppSettings };
