import { create } from 'zustand';
import type { IEditorLayer, IEditorMapFile, IEditorTileset } from '../../shared/types';
import { getErrorMessage } from '../utils/errors';

export type EditorTool = 'brush' | 'eraser' | 'fill' | 'eyedropper' | 'select';

interface IEditorState {
  // Map state
  mapFile: IEditorMapFile | null;
  filePath: string | null;
  isDirty: boolean;

  // Tool state
  activeTool: EditorTool;
  activeLayerIndex: number;
  activeTileId: number;
  activeTilesetId: string | null;
  showGrid: boolean;

  // UI state
  error: string | null;
  pendingTilesetImport: { imageDataUrl: string; filePath: string } | null;

  // Actions
  setMapFile: (mapFile: IEditorMapFile, filePath?: string) => void;
  setDirty: (dirty: boolean) => void;
  setActiveTool: (tool: EditorTool) => void;
  setActiveLayer: (index: number) => void;
  setActiveTileId: (id: number) => void;
  setActiveTile: (tileId: number, tilesetId: string) => void;
  toggleGrid: () => void;
  setError: (error: string | null) => void;

  // Map operations
  createNewMap: (name: string, rows: number, cols: number, tileWidth: number, tileHeight: number) => void;
  updateLayer: (layerIndex: number, layer: IEditorLayer) => void;
  addLayer: (name: string) => void;
  removeLayer: (index: number) => void;
  setLayerVisibility: (index: number, visible: boolean) => void;
  setLayerOpacity: (index: number, opacity: number) => void;
  addTileset: (tileset: IEditorTileset) => void;

  // File operations
  saveFile: () => Promise<void>;
  saveFileAs: () => Promise<void>;
  openFile: () => Promise<void>;
  promptImportTileset: () => Promise<void>;
  finalizeTilesetImport: (tileWidth: number, tileHeight: number) => void;
  cancelTilesetImport: () => void;
}

export const useEditorStore = create<IEditorState>((set, get) => ({
  mapFile: null,
  filePath: null,
  isDirty: false,
  activeTool: 'brush',
  activeLayerIndex: 0,
  activeTileId: 1,
  activeTilesetId: null,
  showGrid: true,
  error: null,
  pendingTilesetImport: null,

  setMapFile: (mapFile, filePath) => set({ mapFile, filePath, isDirty: false }),
  setDirty: (dirty) => set({ isDirty: dirty }),
  setActiveTool: (tool) => set({ activeTool: tool }),
  setActiveLayer: (index) => set({ activeLayerIndex: index }),
  setActiveTileId: (id) => set({ activeTileId: id }),
  setActiveTile: (tileId, tilesetId) => set({ activeTileId: tileId, activeTilesetId: tilesetId }),
  toggleGrid: () => set(state => ({ showGrid: !state.showGrid })),
  setError: (error) => set({ error }),

  createNewMap: (name, rows, cols, tileWidth, tileHeight) => {
    const grid = Array.from({ length: rows }, () => new Array<number>(cols).fill(0));

    const mapFile: IEditorMapFile = {
      name,
      tileWidth,
      tileHeight,
      layers: [
        {
          name: 'Layer 1',
          grid,
          tileSetId: '',
          visible: true,
          opacity: 1
        }
      ],
      tilesets: []
    };

    set({ mapFile, filePath: null, isDirty: false, activeLayerIndex: 0 });
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

  addLayer: (name) => {
    const { mapFile } = get();

    if (mapFile === null || mapFile.layers.length === 0) {
      return;
    }

    const referenceLayer = mapFile.layers[0];
    const rows = referenceLayer.grid.length;
    const cols = referenceLayer.grid[0]?.length ?? 0;
    const grid = Array.from({ length: rows }, () => new Array<number>(cols).fill(0));

    const newLayer: IEditorLayer = {
      name,
      grid,
      tileSetId: '',
      visible: true,
      opacity: 1
    };

    set({
      mapFile: { ...mapFile, layers: [...mapFile.layers, newLayer] },
      isDirty: true,
      activeLayerIndex: mapFile.layers.length
    });
  },

  removeLayer: (index) => {
    const { mapFile, activeLayerIndex } = get();

    if (mapFile === null || mapFile.layers.length <= 1) {
      return;
    }

    const newLayers = mapFile.layers.filter((_, i) => i !== index);
    const newActiveIndex = activeLayerIndex >= newLayers.length ? newLayers.length - 1 : activeLayerIndex;

    set({ mapFile: { ...mapFile, layers: newLayers }, isDirty: true, activeLayerIndex: newActiveIndex });
  },

  setLayerVisibility: (index, visible) => {
    const { mapFile } = get();

    if (mapFile === null) {
      return;
    }

    const newLayers = [...mapFile.layers];
    newLayers[index] = { ...newLayers[index], visible };

    set({ mapFile: { ...mapFile, layers: newLayers }, isDirty: true });
  },

  setLayerOpacity: (index, opacity) => {
    const { mapFile } = get();

    if (mapFile === null) {
      return;
    }

    const newLayers = [...mapFile.layers];
    newLayers[index] = { ...newLayers[index], opacity };

    set({ mapFile: { ...mapFile, layers: newLayers }, isDirty: true });
  },

  addTileset: (tileset) => {
    const { mapFile } = get();

    if (mapFile === null) {
      return;
    }

    set({ mapFile: { ...mapFile, tilesets: [...mapFile.tilesets, tileset] }, isDirty: true });
  },

  saveFile: async () => {
    const { mapFile, filePath } = get();

    if (mapFile === null) {
      return;
    }

    try {
      if (filePath !== null) {
        await window.electronAPI.fileSave(filePath, mapFile);
        set({ isDirty: false });
      } else {
        await get().saveFileAs();
      }
    } catch (err) {
      set({ error: getErrorMessage(err) });
    }
  },

  saveFileAs: async () => {
    const { mapFile } = get();

    if (mapFile === null) {
      return;
    }

    try {
      const newPath = await window.electronAPI.fileSaveAs(mapFile);

      if (newPath !== null) {
        set({ filePath: newPath, isDirty: false });
      }
    } catch (err) {
      set({ error: getErrorMessage(err) });
    }
  },

  openFile: async () => {
    try {
      const result = await window.electronAPI.fileOpen();

      if (result !== null) {
        set({ mapFile: result.data, filePath: result.filePath, isDirty: false, activeLayerIndex: 0 });
      }
    } catch (err) {
      set({ error: getErrorMessage(err) });
    }
  },

  promptImportTileset: async () => {
    try {
      const result = await window.electronAPI.tilesetImport();

      if (result === null) {
        return;
      }

      set({ pendingTilesetImport: { imageDataUrl: result.imageDataUrl, filePath: result.filePath } });
    } catch (err) {
      set({ error: getErrorMessage(err) });
    }
  },

  finalizeTilesetImport: (tileWidth, tileHeight) => {
    const { pendingTilesetImport } = get();

    if (pendingTilesetImport === null) {
      return;
    }

    const img = new Image();
    img.src = pendingTilesetImport.imageDataUrl;

    img.onload = () => {
      const columns = Math.floor(img.width / tileWidth);
      const rows = Math.floor(img.height / tileHeight);
      const id = crypto.randomUUID();

      const tileset: IEditorTileset = {
        id,
        name: pendingTilesetImport.filePath.split(/[/\\]/).pop() ?? 'Untitled',
        imagePath: pendingTilesetImport.filePath,
        imageDataUrl: pendingTilesetImport.imageDataUrl,
        tileWidth,
        tileHeight,
        columns,
        rows,
        tileCount: columns * rows
      };

      if (get().mapFile === null) {
        get().createNewMap('Untitled', 20, 30, get().mapFile?.tileWidth ?? 32, get().mapFile?.tileHeight ?? 32);
      }

      get().addTileset(tileset);
      set({ pendingTilesetImport: null });
    };
  },

  cancelTilesetImport: () => {
    set({ pendingTilesetImport: null });
  }
}));
