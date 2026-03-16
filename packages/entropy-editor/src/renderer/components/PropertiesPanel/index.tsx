import { Label } from '@heroui/react';
import type { ReactElement } from 'react';
import type { IEditorTileLayer } from '../../../shared/types';
import { cn } from '../../lib/utils';
import { useEditorStore } from '../../stores/editor-store';
import { Panel, PanelContent, PanelHeader } from '../editor/Panel';

interface IPropertyRow {
  label: string;
  value: string;
}

export function PropertiesPanel(): ReactElement {
  const mapFile = useEditorStore(state => state.mapFile);

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
  const properties: IPropertyRow[] = [
    { label: 'Map Name', value: mapFile.name },
    { label: 'Dimensions', value: `${cols} × ${rows} tiles` },
    { label: 'Tile Size', value: `${mapFile.tileWidth} × ${mapFile.tileHeight} px` },
    { label: 'Layers', value: String(mapFile.layers.length) },
    { label: 'Tilesets', value: String(mapFile.tilesets.length) }
  ];

  return (
    <Panel className="h-full border-l border-border bg-surface">
      <PanelHeader>Properties</PanelHeader>
      <PanelContent>
        <div className="space-y-3">
          {properties.map((property, index) => (
            <div
              key={property.label}
              className={cn(
                'grid grid-cols-[88px,1fr] gap-x-3 gap-y-1 text-sm',
                index < properties.length - 1 && 'border-b border-border/60 pb-3'
              )}
            >
              <Label className="text-sm font-medium text-muted">{property.label}</Label>
              <div className="text-sm text-foreground">{property.value}</div>
            </div>
          ))}
        </div>
      </PanelContent>
    </Panel>
  );
}
