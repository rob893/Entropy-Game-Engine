export type BrushShape = 'square' | 'circle';
export type EditorMode = 'paint' | 'passability' | 'weight';

export interface IGlobalSettings {
  lastProjectPath?: string;
}

export interface IProjectSettings {
  lastMapPath?: string;
  showGrid: boolean;
  showPassability: boolean;
  showWeights: boolean;
  brushSize: number;
  brushShape: BrushShape;
  editorMode: EditorMode;
  activeWeight: number;
  objectSnapToGrid: boolean;
}

export function getDefaultGlobalSettings(): IGlobalSettings {
  return {};
}

export function getDefaultProjectSettings(): IProjectSettings {
  return {
    showGrid: true,
    showPassability: false,
    showWeights: false,
    brushSize: 1,
    brushShape: 'square',
    editorMode: 'paint',
    activeWeight: 1,
    objectSnapToGrid: true
  };
}
