import {
  Circle,
  Eraser,
  Grid3x3,
  Minus,
  MousePointer,
  Paintbrush,
  PaintBucket,
  Pipette,
  Plus,
  Save,
  Square
} from 'lucide-react';
import type { ReactElement } from 'react';
import { cn } from '../../lib/utils';
import { useEditorStore } from '../../stores/editor-store';
import { ToolButton } from '../editor/ToolButton';
import { MapSelector } from '../MapSelector';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/Tooltip';

const tools = [
  { id: 'brush', label: 'Brush', shortcut: '1', icon: Paintbrush },
  { id: 'eraser', label: 'Eraser', shortcut: '2', icon: Eraser },
  { id: 'fill', label: 'Fill', shortcut: '3', icon: PaintBucket },
  { id: 'eyedropper', label: 'Eyedropper', shortcut: '4', icon: Pipette },
  { id: 'select', label: 'Select', shortcut: '5', icon: MousePointer }
] as const;

const brushShapes = [
  { id: 'square', label: 'Square brush', icon: Square },
  { id: 'circle', label: 'Circle brush', icon: Circle }
] as const;

export function Toolbar(): ReactElement {
  const activeTool = useEditorStore(state => state.activeTool);
  const setActiveTool = useEditorStore(state => state.setActiveTool);
  const showGrid = useEditorStore(state => state.showGrid);
  const toggleGrid = useEditorStore(state => state.toggleGrid);
  const projectConfig = useEditorStore(state => state.projectConfig);
  const isDirty = useEditorStore(state => state.isDirty);
  const saveFile = useEditorStore(state => state.saveFile);
  const brushSize = useEditorStore(state => state.brushSize);
  const setBrushSize = useEditorStore(state => state.setBrushSize);
  const brushShape = useEditorStore(state => state.brushShape);
  const setBrushShape = useEditorStore(state => state.setBrushShape);

  const showBrushControls = activeTool === 'brush' || activeTool === 'eraser';
  const isMinBrushSize = brushSize <= 1;
  const isMaxBrushSize = brushSize >= 16;

  return (
    <TooltipProvider>
      <div
        className="toolbar-area flex items-center gap-1.5 bg-muted border-b border-border px-3 overflow-x-auto"
        role="toolbar"
        aria-label="Editor tools"
      >
        <div className="flex shrink-0 items-center gap-1 py-1">
          {tools.map(tool => (
            <ToolButton
              key={tool.id}
              icon={tool.icon}
              label={tool.label}
              shortcut={tool.shortcut}
              active={activeTool === tool.id}
              onClick={() => setActiveTool(tool.id)}
            />
          ))}
        </div>

        {projectConfig !== null && (
          <span className="max-w-40 shrink-0 truncate text-xs font-medium text-muted-foreground">
            {projectConfig.name}
          </span>
        )}

        {showBrushControls && (
          <>
            <div className="mx-1 h-5 w-px bg-border shrink-0" />
            <div className="flex shrink-0 items-center gap-1 py-1">
              <span className="text-xs text-muted-foreground">Size</span>
              <button
                type="button"
                className={cn(
                  'inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors',
                  'hover:bg-white/8 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring',
                  isMinBrushSize && 'cursor-not-allowed opacity-50 hover:bg-transparent hover:text-muted-foreground'
                )}
                onClick={() => setBrushSize(brushSize - 1)}
                aria-label="Decrease brush size"
                disabled={isMinBrushSize}
              >
                <Minus className="h-4 w-4" />
              </button>
              <span
                className="min-w-12 text-center text-xs tabular-nums text-foreground"
                aria-live="polite"
                aria-atomic="true"
              >
                {brushSize}×{brushSize}
              </span>
              <button
                type="button"
                className={cn(
                  'inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors',
                  'hover:bg-white/8 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring',
                  isMaxBrushSize && 'cursor-not-allowed opacity-50 hover:bg-transparent hover:text-muted-foreground'
                )}
                onClick={() => setBrushSize(brushSize + 1)}
                aria-label="Increase brush size"
                disabled={isMaxBrushSize}
              >
                <Plus className="h-4 w-4" />
              </button>
              <div className="mx-1 h-5 w-px bg-border" />
              <div className="flex items-center gap-1">
                {brushShapes.map(shape => (
                  <ToolButton
                    key={shape.id}
                    icon={shape.icon}
                    label={shape.label}
                    active={brushShape === shape.id}
                    onClick={() => setBrushShape(shape.id)}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        <MapSelector />

        <div className="mx-1 h-5 w-px bg-border shrink-0" />
        <div className="ml-auto flex shrink-0 items-center gap-1 py-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className={cn(
                  'inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors',
                  isDirty
                    ? 'text-foreground hover:bg-white/8 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring'
                    : 'cursor-not-allowed opacity-30 text-muted-foreground'
                )}
                onClick={() => void saveFile()}
                disabled={!isDirty}
                aria-label="Save (Ctrl+S)"
              >
                <Save className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Save (Ctrl+S)</TooltipContent>
          </Tooltip>
          <div className="mx-1 h-5 w-px bg-border shrink-0" />
          <ToolButton
            icon={Grid3x3}
            label="Toggle grid"
            shortcut="G"
            active={showGrid}
            onClick={toggleGrid}
          />
        </div>
      </div>
    </TooltipProvider>
  );
}
