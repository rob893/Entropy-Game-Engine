import { create } from 'zustand';
import { FILE_EXTENSION } from '../../shared/constants';
import type {
  EditorLayer,
  IDiscoveredAsset,
  IEditorMapFile,
  IEditorObject,
  IEditorObjectLayer,
  IEditorTileLayer,
  IEditorTileset,
  IEntropyProject,
  IObjectSprite,
  IProjectScanResult
} from '../../shared/types';
import { getErrorMessage } from '../../shared/utils/errors';
import { exportToTiled } from '../editor/TiledExporter';

export type EditorTool = 'brush' | 'eraser' | 'fill' | 'eyedropper' | 'select';
export type BrushShape = 'square' | 'circle';
export type EditorMode = 'paint' | 'passability' | 'weight';

const MAX_UNDO_HISTORY = 50;
let savedMapRef: IEditorMapFile | null = null;

function normalizeSelections(
  mapFile: IEditorMapFile,
  state: Pick<IEditorState, 'activeLayerIndex' | 'activeTilesetId' | 'activeObjectSpriteId'>
): Partial<IEditorState> {
  const maxLayerIndex = Math.max(0, mapFile.layers.length - 1);
  const activeLayerIndex = Math.min(state.activeLayerIndex, maxLayerIndex);

  const tilesetIds = new Set(mapFile.tilesets.map(t => t.id));
  const activeTilesetId = state.activeTilesetId !== null && tilesetIds.has(state.activeTilesetId)
    ? state.activeTilesetId
    : mapFile.tilesets[0]?.id ?? null;

  const spriteIds = new Set(mapFile.objectSprites.map(s => s.id));
  const activeObjectSpriteId = state.activeObjectSpriteId !== null && spriteIds.has(state.activeObjectSpriteId)
    ? state.activeObjectSpriteId
    : mapFile.objectSprites[0]?.id ?? null;

  return {
    activeLayerIndex,
    activeTilesetId,
    activeObjectSpriteId,
    selectedObjectId: null
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
  discoveredObjects: IDiscoveredAsset[];
  isDirty: boolean;

  // Tool state
  activeTool: EditorTool;
  activeLayerIndex: number;
  activeTileId: number;
  activeTilesetId: string | null;
  activeObjectSpriteId: string | null;
  selectedObjectId: string | null;
  brushSize: number;
  brushShape: BrushShape;
  showGrid: boolean;
  objectSnapToGrid: boolean;
  editorMode: EditorMode;
  activeWeight: number;
  showPassability: boolean;
  showWeights: boolean;

  // UI state
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
  placeObject: (spriteId: string, x: number, y: number) => void;
  selectObject: (objectId: string | null) => void;
  moveObject: (objectId: string, x: number, y: number) => void;
  rotateObject: (objectId: string, rotation: number) => void;
  scaleObject: (objectId: string, scaleX: number, scaleY: number) => void;
  deleteObject: (objectId: string) => void;
  reorderObject: (objectId: string, direction: 'forward' | 'backward') => void;
  toggleObjectSnap: () => void;
  importObjectSprites: (sprites: IObjectSprite[]) => void;
  setActiveObjectSpriteId: (id: string | null) => void;

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
  importObjectsToProject: () => Promise<void>;

  // Export operations
  exportPng: () => Promise<void>;
  exportTiledMap: () => Promise<void>;
}

function updateObjectInLayer(
  mapFile: IEditorMapFile,
  layerIndex: number,
  objectId: string,
  updater: (obj: IEditorObject) => IEditorObject
): IEditorMapFile | null {
  const layer = mapFile.layers[layerIndex];

  if (layer === undefined || layer.type !== 'object') {
    return null;
  }

  let hasUpdatedObject = false;
  const updatedObjects = layer.objects.map(obj => {
    if (obj.id !== objectId) {
      return obj;
    }

    hasUpdatedObject = true;
    return updater(obj);
  });

  if (!hasUpdatedObject) {
    return null;
  }

  const updatedLayer: IEditorObjectLayer = { ...layer, objects: updatedObjects };
  const newLayers = [...mapFile.layers];
  newLayers[layerIndex] = updatedLayer;

  return { ...mapFile, layers: newLayers };
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

function createProjectObjectSprite(asset: IDiscoveredAsset): IObjectSprite {
  return {
    id: crypto.randomUUID(),
    name: asset.name,
    category: asset.category,
    imagePath: asset.relativePath,
    imageDataUrl: asset.imageDataUrl,
    width: asset.width,
    height: asset.height
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
    tilesets: mapFile.tilesets.map(tileset => ({ ...tileset, imageDataUrl: '' })),
    objectSprites: mapFile.objectSprites.map(sprite => ({ ...sprite, imageDataUrl: '' }))
  };
}

function mergeProjectAssetsIntoMap(
  mapFile: IEditorMapFile,
  discoveredTilesets: IDiscoveredAsset[],
  discoveredObjects: IDiscoveredAsset[]
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

  const hydratedObjectSprites = mapFile.objectSprites.map(sprite => {
    if (sprite.imageDataUrl !== '' && sprite.imageDataUrl !== undefined) {
      return sprite;
    }

    const discovered = discoveredObjects.find(asset => asset.relativePath === sprite.imagePath);

    return discovered === undefined
      ? sprite
      : {
          ...sprite,
          category: sprite.category !== '' ? sprite.category : discovered.category,
          imageDataUrl: discovered.imageDataUrl,
          width: sprite.width > 0 ? sprite.width : discovered.width,
          height: sprite.height > 0 ? sprite.height : discovered.height
        };
  });

  const tilePaths = new Set(hydratedTilesets.map(tileset => tileset.imagePath));
  const objectPaths = new Set(hydratedObjectSprites.map(sprite => sprite.imagePath));

  return {
    ...mapFile,
    tilesets: [
      ...hydratedTilesets,
      ...discoveredTilesets
        .filter(asset => !tilePaths.has(asset.relativePath))
        .map(asset => createProjectTileset(asset, mapFile.tileWidth, mapFile.tileHeight))
    ],
    objectSprites: [
      ...hydratedObjectSprites,
      ...discoveredObjects
        .filter(asset => !objectPaths.has(asset.relativePath))
        .map(asset => createProjectObjectSprite(asset))
    ]
  };
}

interface IImportedProjectAssets {
  objectPaths?: string[];
  tilesetPath?: string;
}

function createProjectScanState(
  state: Pick<IEditorState, 'activeObjectSpriteId' | 'activeTileId' | 'activeTilesetId' | 'mapFile'>,
  scanResult: IProjectScanResult,
  importedAssets: IImportedProjectAssets = {}
): Partial<IEditorState> {
  const nextState: Partial<IEditorState> = {
    projectConfig: scanResult.config,
    availableMaps: scanResult.maps,
    discoveredTilesets: scanResult.tilesets,
    discoveredObjects: scanResult.objectSprites
  };

  if (state.mapFile === null) {
    return nextState;
  }

  const mapFile = mergeProjectAssetsIntoMap(state.mapFile, scanResult.tilesets, scanResult.objectSprites);
  const importedTileset = importedAssets.tilesetPath === undefined
    ? undefined
    : mapFile.tilesets.find(tileset => tileset.imagePath === importedAssets.tilesetPath);
  const importedObjectSprite = (importedAssets.objectPaths ?? [])
    .map(imagePath => mapFile.objectSprites.find(sprite => sprite.imagePath === imagePath))
    .find((sprite): sprite is IObjectSprite => sprite !== undefined);

  return {
    ...nextState,
    mapFile,
    activeTileId: importedTileset === undefined ? state.activeTileId : 1,
    activeTilesetId: importedTileset?.id ?? state.activeTilesetId,
    activeObjectSpriteId: importedObjectSprite?.id ?? state.activeObjectSpriteId
  };
}

export const useEditorStore = create<IEditorState>((set, get) => ({
  mapFile: null,
  filePath: null,
  projectPath: null,
  projectConfig: null,
  availableMaps: [],
  discoveredTilesets: [],
  discoveredObjects: [],
  isDirty: false,
  activeTool: 'brush',
  activeLayerIndex: 0,
  activeTileId: 1,
  activeTilesetId: null,
  activeObjectSpriteId: null,
  selectedObjectId: null,
  brushSize: 1,
  brushShape: 'square',
  showGrid: true,
  objectSnapToGrid: true,
  editorMode: 'paint',
  activeWeight: 1,
  showPassability: false,
  showWeights: false,
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
      selectedObjectId: null,
      activeObjectSpriteId: mapFile.objectSprites[0]?.id ?? null,
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
      set({ activeLayerIndex: index, activeTilesetId: layer.tileSetId, activeTileId: 1, selectedObjectId: null });
    } else {
      set({
        activeLayerIndex: index,
        selectedObjectId: null,
        ...(isObjectLayer ? { editorMode: 'paint' as const } : {})
      });
    }
  },
  setActiveTileId: id => set({ activeTileId: id }),
  setActiveTile: (tileId, tilesetId) => set({ activeTileId: tileId, activeTilesetId: tilesetId }),
  toggleGrid: () => set(state => ({ showGrid: !state.showGrid })),
  setBrushSize: size => set({ brushSize: Math.max(1, Math.min(16, size)) }),
  setBrushShape: shape => set({ brushShape: shape }),
  setEditorMode: mode => {
    const { mapFile, activeLayerIndex } = get();
    const layer = mapFile?.layers[activeLayerIndex];

    if (mode !== 'paint' && layer !== undefined && layer.type === 'object') {
      return;
    }

    set({ editorMode: mode });
  },
  setActiveWeight: weight => set({ activeWeight: Math.max(1, Math.min(10, weight)) }),
  togglePassabilityOverlay: () => set(state => ({ showPassability: !state.showPassability })),
  toggleWeightsOverlay: () => set(state => ({ showWeights: !state.showWeights })),
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
    const { mapFile, undoStack, redoStack } = get();

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
      ...normalizeSelections(snapshot, get())
    });
  },

  redo: () => {
    const { mapFile, undoStack, redoStack } = get();

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
      ...normalizeSelections(snapshot, get())
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
      selectedObjectId: null
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
      objects: [],
      visible: true,
      opacity: 1
    };

    set({
      mapFile: { ...mapFile, layers: [...mapFile.layers, newLayer] },
      isDirty: true,
      activeLayerIndex: mapFile.layers.length,
      selectedObjectId: null
    });
  },

  placeObject: (spriteId, x, y) => {
    const { mapFile, activeLayerIndex, objectSnapToGrid } = get();

    if (mapFile === null) {
      return;
    }

    const layer = mapFile.layers[activeLayerIndex];

    if (layer === undefined || layer.type !== 'object') {
      return;
    }

    get().pushUndoSnapshot();

    let finalX = x;
    let finalY = y;

    if (objectSnapToGrid) {
      finalX = Math.round(x / mapFile.tileWidth) * mapFile.tileWidth;
      finalY = Math.round(y / mapFile.tileHeight) * mapFile.tileHeight;
    }

    const maxZ = layer.objects.reduce((max, obj) => Math.max(max, obj.zIndex), 0);

    const newObject: IEditorObject = {
      id: crypto.randomUUID(),
      spriteId,
      x: finalX,
      y: finalY,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      zIndex: maxZ + 1,
      snapToGrid: objectSnapToGrid
    };

    const updatedLayer: IEditorObjectLayer = {
      ...layer,
      objects: [...layer.objects, newObject]
    };

    const newLayers = [...mapFile.layers];
    newLayers[activeLayerIndex] = updatedLayer;

    set({
      mapFile: { ...mapFile, layers: newLayers },
      isDirty: true,
      selectedObjectId: newObject.id
    });
  },

  selectObject: objectId => set({ selectedObjectId: objectId }),

  moveObject: (objectId, x, y) => {
    const { mapFile, activeLayerIndex, objectSnapToGrid } = get();

    if (mapFile === null) {
      return;
    }

    let finalX = x;
    let finalY = y;

    if (objectSnapToGrid) {
      finalX = Math.round(x / mapFile.tileWidth) * mapFile.tileWidth;
      finalY = Math.round(y / mapFile.tileHeight) * mapFile.tileHeight;
    }

    const updatedMapFile = updateObjectInLayer(mapFile, activeLayerIndex, objectId, obj => ({
      ...obj,
      x: finalX,
      y: finalY
    }));

    if (updatedMapFile === null) {
      return;
    }

    set({ mapFile: updatedMapFile, isDirty: true });
  },

  rotateObject: (objectId, rotation) => {
    const { mapFile, activeLayerIndex } = get();

    if (mapFile === null) {
      return;
    }

    const updatedMapFile = updateObjectInLayer(mapFile, activeLayerIndex, objectId, obj => ({ ...obj, rotation }));

    if (updatedMapFile === null) {
      return;
    }

    get().pushUndoSnapshot();
    set({ mapFile: updatedMapFile, isDirty: true });
  },

  scaleObject: (objectId, scaleX, scaleY) => {
    const { mapFile, activeLayerIndex } = get();

    if (mapFile === null) {
      return;
    }

    const updatedMapFile = updateObjectInLayer(mapFile, activeLayerIndex, objectId, obj => ({
      ...obj,
      scaleX,
      scaleY
    }));

    if (updatedMapFile === null) {
      return;
    }

    get().pushUndoSnapshot();
    set({ mapFile: updatedMapFile, isDirty: true });
  },

  deleteObject: objectId => {
    const { mapFile, activeLayerIndex, selectedObjectId } = get();

    if (mapFile === null) {
      return;
    }

    const layer = mapFile.layers[activeLayerIndex];

    if (layer === undefined || layer.type !== 'object') {
      return;
    }

    const updatedObjects = layer.objects.filter(obj => obj.id !== objectId);

    if (updatedObjects.length === layer.objects.length) {
      return;
    }

    get().pushUndoSnapshot();

    const updatedLayer: IEditorObjectLayer = { ...layer, objects: updatedObjects };
    const newLayers = [...mapFile.layers];
    newLayers[activeLayerIndex] = updatedLayer;

    set({
      mapFile: { ...mapFile, layers: newLayers },
      isDirty: true,
      selectedObjectId: selectedObjectId === objectId ? null : selectedObjectId
    });
  },

  reorderObject: (objectId, direction) => {
    const { mapFile, activeLayerIndex } = get();

    if (mapFile === null) {
      return;
    }

    const layer = mapFile.layers[activeLayerIndex];

    if (layer === undefined || layer.type !== 'object') {
      return;
    }

    const sortedObjects = [...layer.objects].sort((left, right) => left.zIndex - right.zIndex);
    const currentIndex = sortedObjects.findIndex(obj => obj.id === objectId);

    if (currentIndex === -1) {
      return;
    }

    const targetIndex = direction === 'forward' ? currentIndex + 1 : currentIndex - 1;

    if (targetIndex < 0 || targetIndex >= sortedObjects.length) {
      return;
    }

    get().pushUndoSnapshot();

    const currentObject = sortedObjects[currentIndex];
    const targetObject = sortedObjects[targetIndex];
    const updatedObjects = layer.objects.map(obj => {
      if (obj.id === currentObject.id) {
        return { ...obj, zIndex: targetObject.zIndex };
      }

      if (obj.id === targetObject.id) {
        return { ...obj, zIndex: currentObject.zIndex };
      }

      return obj;
    });

    const updatedLayer: IEditorObjectLayer = { ...layer, objects: updatedObjects };
    const newLayers = [...mapFile.layers];
    newLayers[activeLayerIndex] = updatedLayer;

    set({ mapFile: { ...mapFile, layers: newLayers }, isDirty: true });
  },

  toggleObjectSnap: () => set(state => ({ objectSnapToGrid: !state.objectSnapToGrid })),

  importObjectSprites: sprites => {
    const { mapFile, activeObjectSpriteId } = get();

    if (mapFile === null) {
      return;
    }

    get().pushUndoSnapshot();
    set({
      mapFile: { ...mapFile, objectSprites: [...mapFile.objectSprites, ...sprites] },
      isDirty: true,
      activeObjectSpriteId: activeObjectSpriteId ?? sprites[0]?.id ?? null
    });
  },

  setActiveObjectSpriteId: id => set({ activeObjectSpriteId: id }),

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
      selectedObjectId: null
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

      set({
        projectPath: result.projectPath,
        projectConfig: result.config,
        availableMaps: result.maps,
        discoveredTilesets: result.tilesets,
        discoveredObjects: result.objectSprites,
        mapFile: null,
        filePath: null,
        isDirty: false,
        activeLayerIndex: 0,
        activeTilesetId: null,
        activeObjectSpriteId: null,
        selectedObjectId: null
      });

      const initialMapPath = getInitialProjectMapPath(result);

      if (initialMapPath !== null) {
        await get().loadMapFromProject(initialMapPath);
      }
    } catch (err) {
      set({ error: getErrorMessage(err) });
    }
  },

  loadMapFromProject: async mapFilePath => {
    const { projectPath, projectConfig, discoveredTilesets, discoveredObjects } = get();
    if (projectPath === null || projectConfig === null) return;

    try {
      const data = await window.electronAPI.projectReadMap(mapFilePath);
      const mapFile = mergeProjectAssetsIntoMap(data, discoveredTilesets, discoveredObjects);
      savedMapRef = mapFile;

      set({
        mapFile,
        filePath: mapFilePath,
        isDirty: false,
        activeLayerIndex: 0,
        activeTilesetId: mapFile.tilesets[0]?.id ?? null,
        activeObjectSpriteId: mapFile.objectSprites[0]?.id ?? null,
        selectedObjectId: null,
        undoStack: [],
        redoStack: []
      });
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
      const mapFile = mergeProjectAssetsIntoMap(data, scanResult.tilesets, scanResult.objectSprites);
      savedMapRef = mapFile;

      set({
        projectConfig: scanResult.config,
        availableMaps: scanResult.maps,
        discoveredTilesets: scanResult.tilesets,
        discoveredObjects: scanResult.objectSprites,
        mapFile,
        filePath: result.filePath,
        isDirty: false,
        activeLayerIndex: 0,
        activeTilesetId: mapFile.tilesets[0]?.id ?? null,
        activeObjectSpriteId: mapFile.objectSprites[0]?.id ?? null,
        selectedObjectId: null,
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

  importObjectsToProject: async () => {
    const { projectPath } = get();

    if (projectPath === null) {
      set({ error: 'Open or create an Entropy project before importing objects.' });
      return;
    }

    try {
      const relativePaths = await window.electronAPI.projectImportObjects(projectPath);

      if (relativePaths === null) {
        return;
      }

      const scanResult = await window.electronAPI.projectScan(projectPath);
      set(createProjectScanState(get(), scanResult, { objectPaths: relativePaths }));
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
  }
}));
