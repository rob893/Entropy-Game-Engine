import { Button, Input, Label, NumberField, Separator, TextField } from '@heroui/react';
import { Trash2 } from 'lucide-react';
import type { ReactElement } from 'react';
import type {
  IEditorMapFile,
  IEditorPrefabInstance,
  IEditorTileLayer
} from '../../../shared/types';
import { useEditorStore } from '../../stores/editor-store';
import { Panel, PanelContent, PanelHeader } from '../editor/Panel';

// ── Helpers ──

function findInstance(mapFile: IEditorMapFile, instanceId: string): IEditorPrefabInstance | null {
  for (const layer of mapFile.layers) {
    if (layer.type !== 'object') {
      continue;
    }

    const instance = layer.instances.find(inst => inst.id === instanceId);

    if (instance !== undefined) {
      return instance;
    }
  }

  return null;
}

function formatFieldValue(value: unknown): string {
  if (value === null || value === undefined) {
    return '—';
  }

  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }

  if (typeof value === 'number') {
    return String(value);
  }

  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;

    if ('x' in obj && 'y' in obj) {
      return `${String(obj.x)}, ${String(obj.y)}`;
    }

    try {
      return JSON.stringify(value);
    } catch {
      return '[complex value]';
    }
  }

  try {
    return JSON.stringify(value) ?? '—';
  } catch {
    return '—';
  }
}

// ── Sub-components ──

function MapProperties({ mapFile }: { mapFile: IEditorMapFile }): ReactElement {
  const setMapName = useEditorStore(state => state.setMapName);
  const setMapTileSize = useEditorStore(state => state.setMapTileSize);
  const resizeMap = useEditorStore(state => state.resizeMap);

  const firstTileLayer = mapFile.layers.find((layer): layer is IEditorTileLayer => layer.type === 'tile');
  const rows = firstTileLayer?.grid.length ?? 0;
  const cols = firstTileLayer?.grid[0]?.length ?? 0;

  return (
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
  );
}

function InstanceProperties({ instance }: { instance: IEditorPrefabInstance }): ReactElement {
  const moveInstance = useEditorStore(state => state.moveInstance);
  const rotateInstance = useEditorStore(state => state.rotateInstance);
  const scaleInstance = useEditorStore(state => state.scaleInstance);
  const deleteInstance = useEditorStore(state => state.deleteInstance);
  const pushUndoSnapshot = useEditorStore(state => state.pushUndoSnapshot);

  const propertyEntries = Object.entries(instance.properties);

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <div className="text-sm text-foreground">
          <span className="font-medium">Instance:</span> {instance.name}
        </div>
        <div className="text-xs text-muted">
          <span className="font-medium">Class:</span> {instance.gameObjectClass}
        </div>
        <div className="text-xs text-muted">
          <span className="font-medium">Tag:</span> {instance.tag || '—'}
        </div>
        <div className="text-xs text-muted">
          <span className="font-medium">Layer:</span> {instance.layer}
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted">Transform</span>

        <NumberField
          value={instance.x}
          onChange={v => {
            pushUndoSnapshot();
            moveInstance(instance.id, v, instance.y);
          }}
          formatOptions={{ maximumFractionDigits: 2 }}
        >
          <Label className="text-xs text-muted">Position X</Label>
          <NumberField.Group>
            <NumberField.Input className="text-sm" />
          </NumberField.Group>
        </NumberField>

        <NumberField
          value={instance.y}
          onChange={v => {
            pushUndoSnapshot();
            moveInstance(instance.id, instance.x, v);
          }}
          formatOptions={{ maximumFractionDigits: 2 }}
        >
          <Label className="text-xs text-muted">Position Y</Label>
          <NumberField.Group>
            <NumberField.Input className="text-sm" />
          </NumberField.Group>
        </NumberField>

        <NumberField
          value={instance.rotation}
          onChange={v => rotateInstance(instance.id, v)}
          formatOptions={{ maximumFractionDigits: 4 }}
        >
          <Label className="text-xs text-muted">Rotation</Label>
          <NumberField.Group>
            <NumberField.Input className="text-sm" />
          </NumberField.Group>
        </NumberField>

        <NumberField
          value={instance.scaleX}
          step={0.1}
          onChange={v => scaleInstance(instance.id, v, instance.scaleY)}
          formatOptions={{ maximumFractionDigits: 4 }}
        >
          <Label className="text-xs text-muted">Scale X</Label>
          <NumberField.Group>
            <NumberField.Input className="text-sm" />
          </NumberField.Group>
        </NumberField>

        <NumberField
          value={instance.scaleY}
          step={0.1}
          onChange={v => scaleInstance(instance.id, instance.scaleX, v)}
          formatOptions={{ maximumFractionDigits: 4 }}
        >
          <Label className="text-xs text-muted">Scale Y</Label>
          <NumberField.Group>
            <NumberField.Input className="text-sm" />
          </NumberField.Group>
        </NumberField>
      </div>

      {propertyEntries.length > 0 && (
        <>
          <Separator />

          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">Properties</span>

            {propertyEntries.map(([key, value]) => (
              <div key={key} className="grid grid-cols-[88px,1fr] gap-x-2 text-xs">
                <span className="truncate text-muted">{key}</span>
                <span className="truncate text-foreground">{formatFieldValue(value)}</span>
              </div>
            ))}
          </div>
        </>
      )}

      <Separator />

      <Button
        variant="danger-soft"
        size="sm"
        className="w-full"
        onPress={() => deleteInstance(instance.id)}
      >
        <Trash2 size={14} />
        Delete Instance
      </Button>
    </div>
  );
}

// ── Main Component ──

export function PropertiesPanel(): ReactElement {
  const mapFile = useEditorStore(state => state.mapFile);
  const selectedInstanceId = useEditorStore(state => state.selectedInstanceId);

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

  if (selectedInstanceId !== null) {
    const instance = findInstance(mapFile, selectedInstanceId);

    if (instance !== null) {
      return (
        <Panel className="h-full border-l border-border bg-surface">
          <PanelHeader>Properties</PanelHeader>
          <PanelContent>
            <InstanceProperties instance={instance} />
          </PanelContent>
        </Panel>
      );
    }
  }

  return (
    <Panel className="h-full border-l border-border bg-surface">
      <PanelHeader>Properties</PanelHeader>
      <PanelContent>
        <MapProperties mapFile={mapFile} />
      </PanelContent>
    </Panel>
  );
}
