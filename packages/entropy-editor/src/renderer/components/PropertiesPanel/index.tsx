import { Input, Label, NumberField, TextField } from '@heroui/react';
import type { ReactElement } from 'react';
import type { IEditorTileLayer } from '../../../shared/types';
import { useEditorStore } from '../../stores/editor-store';
import { Panel, PanelContent, PanelHeader } from '../editor/Panel';

export function PropertiesPanel(): ReactElement {
  const mapFile = useEditorStore(state => state.mapFile);
  const setMapName = useEditorStore(state => state.setMapName);
  const setMapTileSize = useEditorStore(state => state.setMapTileSize);
  const resizeMap = useEditorStore(state => state.resizeMap);

  if (mapFile === null) {
    return (
      <Panel className="h-full border-l border-border bg-surface">
        <PanelHeader>Properties</PanelHeader>
        <PanelContent>
          <p className="text-sm text-muted">No map loaded.</p>
        </PanelContent>
      </Panel>
    );
  }

  const firstTileLayer = mapFile.layers.find((layer): layer is IEditorTileLayer => layer.type === 'tile');
  const rows = firstTileLayer?.grid.length ?? 0;
  const cols = firstTileLayer?.grid[0]?.length ?? 0;

  return (
    <Panel className="h-full border-l border-border bg-surface">
      <PanelHeader>Properties</PanelHeader>
      <PanelContent>
        <div className="space-y-4">
          <TextField
            value={mapFile.name}
            onChange={setMapName}
          >
            <Label className="text-xs font-medium text-muted">Map Name</Label>
            <Input className="text-sm" />
          </TextField>

          <div className="space-y-1">
            <span className="text-xs font-medium text-muted">Dimensions (tiles)</span>
            <div className="flex items-center gap-2">
              <NumberField
                value={cols}
                minValue={1}
                maxValue={500}
                onChange={v => resizeMap(rows, v)}
              >
                <Label className="sr-only">Columns</Label>
                <NumberField.Group>
                  <NumberField.Input className="w-16 text-sm" />
                </NumberField.Group>
              </NumberField>
              <span className="text-xs text-muted">×</span>
              <NumberField
                value={rows}
                minValue={1}
                maxValue={500}
                onChange={v => resizeMap(v, cols)}
              >
                <Label className="sr-only">Rows</Label>
                <NumberField.Group>
                  <NumberField.Input className="w-16 text-sm" />
                </NumberField.Group>
              </NumberField>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-medium text-muted">Tile Size (px)</span>
            <div className="flex items-center gap-2">
              <NumberField
                value={mapFile.tileWidth}
                minValue={1}
                maxValue={512}
                onChange={v => setMapTileSize(v, mapFile.tileHeight)}
              >
                <Label className="sr-only">Tile Width</Label>
                <NumberField.Group>
                  <NumberField.Input className="w-16 text-sm" />
                </NumberField.Group>
              </NumberField>
              <span className="text-xs text-muted">×</span>
              <NumberField
                value={mapFile.tileHeight}
                minValue={1}
                maxValue={512}
                onChange={v => setMapTileSize(mapFile.tileWidth, v)}
              >
                <Label className="sr-only">Tile Height</Label>
                <NumberField.Group>
                  <NumberField.Input className="w-16 text-sm" />
                </NumberField.Group>
              </NumberField>
            </div>
          </div>

          <div className="grid grid-cols-[88px,1fr] gap-x-3 text-sm border-t border-border/60 pt-3">
            <span className="text-xs font-medium text-muted">Layers</span>
            <span className="text-sm text-foreground">{mapFile.layers.length}</span>
          </div>
          <div className="grid grid-cols-[88px,1fr] gap-x-3 text-sm">
            <span className="text-xs font-medium text-muted">Tilesets</span>
            <span className="text-sm text-foreground">{mapFile.tilesets.length}</span>
          </div>
        </div>
      </PanelContent>
    </Panel>
  );
}
