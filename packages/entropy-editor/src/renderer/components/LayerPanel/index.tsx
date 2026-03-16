import { BoxSelect, Eye, EyeOff, Grid3x3, Trash2 } from 'lucide-react';
import type { KeyboardEvent, ReactElement } from 'react';
import { cn } from '../../lib/utils';
import { useEditorStore } from '../../stores/editor-store';
import { Panel, PanelContent, PanelHeader } from '../editor/Panel';
import { Button } from '../ui/Button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/Tooltip';

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

  return (
    <Panel className="min-h-40 shrink-0">
      <PanelHeader
        actions={(
          <div className="flex items-center gap-0.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0"
                  onClick={() => addLayer(`Tile Layer ${tileLayerCount + 1}`)}
                  aria-label="Add tile layer"
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Add tile layer</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0"
                  onClick={() => addObjectLayer(`Object Layer ${objectLayerCount + 1}`)}
                  aria-label="Add object layer"
                >
                  <BoxSelect className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Add object layer</TooltipContent>
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
                  'hover:bg-white/8 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring',
                  isActive && 'bg-primary/20'
                )}
                role="option"
                tabIndex={0}
                aria-selected={isActive}
                onClick={() => setActiveLayer(index)}
                onKeyDown={(event) => handleLayerKeyDown(event, index)}
              >
                <button
                  type="button"
                  className={cn(
                    'inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition-colors',
                    'text-muted-foreground hover:bg-white/8 hover:text-foreground',
                    'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring',
                    !layer.visible && 'opacity-50'
                  )}
                  onClick={(event) => {
                    event.stopPropagation();
                    setLayerVisibility(index, !layer.visible);
                  }}
                  title={layer.visible ? 'Hide layer' : 'Show layer'}
                  aria-label={`${layer.visible ? 'Hide' : 'Show'} ${layer.name}`}
                >
                  <VisibilityIcon className="h-4 w-4" />
                </button>
                {layer.type === 'tile'
                  ? <Grid3x3 className="h-3 w-3 shrink-0 text-muted-foreground" />
                  : <BoxSelect className="h-3 w-3 shrink-0 text-muted-foreground" />}
                <span className="min-w-0 flex-1 truncate text-sm">{layer.name}</span>
                {layers.length > 1 && (
                  <button
                    type="button"
                    className={cn(
                      'inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition-colors',
                      'text-muted-foreground hover:bg-destructive/15 hover:text-destructive',
                      'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring'
                    )}
                    onClick={(event) => {
                      event.stopPropagation();
                      removeLayer(index);
                    }}
                    title="Remove layer"
                    aria-label={`Remove ${layer.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </PanelContent>
    </Panel>
  );
}
