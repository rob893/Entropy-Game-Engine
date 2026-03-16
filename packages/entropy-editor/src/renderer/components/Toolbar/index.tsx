import { Button, Separator, Toolbar as HeroToolbar, Tooltip, ToggleButtonGroup } from '@heroui/react';
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
import type { BrushShape, EditorTool } from '../../stores/editor-store';
import { useEditorStore } from '../../stores/editor-store';
import { ToolButton } from '../editor/ToolButton';
import { MapSelector } from '../MapSelector';

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
    <HeroToolbar
      aria-label="Editor tools"
      className="toolbar-area flex items-center gap-1.5 overflow-x-auto border-b border-border bg-surface-secondary px-3"
    >
      <div className="flex shrink-0 items-center py-1">
        <ToggleButtonGroup
          aria-label="Editor tools"
          selectionMode="single"
          selectedKeys={new Set([activeTool])}
          onSelectionChange={(selectedKeys): void => {
            for (const selectedKey of selectedKeys) {
              setActiveTool(String(selectedKey) as EditorTool);
              break;
            }
          }}
        >
          {tools.map((tool, index) => (
            <ToolButton
              key={tool.id}
              id={tool.id}
              icon={tool.icon}
              label={tool.label}
              shortcut={tool.shortcut}
              showSeparator={index > 0}
            />
          ))}
        </ToggleButtonGroup>
      </div>

      {projectConfig !== null && (
        <span className="max-w-40 shrink-0 truncate text-xs font-medium text-muted">
          {projectConfig.name}
        </span>
      )}

      {showBrushControls && (
        <>
          <Separator />
          <div className="flex shrink-0 items-center gap-1 py-1">
            <span className="text-xs text-muted">Size</span>
            <Button
              isIconOnly
              variant="tertiary"
              size="sm"
              onPress={() => setBrushSize(brushSize - 1)}
              isDisabled={isMinBrushSize}
              aria-label="Decrease brush size"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span
              className="min-w-12 text-center text-xs tabular-nums text-foreground"
              aria-live="polite"
              aria-atomic="true"
            >
              {brushSize}×{brushSize}
            </span>
            <Button
              isIconOnly
              variant="tertiary"
              size="sm"
              onPress={() => setBrushSize(brushSize + 1)}
              isDisabled={isMaxBrushSize}
              aria-label="Increase brush size"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Separator />
            <ToggleButtonGroup
              aria-label="Brush shape"
              selectionMode="single"
              selectedKeys={new Set([brushShape])}
              onSelectionChange={(selectedKeys): void => {
                for (const selectedKey of selectedKeys) {
                  setBrushShape(String(selectedKey) as BrushShape);
                  break;
                }
              }}
            >
              {brushShapes.map((shape, index) => (
                <ToolButton
                  key={shape.id}
                  id={shape.id}
                  icon={shape.icon}
                  label={shape.label}
                  showSeparator={index > 0}
                />
              ))}
            </ToggleButtonGroup>
          </div>
        </>
      )}

      <MapSelector />

      <Separator />
      <div className="ml-auto flex shrink-0 items-center gap-1 py-1">
        <Tooltip delay={300}>
          <Button
            isIconOnly
            variant="ghost"
            size="sm"
            onPress={() => void saveFile()}
            isDisabled={!isDirty}
            aria-label="Save (Ctrl+S)"
          >
            <Save className="h-4 w-4" />
          </Button>
          <Tooltip.Content>Save (Ctrl+S)</Tooltip.Content>
        </Tooltip>
        <Separator />
        <ToolButton
          icon={Grid3x3}
          label="Toggle grid"
          shortcut="G"
          active={showGrid}
          onClick={toggleGrid}
        />
      </div>
    </HeroToolbar>
  );
}
