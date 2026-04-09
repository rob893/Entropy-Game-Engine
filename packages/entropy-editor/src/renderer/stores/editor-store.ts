import type { ISerializedScene } from '@entropy-engine/entropy-game-engine';
import { create } from 'zustand';
import { FILE_EXTENSION } from '../../shared/constants';
import type {
  BrushShape,
  EditorLayer,
  EditorMode,
  IDiscoveredAsset,
  IEditorMapFile,
  IEditorObjectLayer,
  IEditorPrefab,
  IEditorPrefabInstance,
  IEditorTileLayer,
  IEditorTileset,
  IEntropyProject,
  IProjectScanResult,
  IProjectSettings
} from '../../shared/types';
import { getErrorMessage } from '../../shared/utils/errors';
import { bakeAllInstances } from '../editor/PrefabBaker';
import { generatePrefabManifest, generatePrefabTypeDeclaration } from '../editor/PrefabManifestExporter';
import { exportToTiled } from '../editor/TiledExporter';

export type { BrushShape, EditorMode } from '../../shared/types';
export type EditorTool = 'brush' | 'eraser' | 'fill' | 'eyedropper' | 'select';

const MAX_UNDO_HISTORY = 50;
let savedMapRef: IEditorMapFile | null = null;

function normalizeSelections(
  mapFile: IEditorMapFile,
  state: Pick<IEditorState, 'activeLayerIndex' | 'activeTilesetId' | 'selectedPrefabId'>,
  prefabs: IEditorPrefab[]
): Partial<IEditorState> {
  const maxLayerIndex = Math.max(0, mapFile.layers.length - 1);
  const activeLayerIndex = Math.min(state.activeLayerIndex, maxLayerIndex);

  const tilesetIds = new Set(mapFile.tilesets.map(t => t.id));
  const activeTilesetId = state.activeTilesetId !== null && tilesetIds.has(state.activeTilesetId)
    ? state.activeTilesetId
    : mapFile.tilesets[0]?.id ?? null;

  const prefabIds = new Set(prefabs.map(p => p.id));
  const selectedPrefabId = state.selectedPrefabId !== null && prefabIds.has(state.selectedPrefabId)
    ? state.selectedPrefabId
    : null;

  return {
    activeLayerIndex,
    activeTilesetId,
    selectedPrefabId,
    selectedInstanceId: null
  };
}

interface IEditorState {
  // Map state
  mapFile: IEditorMapFile | null;
  filePath: string | null;

  // Project state
  projectPath: string | null;
  projectConfig: IEntropyProject | null;
  availableMaps: string[];
  discoveredTilesets: IDiscoveredAsset[];
  isDirty: boolean;

  // Prefab state
  prefabs: IEditorPrefab[];
  selectedInstanceId: string | null;
  selectedPrefabId: string | null;

  // Tool state
  activeTool: EditorTool;
  activeLayerIndex: number;
  activeTileId: number;
  activeTilesetId: string | null;
  brushSize: number;
  brushShape: BrushShape;
  showGrid: boolean;
  objectSnapToGrid: boolean;
  editorMode: EditorMode;
  activeWeight: number;
  showPassability: boolean;
  showWeights: boolean;

  // UI state
  isInitializing: boolean;
  error: string | null;
  canvasElement: HTMLCanvasElement | null;

  // Actions
  setMapFile: (mapFile: IEditorMapFile, filePath?: string) => void;
  setDirty: (dirty: boolean) => void;
  setActiveTool: (tool: EditorTool) => void;
  setActiveLayer: (index: number) => void;
  setActiveTileId: (id: number) => void;
  setActiveTile: (tileId: number, tilesetId: string) => void;
  toggleGrid: () => void;
  setBrushSize: (size: number) => void;
  setBrushShape: (shape: BrushShape) => void;
  setEditorMode: (mode: EditorMode) => void;
  setActiveWeight: (weight: number) => void;
  togglePassabilityOverlay: () => void;
  toggleWeightsOverlay: () => void;
  setError: (error: string | null) => void;
  setCanvasElement: (canvas: HTMLCanvasElement | null) => void;

  // History
  undoStack: readonly IEditorMapFile[];
  redoStack: readonly IEditorMapFile[];
  pushUndoSnapshot: () => void;
  undo: () => void;
  redo: () => void;

  // Map operations
  updateLayer: (layerIndex: number, layer: EditorLayer) => void;
  setMapName: (name: string) => void;
  setMapTileSize: (tileWidth: number, tileHeight: number) => void;
  resizeMap: (rows: number, cols: number) => void;
  addLayer: (name: string) => void;

  // Object layer operations
  addObjectLayer: (name: string) => void;
  toggleObjectSnap: () => void;

  // Prefab operations
  loadPrefabs: (prefabs: IEditorPrefab[]) => void;
  createPrefab: (prefab: IEditorPrefab) => Promise<void>;
  updatePrefab: (prefab: IEditorPrefab) => Promise<void>;
  deletePrefab: (prefabId: string) => Promise<void>;

  // Instance operations
  placeInstance: (prefabId: string, x: number, y: number) => void;
  selectInstance: (instanceId: string | null) => void;
  moveInstance: (instanceId: string, x: number, y: number) => void;
  rotateInstance: (instanceId: string, rotation: number) => void;
  scaleInstance: (instanceId: string, scaleX: number, scaleY: number) => void;
  deleteInstance: (instanceId: string) => void;
  setSelectedPrefabId: (id: string | null) => void;

  removeLayer: (index: number) => void;
  setLayerVisibility: (index: number, visible: boolean) => void;
  setLayerOpacity: (index: number, opacity: number) => void;
  addTileset: (tileset: IEditorTileset) => void;
  removeTileset: (tilesetId: string) => void;

  // File operations
  saveFile: () => Promise<void>;

  // Project operations
  openProject: () => Promise<void>;
  loadMapFromProject: (mapFilePath: string) => Promise<void>;
  createMapInProject: (name: string, rows: number, cols: number, tileWidth: number, tileHeight: number) => Promise<void>;
  importTilesetToProject: () => Promise<void>;

  // Export operations
  exportPng: () => Promise<void>;
  exportTiledMap: () => Promise<void>;
  exportScene: () => Promise<void>;
  exportPrefabManifest: () => Promise<void>;
  exportPrefabTypes: () => Promise<void>;

  // Settings operations
  initializeSettings: () => Promise<void>;
  openProjectByPath: (projectPath: string) => Promise<void>;
}

function createGrid(rows: number, cols: number): number[][] {
  return Array.from({ length: rows }, () => new Array<number>(cols).fill(0));
}

function getProjectTilesetLayout(
  asset: IDiscoveredAsset,
  mapTileWidth: number,
  mapTileHeight: number
): Pick<IEditorTileset, 'tileWidth' | 'tileHeight' | 'columns' | 'rows' | 'tileCount'> {
  const tileWidth = mapTileWidth > 0 ? mapTileWidth : asset.width;
  const tileHeight = mapTileHeight > 0 ? mapTileHeight : asset.height;
  const columns = Math.max(1, Math.floor(asset.width / tileWidth));
  const rows = Math.max(1, Math.floor(asset.height / tileHeight));

  return {
    tileWidth,
    tileHeight,
    columns,
    rows,
    tileCount: columns * rows
  };
}

function createProjectTileset(
  asset: IDiscoveredAsset,
  mapTileWidth: number,
  mapTileHeight: number
): IEditorTileset {
  return {
    id: crypto.randomUUID(),
    name: asset.name,
    imagePath: asset.relativePath,
    imageDataUrl: asset.imageDataUrl,
    ...getProjectTilesetLayout(asset, mapTileWidth, mapTileHeight)
  };
}

function getInitialProjectMapPath(projectScan: IProjectScanResult): string | null {
  const defaultMapPath = projectScan.maps.find(mapPath =>
    mapPath.endsWith(`${projectScan.config.defaultScene}${FILE_EXTENSION}`)
  );

  return defaultMapPath ?? projectScan.maps[0] ?? null;
}

function stripProjectMapImageData(mapFile: IEditorMapFile): IEditorMapFile {
  return {
    ...mapFile,
    tilesets: mapFile.tilesets.map(tileset => ({ ...tileset, imageDataUrl: '' }))
  };
}

function mergeProjectAssetsIntoMap(
  mapFile: IEditorMapFile,
  discoveredTilesets: IDiscoveredAsset[]
): IEditorMapFile {
  const hydratedTilesets = mapFile.tilesets.map(tileset => {
    const discovered = discoveredTilesets.find(asset => asset.relativePath === tileset.imagePath);

    return discovered === undefined
      ? tileset
      : {
          ...tileset,
          name: discovered.name,
          imagePath: discovered.relativePath,
          imageDataUrl: discovered.imageDataUrl,
          ...getProjectTilesetLayout(discovered, mapFile.tileWidth, mapFile.tileHeight)
        };
  });

  const tilePaths = new Set(hydratedTilesets.map(tileset => tileset.imagePath));

  return {
    ...mapFile,
    tilesets: [
      ...hydratedTilesets,
      ...discoveredTilesets
        .filter(asset => !tilePaths.has(asset.relativePath))
        .map(asset => createProjectTileset(asset, mapFile.tileWidth, mapFile.tileHeight))
    ]
  };
}

interface IImportedProjectAssets {
  tilesetPath?: string;
}

function createProjectScanState(
  state: Pick<IEditorState, 'activeTileId' | 'activeTilesetId' | 'mapFile'>,
  scanResult: IProjectScanResult,
  importedAssets: IImportedProjectAssets = {}
): Partial<IEditorState> {
  const nextState: Partial<IEditorState> = {
    projectConfig: scanResult.config,
    availableMaps: scanResult.maps,
    discoveredTilesets: scanResult.tilesets
  };

  if (state.mapFile === null) {
    return nextState;
  }

  const mapFile = mergeProjectAssetsIntoMap(state.mapFile, scanResult.tilesets);
  const importedTileset = importedAssets.tilesetPath === undefined
    ? undefined
    : mapFile.tilesets.find(tileset => tileset.imagePath === importedAssets.tilesetPath);

  return {
    ...nextState,
    mapFile,
    activeTileId: importedTileset === undefined ? state.activeTileId : 1,
    activeTilesetId: importedTileset?.id ?? state.activeTilesetId
  };
}

interface IInstanceLocation {
  readonly layerIndex: number;
  readonly instanceIndex: number;
  readonly instance: IEditorPrefabInstance;
}

function findInstanceInLayers(
  mapFile: IEditorMapFile,
  instanceId: string
): IInstanceLocation | null {
  for (let i = 0; i < mapFile.layers.length; i++) {
    const layer = mapFile.layers[i];

    if (layer.type !== 'object') {
      continue;
    }

    const idx = layer.instances.findIndex(inst => inst.id === instanceId);

    if (idx !== -1) {
      return { layerIndex: i, instanceIndex: idx, instance: layer.instances[idx] };
    }
  }

  return null;
}

let projectSettingsTimer: ReturnType<typeof setTimeout> | null = null;
const PROJECT_SETTINGS_DEBOUNCE_MS = 500;

function saveProjectSettingsDebounced(projectPath: string, settings: Partial<IProjectSettings>): void {
  if (projectSettingsTimer !== null) {
    clearTimeout(projectSettingsTimer);
  }

  projectSettingsTimer = setTimeout(() => {
    projectSettingsTimer = null;
    void window.electronAPI.settingsSaveProject(projectPath, settings);
  }, PROJECT_SETTINGS_DEBOUNCE_MS);
}

function saveGlobalSettings(settings: { lastProjectPath?: string }): void {
  void window.electronAPI.settingsSaveGlobal(settings);
}

export const useEditorStore = create<IEditorState>((set, get) => ({
  mapFile: null,
  filePath: null,
  projectPath: null,
  projectConfig: null,
  availableMaps: [],
  discoveredTilesets: [],
  isDirty: false,
  prefabs: [],
  selectedInstanceId: null,
  selectedPrefabId: null,
  activeTool: 'brush',
  activeLayerIndex: 0,
  activeTileId: 1,
  activeTilesetId: null,
  brushSize: 1,
  brushShape: 'square',
  showGrid: true,
  objectSnapToGrid: true,
  editorMode: 'paint',
  activeWeight: 1,
  showPassability: false,
  showWeights: false,
  isInitializing: false,
  error: null,
  canvasElement: null,
  undoStack: [],
  redoStack: [],

  setMapFile: (mapFile, filePath) => {
    savedMapRef = mapFile;
    set({
      mapFile,
      filePath,
      isDirty: false,
      selectedInstanceId: null,
      undoStack: [],
      redoStack: []
    });
  },
  setDirty: dirty => set({ isDirty: dirty }),
  setActiveTool: tool => set({ activeTool: tool }),
  setActiveLayer: index => {
    const { mapFile } = get();
    const layer = mapFile?.layers[index];
    const isObjectLayer = layer !== undefined && layer.type === 'object';

    if (layer !== undefined && layer.type === 'tile' && layer.tileSetId !== '') {
      set({ activeLayerIndex: index, activeTilesetId: layer.tileSetId, activeTileId: 1, selectedInstanceId: null });
    } else {
      set({
        activeLayerIndex: index,
        selectedInstanceId: null,
        ...(isObjectLayer ? { editorMode: 'paint' as const } : {})
      });
    }
  },
  setActiveTileId: id => set({ activeTileId: id }),
  setActiveTile: (tileId, tilesetId) => set({ activeTileId: tileId, activeTilesetId: tilesetId }),
  toggleGrid: () => {
    const newShowGrid = !get().showGrid;
    set({ showGrid: newShowGrid });
    const { projectPath } = get();
    if (projectPath !== null) {
      saveProjectSettingsDebounced(projectPath, { showGrid: newShowGrid });
    }
  },
  setBrushSize: size => {
    const clamped = Math.max(1, Math.min(16, size));
    set({ brushSize: clamped });
    const { projectPath } = get();
    if (projectPath !== null) {
      saveProjectSettingsDebounced(projectPath, { brushSize: clamped });
    }
  },
  setBrushShape: shape => {
    set({ brushShape: shape });
    const { projectPath } = get();
    if (projectPath !== null) {
      saveProjectSettingsDebounced(projectPath, { brushShape: shape });
    }
  },
  setEditorMode: mode => {
    const { mapFile, activeLayerIndex } = get();
    const layer = mapFile?.layers[activeLayerIndex];

    if (mode !== 'paint' && layer !== undefined && layer.type === 'object') {
      return;
    }

    set({ editorMode: mode });
    const { projectPath } = get();
    if (projectPath !== null) {
      saveProjectSettingsDebounced(projectPath, { editorMode: mode });
    }
  },
  setActiveWeight: weight => {
    const clamped = Math.max(1, Math.min(10, weight));
    set({ activeWeight: clamped });
    const { projectPath } = get();
    if (projectPath !== null) {
      saveProjectSettingsDebounced(projectPath, { activeWeight: clamped });
    }
  },
  togglePassabilityOverlay: () => {
    const newShowPassability = !get().showPassability;
    set({ showPassability: newShowPassability });
    const { projectPath } = get();
    if (projectPath !== null) {
      saveProjectSettingsDebounced(projectPath, { showPassability: newShowPassability });
    }
  },
  toggleWeightsOverlay: () => {
    const newShowWeights = !get().showWeights;
    set({ showWeights: newShowWeights });
    const { projectPath } = get();
    if (projectPath !== null) {
      saveProjectSettingsDebounced(projectPath, { showWeights: newShowWeights });
    }
  },
  setError: error => set({ error }),
  setCanvasElement: canvas => set({ canvasElement: canvas }),

  pushUndoSnapshot: () => {
    const { mapFile, undoStack } = get();

    if (mapFile === null) {
      return;
    }

    const newStack = [...undoStack, mapFile];

    if (newStack.length > MAX_UNDO_HISTORY) {
      newStack.shift();
    }

    set({ undoStack: newStack, redoStack: [] });
  },

  undo: () => {
    const { mapFile, undoStack, redoStack, prefabs } = get();

    if (mapFile === null || undoStack.length === 0) {
      return;
    }

    const newUndo = [...undoStack];
    const snapshot = newUndo.pop()!;
    const newRedo = [...redoStack, mapFile];

    set({
      mapFile: snapshot,
      undoStack: newUndo,
      redoStack: newRedo,
      isDirty: snapshot !== savedMapRef,
      ...normalizeSelections(snapshot, get(), prefabs)
    });
  },

  redo: () => {
    const { mapFile, undoStack, redoStack, prefabs } = get();

    if (mapFile === null || redoStack.length === 0) {
      return;
    }

    const newRedo = [...redoStack];
    const snapshot = newRedo.pop()!;
    const newUndo = [...undoStack, mapFile];

    set({
      mapFile: snapshot,
      undoStack: newUndo,
      redoStack: newRedo,
      isDirty: snapshot !== savedMapRef,
      ...normalizeSelections(snapshot, get(), prefabs)
    });
  },

  updateLayer: (layerIndex, layer) => {
    const { mapFile } = get();

    if (mapFile === null) {
      return;
    }

    const newLayers = [...mapFile.layers];
    newLayers[layerIndex] = layer;

    set({ mapFile: { ...mapFile, layers: newLayers }, isDirty: true });
  },

  setMapName: name => {
    const { mapFile } = get();

    if (mapFile === null) {
      return;
    }

    get().pushUndoSnapshot();
    set({ mapFile: { ...mapFile, name }, isDirty: true });
  },

  setMapTileSize: (tileWidth, tileHeight) => {
    const { mapFile } = get();

    if (mapFile === null || tileWidth < 1 || tileHeight < 1) {
      return;
    }

    get().pushUndoSnapshot();
    set({ mapFile: { ...mapFile, tileWidth, tileHeight }, isDirty: true });
  },

  resizeMap: (newRows, newCols) => {
    const { mapFile } = get();

    if (mapFile === null || newRows < 1 || newCols < 1) {
      return;
    }

    get().pushUndoSnapshot();

    const resizedLayers = mapFile.layers.map(layer => {
      if (layer.type !== 'tile') {
        return layer;
      }

      const oldRows = layer.grid.length;
      const oldCols = layer.grid[0]?.length ?? 0;
      const grid = Array.from({ length: newRows }, (_, r) =>
        Array.from({ length: newCols }, (_, c) =>
          r < oldRows && c < oldCols ? layer.grid[r][c] : 0
        )
      );

      const passability = layer.passability !== undefined
        ? Array.from({ length: newRows }, (_, r) =>
            Array.from({ length: newCols }, (_, c) =>
              r < oldRows && c < oldCols ? (layer.passability![r]?.[c] ?? true) : true
            )
          )
        : undefined;

      const weights = layer.weights !== undefined
        ? Array.from({ length: newRows }, (_, r) =>
            Array.from({ length: newCols }, (_, c) =>
              r < oldRows && c < oldCols ? (layer.weights![r]?.[c] ?? 1) : 1
            )
          )
        : undefined;

      return { ...layer, grid, passability, weights };
    });

    set({ mapFile: { ...mapFile, layers: resizedLayers }, isDirty: true });
  },

  addLayer: name => {
    const { mapFile } = get();

    if (mapFile === null || mapFile.layers.length === 0) {
      return;
    }

    const referenceLayer = mapFile.layers.find((layer): layer is IEditorTileLayer => layer.type === 'tile');

    if (referenceLayer === undefined) {
      return;
    }

    get().pushUndoSnapshot();

    const rows = referenceLayer.grid.length;
    const cols = referenceLayer.grid[0]?.length ?? 0;
    const grid = Array.from({ length: rows }, () => new Array<number>(cols).fill(0));

    const newLayer: IEditorTileLayer = {
      type: 'tile',
      name,
      grid,
      tileSetId: '',
      visible: true,
      opacity: 1
    };

    set({
      mapFile: { ...mapFile, layers: [...mapFile.layers, newLayer] },
      isDirty: true,
      activeLayerIndex: mapFile.layers.length,
      selectedInstanceId: null
    });
  },

  addObjectLayer: name => {
    const { mapFile } = get();

    if (mapFile === null) {
      return;
    }

    get().pushUndoSnapshot();

    const newLayer: IEditorObjectLayer = {
      type: 'object',
      name,
      instances: [],
      visible: true,
      opacity: 1
    };

    set({
      mapFile: { ...mapFile, layers: [...mapFile.layers, newLayer] },
      isDirty: true,
      activeLayerIndex: mapFile.layers.length,
      selectedInstanceId: null
    });
  },

  toggleObjectSnap: () => {
    const newSnap = !get().objectSnapToGrid;
    set({ objectSnapToGrid: newSnap });
    const { projectPath } = get();
    if (projectPath !== null) {
      saveProjectSettingsDebounced(projectPath, { objectSnapToGrid: newSnap });
    }
  },

  loadPrefabs: prefabs => set({ prefabs }),

  createPrefab: async (prefab) => {
    const { projectPath } = get();

    if (projectPath === null) {
      return;
    }

    try {
      const filePath = `${projectPath}/prefabs/${prefab.name}.entropy-prefab.json`;
      await window.electronAPI.writePrefab(filePath, prefab);
      set({ prefabs: [...get().prefabs, prefab] });
    } catch (err) {
      set({ error: getErrorMessage(err) });
    }
  },

  updatePrefab: async (prefab) => {
    const { projectPath, prefabs } = get();

    if (projectPath === null) {
      return;
    }

    try {
      const filePath = `${projectPath}/prefabs/${prefab.name}.entropy-prefab.json`;
      await window.electronAPI.writePrefab(filePath, prefab);
      set({ prefabs: prefabs.map(p => p.id === prefab.id ? prefab : p) });
    } catch (err) {
      set({ error: getErrorMessage(err) });
    }
  },

  deletePrefab: async (prefabId) => {
    const { projectPath, prefabs, mapFile } = get();

    if (projectPath === null) {
      return;
    }

    const prefab = prefabs.find(p => p.id === prefabId);

    if (prefab === undefined) {
      return;
    }

    try {
      const filePath = `${projectPath}/prefabs/${prefab.name}.entropy-prefab.json`;
      await window.electronAPI.deletePrefab(filePath);

      const updatedPrefabs = prefabs.filter(p => p.id !== prefabId);

      // Remove instances referencing this prefab from all object layers
      let updatedMapFile = mapFile;

      if (updatedMapFile !== null) {
        const updatedLayers = updatedMapFile.layers.map(layer => {
          if (layer.type !== 'object') {
            return layer;
          }

          return { ...layer, instances: layer.instances.filter(inst => inst.prefabId !== prefabId) };
        });

        const updatedPrefabIds = (updatedMapFile.prefabIds ?? []).filter(id => id !== prefabId);
        updatedMapFile = { ...updatedMapFile, layers: updatedLayers, prefabIds: updatedPrefabIds };
      }

      set({
        prefabs: updatedPrefabs,
        mapFile: updatedMapFile,
        selectedPrefabId: get().selectedPrefabId === prefabId ? null : get().selectedPrefabId,
        isDirty: updatedMapFile !== mapFile
      });
    } catch (err) {
      set({ error: getErrorMessage(err) });
    }
  },

  placeInstance: (prefabId, x, y) => {
    const { mapFile, activeLayerIndex, objectSnapToGrid, prefabs } = get();

    if (mapFile === null) {
      return;
    }

    const layer = mapFile.layers[activeLayerIndex];

    if (layer === undefined || layer.type !== 'object') {
      return;
    }

    const prefab = prefabs.find(p => p.id === prefabId);

    if (prefab === undefined) {
      return;
    }

    get().pushUndoSnapshot();

    let finalX = x;
    let finalY = y;

    if (objectSnapToGrid) {
      finalX = Math.round(x / mapFile.tileWidth) * mapFile.tileWidth;
      finalY = Math.round(y / mapFile.tileHeight) * mapFile.tileHeight;
    }

    // Auto-increment instance name
    const existingCount = layer.instances.filter(inst => inst.prefabId === prefabId).length;
    const instanceName = existingCount === 0 ? prefab.name : `${prefab.name} (${existingCount})`;

    const maxZ = layer.instances.reduce((max, inst) => Math.max(max, inst.zIndex), 0);

    const newInstance: IEditorPrefabInstance = {
      id: crypto.randomUUID(),
      prefabId,
      name: instanceName,
      x: finalX,
      y: finalY,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      componentOverrides: [],
      parentInstanceId: null,
      zIndex: maxZ + 1,
      enabled: true
    };

    const updatedLayer: IEditorObjectLayer = {
      ...layer,
      instances: [...layer.instances, newInstance]
    };

    const newLayers = [...mapFile.layers];
    newLayers[activeLayerIndex] = updatedLayer;

    // Ensure prefabId is in the map's prefabIds list
    const existingPrefabIds = mapFile.prefabIds ?? [];
    const prefabIds = existingPrefabIds.includes(prefabId)
      ? existingPrefabIds
      : [...existingPrefabIds, prefabId];

    set({
      mapFile: { ...mapFile, layers: newLayers, prefabIds },
      isDirty: true,
      selectedInstanceId: newInstance.id
    });
  },

  selectInstance: instanceId => set({ selectedInstanceId: instanceId }),

  moveInstance: (instanceId, x, y) => {
    const { mapFile } = get();

    if (mapFile === null) {
      return;
    }

    const found = findInstanceInLayers(mapFile, instanceId);

    if (found === null) {
      return;
    }

    const layer = mapFile.layers[found.layerIndex] as IEditorObjectLayer;
    const updatedInstances = layer.instances.map(inst =>
      inst.id === instanceId ? { ...inst, x, y } : inst
    );

    const updatedLayer: IEditorObjectLayer = { ...layer, instances: updatedInstances };
    const newLayers = [...mapFile.layers];
    newLayers[found.layerIndex] = updatedLayer;

    set({ mapFile: { ...mapFile, layers: newLayers }, isDirty: true });
  },

  rotateInstance: (instanceId, rotation) => {
    const { mapFile } = get();

    if (mapFile === null) {
      return;
    }

    const found = findInstanceInLayers(mapFile, instanceId);

    if (found === null) {
      return;
    }

    get().pushUndoSnapshot();

    const layer = mapFile.layers[found.layerIndex] as IEditorObjectLayer;
    const updatedInstances = layer.instances.map(inst =>
      inst.id === instanceId ? { ...inst, rotation } : inst
    );

    const updatedLayer: IEditorObjectLayer = { ...layer, instances: updatedInstances };
    const newLayers = [...mapFile.layers];
    newLayers[found.layerIndex] = updatedLayer;

    set({ mapFile: { ...mapFile, layers: newLayers }, isDirty: true });
  },

  scaleInstance: (instanceId, scaleX, scaleY) => {
    const { mapFile } = get();

    if (mapFile === null) {
      return;
    }

    const found = findInstanceInLayers(mapFile, instanceId);

    if (found === null) {
      return;
    }

    get().pushUndoSnapshot();

    const layer = mapFile.layers[found.layerIndex] as IEditorObjectLayer;
    const updatedInstances = layer.instances.map(inst =>
      inst.id === instanceId ? { ...inst, scaleX, scaleY } : inst
    );

    const updatedLayer: IEditorObjectLayer = { ...layer, instances: updatedInstances };
    const newLayers = [...mapFile.layers];
    newLayers[found.layerIndex] = updatedLayer;

    set({ mapFile: { ...mapFile, layers: newLayers }, isDirty: true });
  },

  deleteInstance: instanceId => {
    const { mapFile, selectedInstanceId } = get();

    if (mapFile === null) {
      return;
    }

    const found = findInstanceInLayers(mapFile, instanceId);

    if (found === null) {
      return;
    }

    get().pushUndoSnapshot();

    const layer = mapFile.layers[found.layerIndex] as IEditorObjectLayer;
    const updatedInstances = layer.instances.filter(inst => inst.id !== instanceId);
    const updatedLayer: IEditorObjectLayer = { ...layer, instances: updatedInstances };
    const newLayers = [...mapFile.layers];
    newLayers[found.layerIndex] = updatedLayer;

    set({
      mapFile: { ...mapFile, layers: newLayers },
      isDirty: true,
      selectedInstanceId: selectedInstanceId === instanceId ? null : selectedInstanceId
    });
  },

  setSelectedPrefabId: id => set({ selectedPrefabId: id }),

  removeLayer: index => {
    const { mapFile, activeLayerIndex } = get();

    if (mapFile === null || mapFile.layers.length <= 1) {
      return;
    }

    get().pushUndoSnapshot();

    const newLayers = mapFile.layers.filter((_, i) => i !== index);
    const newActiveIndex = activeLayerIndex >= newLayers.length ? newLayers.length - 1 : activeLayerIndex;

    set({
      mapFile: { ...mapFile, layers: newLayers },
      isDirty: true,
      activeLayerIndex: newActiveIndex,
      selectedInstanceId: null
    });
  },

  setLayerVisibility: (index, visible) => {
    const { mapFile } = get();

    if (mapFile === null) {
      return;
    }

    get().pushUndoSnapshot();

    const newLayers = [...mapFile.layers];
    newLayers[index] = { ...newLayers[index], visible };

    set({ mapFile: { ...mapFile, layers: newLayers }, isDirty: true });
  },

  setLayerOpacity: (index, opacity) => {
    const { mapFile } = get();

    if (mapFile === null) {
      return;
    }

    get().pushUndoSnapshot();

    const newLayers = [...mapFile.layers];
    newLayers[index] = { ...newLayers[index], opacity };

    set({ mapFile: { ...mapFile, layers: newLayers }, isDirty: true });
  },

  addTileset: tileset => {
    const { mapFile } = get();

    if (mapFile === null) {
      return;
    }

    get().pushUndoSnapshot();
    set({ mapFile: { ...mapFile, tilesets: [...mapFile.tilesets, tileset] }, isDirty: true });
  },

  removeTileset: tilesetId => {
    const { mapFile } = get();

    if (mapFile === null) {
      return;
    }

    get().pushUndoSnapshot();

    const newTilesets = mapFile.tilesets.filter(ts => ts.id !== tilesetId);

    const newLayers = mapFile.layers.map(layer => {
      if (layer.type === 'tile' && layer.tileSetId === tilesetId) {
        return { ...layer, tileSetId: '', grid: layer.grid.map(row => row.map(() => 0)) };
      }

      return layer;
    });

    const activeTilesetId = get().activeTilesetId === tilesetId
      ? (newTilesets[0]?.id ?? null)
      : get().activeTilesetId;

    set({
      mapFile: { ...mapFile, tilesets: newTilesets, layers: newLayers },
      isDirty: true,
      activeTilesetId,
      activeTileId: 1
    });
  },

  saveFile: async () => {
    const { mapFile, filePath, projectPath } = get();

    if (mapFile === null || filePath === null || projectPath === null) {
      return;
    }

    try {
      const strippedMap = stripProjectMapImageData(mapFile);
      await window.electronAPI.projectSaveMap(projectPath, filePath, strippedMap);
      savedMapRef = mapFile;
      set({ isDirty: false });
    } catch (err) {
      set({ error: getErrorMessage(err) });
    }
  },

  openProject: async () => {
    try {
      const result: IProjectScanResult | null = await window.electronAPI.projectOpen();

      if (result === null) {
        return;
      }

      saveGlobalSettings({ lastProjectPath: result.projectPath });

      const projectSettings = await window.electronAPI.settingsLoadProject(result.projectPath);

      const discovered = await window.electronAPI.discoverPrefabs(result.projectPath);
      const prefabs = discovered.map(d => d.prefab);

      set({
        projectPath: result.projectPath,
        projectConfig: result.config,
        availableMaps: result.maps,
        discoveredTilesets: result.tilesets,
        prefabs,
        mapFile: null,
        filePath: null,
        isDirty: false,
        activeLayerIndex: 0,
        activeTilesetId: null,
        selectedInstanceId: null,
        selectedPrefabId: null,
        showGrid: projectSettings.showGrid,
        showPassability: projectSettings.showPassability,
        showWeights: projectSettings.showWeights,
        brushSize: projectSettings.brushSize,
        brushShape: projectSettings.brushShape,
        editorMode: projectSettings.editorMode,
        activeWeight: projectSettings.activeWeight,
        objectSnapToGrid: projectSettings.objectSnapToGrid
      });

      const mapPath = projectSettings.lastMapPath !== undefined
        ? result.maps.find(m => m === projectSettings.lastMapPath)
        : undefined;
      const initialMapPath = mapPath ?? getInitialProjectMapPath(result);

      if (initialMapPath !== null && initialMapPath !== undefined) {
        await get().loadMapFromProject(initialMapPath);
      }
    } catch (err) {
      set({ error: getErrorMessage(err) });
    }
  },

  loadMapFromProject: async mapFilePath => {
    const { projectPath, projectConfig, discoveredTilesets } = get();
    if (projectPath === null || projectConfig === null) return;

    try {
      const data = await window.electronAPI.projectReadMap(mapFilePath);
      const mapFile = mergeProjectAssetsIntoMap(data, discoveredTilesets);
      savedMapRef = mapFile;

      set({
        mapFile,
        filePath: mapFilePath,
        isDirty: false,
        activeLayerIndex: 0,
        activeTilesetId: mapFile.tilesets[0]?.id ?? null,
        selectedInstanceId: null,
        selectedPrefabId: null,
        undoStack: [],
        redoStack: []
      });

      saveProjectSettingsDebounced(projectPath, { lastMapPath: mapFilePath });
    } catch (err) {
      set({ error: getErrorMessage(err) });
    }
  },

  createMapInProject: async (name, rows, cols, tileWidth, tileHeight) => {
    const { projectPath, projectConfig } = get();

    if (projectPath === null || projectConfig === null) {
      return;
    }

    try {
      const result = await window.electronAPI.projectCreateMap(
        projectPath,
        name,
        tileWidth,
        tileHeight
      );

      let data = result.data;
      if (rows > 0 && cols > 0) {
        data = {
          ...data,
          layers: data.layers.map(layer => (layer.type === 'tile' ? { ...layer, grid: createGrid(rows, cols) } : layer))
        };
        await window.electronAPI.projectSaveMap(projectPath, result.filePath, stripProjectMapImageData(data));
      }

      const scanResult: IProjectScanResult = await window.electronAPI.projectScan(projectPath);
      const mapFile = mergeProjectAssetsIntoMap(data, scanResult.tilesets);
      savedMapRef = mapFile;

      set({
        projectConfig: scanResult.config,
        availableMaps: scanResult.maps,
        discoveredTilesets: scanResult.tilesets,
        mapFile,
        filePath: result.filePath,
        isDirty: false,
        activeLayerIndex: 0,
        activeTilesetId: mapFile.tilesets[0]?.id ?? null,
        selectedInstanceId: null,
        selectedPrefabId: null,
        undoStack: [],
        redoStack: []
      });
    } catch (err) {
      set({ error: getErrorMessage(err) });
    }
  },

  importTilesetToProject: async () => {
    const { projectPath } = get();

    if (projectPath === null) {
      set({ error: 'Open or create an Entropy project before importing a tileset.' });
      return;
    }

    try {
      const relativePath = await window.electronAPI.projectImportTileset(projectPath);

      if (relativePath === null) {
        return;
      }

      const scanResult = await window.electronAPI.projectScan(projectPath);
      set(createProjectScanState(get(), scanResult, { tilesetPath: relativePath }));
    } catch (err) {
      set({ error: getErrorMessage(err) });
    }
  },

  exportPng: async () => {
    const { canvasElement } = get();

    if (canvasElement === null) {
      return;
    }

    try {
      const dataUrl = canvasElement.toDataURL('image/png');
      await window.electronAPI.exportPng(dataUrl);
    } catch (err) {
      set({ error: getErrorMessage(err) });
    }
  },

  exportTiledMap: async () => {
    const { mapFile } = get();

    if (mapFile === null) {
      return;
    }

    try {
      const jsonData = exportToTiled(mapFile);
      await window.electronAPI.exportTiled(jsonData);
    } catch (err) {
      set({ error: getErrorMessage(err) });
    }
  },

  exportScene: async () => {
    const { mapFile, prefabs, projectConfig } = get();

    if (mapFile === null) {
      return;
    }

    try {
      const gameObjects = bakeAllInstances(mapFile, prefabs);
      const scene: ISerializedScene = {
        name: mapFile.name,
        sceneId: 0,
        gameObjects
      };

      if (projectConfig?.defaultScene !== undefined) {
        scene.name = projectConfig.defaultScene;
      }

      const jsonData = JSON.stringify(scene, null, 2);
      await window.electronAPI.exportScene(jsonData);
    } catch (err) {
      set({ error: getErrorMessage(err) });
    }
  },

  exportPrefabManifest: async () => {
    const { prefabs } = get();

    try {
      const manifest = generatePrefabManifest(prefabs);
      const jsonData = JSON.stringify(manifest, null, 2);
      await window.electronAPI.exportPrefabManifest(jsonData);
    } catch (err) {
      set({ error: getErrorMessage(err) });
    }
  },

  exportPrefabTypes: async () => {
    const { prefabs } = get();

    try {
      const dtsContent = generatePrefabTypeDeclaration(prefabs);
      await window.electronAPI.exportPrefabTypes(dtsContent);
    } catch (err) {
      set({ error: getErrorMessage(err) });
    }
  },

  initializeSettings: async () => {
    set({ isInitializing: true });

    try {
      const globalSettings = await window.electronAPI.settingsLoadGlobal();

      if (globalSettings.lastProjectPath !== undefined) {
        await get().openProjectByPath(globalSettings.lastProjectPath);
      }
    } catch {
      // Settings load failed — proceed with defaults
    } finally {
      set({ isInitializing: false });
    }
  },

  openProjectByPath: async (projectPath: string) => {
    try {
      const result = await window.electronAPI.projectScan(projectPath);

      const projectSettings = await window.electronAPI.settingsLoadProject(projectPath);

      const discovered = await window.electronAPI.discoverPrefabs(projectPath);
      const prefabs = discovered.map(d => d.prefab);

      set({
        projectPath: result.projectPath,
        projectConfig: result.config,
        availableMaps: result.maps,
        discoveredTilesets: result.tilesets,
        prefabs,
        mapFile: null,
        filePath: null,
        isDirty: false,
        activeLayerIndex: 0,
        activeTilesetId: null,
        selectedInstanceId: null,
        selectedPrefabId: null,
        showGrid: projectSettings.showGrid,
        showPassability: projectSettings.showPassability,
        showWeights: projectSettings.showWeights,
        brushSize: projectSettings.brushSize,
        brushShape: projectSettings.brushShape,
        editorMode: projectSettings.editorMode,
        activeWeight: projectSettings.activeWeight,
        objectSnapToGrid: projectSettings.objectSnapToGrid
      });

      const mapPath = projectSettings.lastMapPath !== undefined
        ? result.maps.find(m => m === projectSettings.lastMapPath)
        : undefined;
      const initialMapPath = mapPath ?? getInitialProjectMapPath(result);

      if (initialMapPath !== null && initialMapPath !== undefined) {
        await get().loadMapFromProject(initialMapPath);
      }
    } catch (err) {
      set({ error: getErrorMessage(err) });
    }
  }
}));
