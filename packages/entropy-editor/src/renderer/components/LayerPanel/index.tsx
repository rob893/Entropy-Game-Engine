import { Button, ToggleButton, Tooltip } from '@heroui/react';
import { BoxSelect, Eye, EyeOff, Grid3x3, Trash2 } from 'lucide-react';
import type { KeyboardEvent, MouseEvent, ReactElement } from 'react';
import { cn } from '../../lib/utils';
import { useEditorStore } from '../../stores/editor-store';
import { Panel, PanelContent, PanelHeader } from '../editor/Panel';

function isLayerActionTarget(target: EventTarget | null): boolean {
  return target instanceof HTMLElement && target.closest('[data-layer-action="true"]') !== null;
}

export function LayerPanel(): ReactElement {
  const mapFile = useEditorStore(state => state.mapFile);
  const activeLayerIndex = useEditorStore(state => state.activeLayerIndex);
  const setActiveLayer = useEditorStore(state => state.setActiveLayer);
  const setLayerVisibility = useEditorStore(state => state.setLayerVisibility);
  const addLayer = useEditorStore(state => state.addLayer);
  const addObjectLayer = useEditorStore(state => state.addObjectLayer);
  const removeLayer = useEditorStore(state => state.removeLayer);

  const layers = mapFile?.layers ?? [];
  const tileLayerCount = layers.filter(layer => layer.type === 'tile').length;
  const objectLayerCount = layers.filter(layer => layer.type === 'object').length;

  const handleLayerKeyDown = (event: KeyboardEvent<HTMLDivElement>, index: number): void => {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    setActiveLayer(index);
  };

  const handleLayerClick = (event: MouseEvent<HTMLDivElement>, index: number): void => {
    if (isLayerActionTarget(event.target)) {
      return;
    }

    setActiveLayer(index);
  };

  return (
    <Panel className="min-h-40 shrink-0">
      <PanelHeader
        actions={(
          <div className="flex items-center gap-0.5">
            <Tooltip delay={300}>
              <Button
                size="sm"
                variant="ghost"
                isIconOnly
                onPress={() => addLayer(`Tile Layer ${tileLayerCount + 1}`)}
                aria-label="Add tile layer"
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Tooltip.Content>Add tile layer</Tooltip.Content>
            </Tooltip>
            <Tooltip delay={300}>
              <Button
                size="sm"
                variant="ghost"
                isIconOnly
                onPress={() => addObjectLayer(`Object Layer ${objectLayerCount + 1}`)}
                aria-label="Add object layer"
              >
                <BoxSelect className="h-4 w-4" />
              </Button>
              <Tooltip.Content>Add object layer</Tooltip.Content>
            </Tooltip>
          </div>
        )}
      >
        Layers
      </PanelHeader>
      <PanelContent className="p-1.5">
        <div className="space-y-1" role="listbox" aria-label="Layers">
          {layers.map((layer, index) => {
            const isActive = index === activeLayerIndex;
            const VisibilityIcon = layer.visible ? Eye : EyeOff;

            return (
              <div
                key={`${layer.name}-${index}`}
                className={cn(
                  'flex cursor-pointer items-center gap-1 rounded-md px-1.5 py-1 text-sm text-foreground transition-colors',
                  'hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-focus',
                  isActive && 'bg-accent-soft'
                )}
                role="option"
                tabIndex={0}
                aria-selected={isActive}
                onClick={(event): void => handleLayerClick(event, index)}
                onKeyDown={(event) => handleLayerKeyDown(event, index)}
              >
                <ToggleButton
                  data-layer-action="true"
                  isIconOnly
                  isSelected={layer.visible}
                  onChange={() => setLayerVisibility(index, !layer.visible)}
                  variant="ghost"
                  size="sm"
                  aria-label={`${layer.visible ? 'Hide' : 'Show'} ${layer.name}`}
                >
                  <VisibilityIcon className="h-4 w-4" />
                </ToggleButton>
                {layer.type === 'tile'
                  ? <Grid3x3 className="h-3 w-3 shrink-0 text-muted" />
                  : <BoxSelect className="h-3 w-3 shrink-0 text-muted" />}
                <span className="min-w-0 flex-1 truncate text-sm">{layer.name}</span>
                {layers.length > 1 && (
                  <Button
                    data-layer-action="true"
                    isIconOnly
                    variant="ghost"
                    size="sm"
                    onPress={() => removeLayer(index)}
                    aria-label={`Remove ${layer.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </PanelContent>
    </Panel>
  );
}
