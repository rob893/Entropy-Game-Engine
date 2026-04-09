import { Button, Input, Label, NumberField, Separator, TextField } from '@heroui/react';
import { Trash2 } from 'lucide-react';
import { useMemo } from 'react';
import type { ReactElement } from 'react';
import { COMPONENT_SCHEMAS } from '../../../shared/schemas/component-schemas';
import type {
  IComponentOverride,
  IComponentSchema,
  IEditorMapFile,
  IEditorPrefab,
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

function resolveComponentValue(
  componentData: Record<string, unknown>,
  overrides: IComponentOverride[],
  typeName: string
): Record<string, unknown> {
  const resolved = { ...componentData };

  for (const override of overrides) {
    if (override.typeName === typeName) {
      resolved[override.fieldPath] = override.value;
    }
  }

  return resolved;
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

  // symbol, bigint, function — stringify safely
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

interface IInstancePropertiesProps {
  instance: IEditorPrefabInstance;
  prefab: IEditorPrefab | undefined;
}

function InstanceProperties({ instance, prefab }: IInstancePropertiesProps): ReactElement {
  const moveInstance = useEditorStore(state => state.moveInstance);
  const rotateInstance = useEditorStore(state => state.rotateInstance);
  const scaleInstance = useEditorStore(state => state.scaleInstance);
  const deleteInstance = useEditorStore(state => state.deleteInstance);
  const pushUndoSnapshot = useEditorStore(state => state.pushUndoSnapshot);
  const userComponentSchemas = useEditorStore(state => state.userComponentSchemas);

  const allSchemaMap = useMemo((): ReadonlyMap<string, IComponentSchema> => {
    const map = new Map<string, IComponentSchema>(COMPONENT_SCHEMAS);
    for (const schema of userComponentSchemas) {
      if (!map.has(schema.typeName)) {
        map.set(schema.typeName, schema);
      }
    }
    return map;
  }, [userComponentSchemas]);

  const templateComponents = prefab?.template.components ?? [];
  // Exclude Transform from read-only list — instance fields cover it
  const displayComponents = templateComponents.filter(c => c.typeName !== 'Transform');

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <div className="text-sm text-foreground">
          <span className="font-medium">Instance:</span> {instance.name}
        </div>
        {prefab !== undefined && (
          <div className="text-xs text-muted">
            <span className="font-medium">Prefab:</span> {prefab.name}
          </div>
        )}
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

      {displayComponents.length > 0 && (
        <>
          <Separator />

          <div className="space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">Components</span>

            {displayComponents.map(component => {
              const schema = allSchemaMap.get(component.typeName);
              const resolved = resolveComponentValue(
                component.data,
                instance.componentOverrides,
                component.typeName
              );
              const displayName = schema?.displayName ?? component.typeName;

              return (
                <div key={component.typeName} className="space-y-1">
                  <span className="text-xs font-medium text-foreground">{displayName}</span>

                  {schema !== undefined && schema.fields.length > 0 ? (
                    schema.fields.map(field => (
                      <div key={field.name} className="grid grid-cols-[88px,1fr] gap-x-2 text-xs">
                        <span className="text-muted truncate">{field.displayName}</span>
                        <span className="text-foreground truncate">
                          {formatFieldValue(resolved[field.name] ?? field.defaultValue)}
                        </span>
                      </div>
                    ))
                  ) : (
                    Object.entries(resolved).map(([key, value]) => (
                      <div key={key} className="grid grid-cols-[88px,1fr] gap-x-2 text-xs">
                        <span className="text-muted truncate">{key}</span>
                        <span className="text-foreground truncate">{formatFieldValue(value)}</span>
                      </div>
                    ))
                  )}
                </div>
              );
            })}
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

function PrefabSummary({ prefab }: { prefab: IEditorPrefab }): ReactElement {
  const userComponentSchemas = useEditorStore(state => state.userComponentSchemas);

  const allSchemaMap = useMemo((): ReadonlyMap<string, IComponentSchema> => {
    const map = new Map<string, IComponentSchema>(COMPONENT_SCHEMAS);
    for (const schema of userComponentSchemas) {
      if (!map.has(schema.typeName)) {
        map.set(schema.typeName, schema);
      }
    }
    return map;
  }, [userComponentSchemas]);

  const componentNames = prefab.template.components.map(c => {
    const schema = allSchemaMap.get(c.typeName);

    return schema?.displayName ?? c.typeName;
  });

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <div className="text-sm text-foreground">
          <span className="font-medium">Prefab:</span> {prefab.name}
        </div>
        <div className="text-xs text-muted">
          <span className="font-medium">Category:</span> {prefab.category}
        </div>
        <div className="text-xs text-muted">
          <span className="font-medium">Components:</span> {prefab.template.components.length}
        </div>
      </div>

      {componentNames.length > 0 && (
        <div className="space-y-1">
          {componentNames.map(name => (
            <div key={name} className="text-xs text-muted pl-2">— {name}</div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Component ──

export function PropertiesPanel(): ReactElement {
  const mapFile = useEditorStore(state => state.mapFile);
  const selectedInstanceId = useEditorStore(state => state.selectedInstanceId);
  const selectedPrefabId = useEditorStore(state => state.selectedPrefabId);
  const prefabs = useEditorStore(state => state.prefabs);

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

  // Instance selected — resolve and show inspector
  if (selectedInstanceId !== null) {
    const instance = findInstance(mapFile, selectedInstanceId);

    if (instance !== null) {
      const prefab = prefabs.find(p => p.id === instance.prefabId);

      return (
        <Panel className="h-full border-l border-border bg-surface">
          <PanelHeader>Properties</PanelHeader>
          <PanelContent>
            <InstanceProperties instance={instance} prefab={prefab} />
          </PanelContent>
        </Panel>
      );
    }
    // Stale selection — fall through to prefab or map view
  }

  // Prefab selected in library
  if (selectedPrefabId !== null) {
    const prefab = prefabs.find(p => p.id === selectedPrefabId);

    if (prefab !== undefined) {
      return (
        <Panel className="h-full border-l border-border bg-surface">
          <PanelHeader>Properties</PanelHeader>
          <PanelContent>
            <PrefabSummary prefab={prefab} />
          </PanelContent>
        </Panel>
      );
    }
  }

  // Default: map properties
  return (
    <Panel className="h-full border-l border-border bg-surface">
      <PanelHeader>Properties</PanelHeader>
      <PanelContent>
        <MapProperties mapFile={mapFile} />
      </PanelContent>
    </Panel>
  );
}
