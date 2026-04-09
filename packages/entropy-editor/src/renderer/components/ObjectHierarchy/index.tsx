import { Box, ChevronDown, ChevronRight } from 'lucide-react';
import type { KeyboardEvent, ReactElement } from 'react';
import { useState } from 'react';
import type { IEditorObjectLayer, IEditorPrefabInstance } from '../../../shared/types';
import { cn } from '../../lib/utils';
import { useEditorStore } from '../../stores/editor-store';
import { Panel, PanelContent, PanelHeader } from '../editor/Panel';

// ── Tree Node ──

interface ITreeNode {
  instance: IEditorPrefabInstance;
  children: ITreeNode[];
}

function buildTree(instances: readonly IEditorPrefabInstance[]): ITreeNode[] {
  const nodeMap = new Map<string, ITreeNode>();

  for (const instance of instances) {
    nodeMap.set(instance.id, { instance, children: [] });
  }

  const roots: ITreeNode[] = [];

  for (const node of nodeMap.values()) {
    const parentId = node.instance.parentInstanceId;

    if (parentId === null || parentId === node.instance.id) {
      // Root or self-referencing — treat as root
      roots.push(node);
      continue;
    }

    const parent = nodeMap.get(parentId);

    if (parent !== undefined) {
      parent.children.push(node);
    } else {
      // Orphan (parent not in this layer) — promote to root
      roots.push(node);
    }
  }

  return roots;
}

// ── Object Layer Section ──

interface IObjectLayerSectionProps {
  layer: IEditorObjectLayer;
  layerIndex: number;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  selectedInstanceId: string | null;
  onSelectInstance: (instanceId: string, layerIndex: number) => void;
}

function ObjectLayerSection({
  layer,
  layerIndex,
  isCollapsed,
  onToggleCollapse,
  selectedInstanceId,
  onSelectInstance
}: IObjectLayerSectionProps): ReactElement {
  const tree = buildTree(layer.instances);
  const CollapseIcon = isCollapsed ? ChevronRight : ChevronDown;

  const handleHeaderKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    onToggleCollapse();
  };

  return (
    <div>
      <div
        className={cn(
          'flex cursor-pointer items-center gap-1 rounded-md px-1.5 py-1 text-xs font-semibold uppercase tracking-wider text-muted',
          'hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-focus'
        )}
        role="button"
        tabIndex={0}
        onClick={onToggleCollapse}
        onKeyDown={handleHeaderKeyDown}
        aria-expanded={!isCollapsed}
        aria-label={`${layer.name} — ${layer.instances.length} instance${layer.instances.length === 1 ? '' : 's'}`}
      >
        <CollapseIcon className="h-3 w-3 shrink-0" />
        <span className="min-w-0 flex-1 truncate">{layer.name}</span>
        <span className="text-[10px] font-normal text-muted">{layer.instances.length}</span>
      </div>

      {!isCollapsed && (
        <div role="listbox" aria-label={`${layer.name} instances`}>
          {tree.length > 0
            ? tree.map(node => (
                <TreeNodeItem
                  key={node.instance.id}
                  node={node}
                  depth={0}
                  layerIndex={layerIndex}
                  selectedInstanceId={selectedInstanceId}
                  onSelectInstance={onSelectInstance}
                />
              ))
            : (
                <p className="px-3 py-1.5 text-xs text-muted">No instances yet</p>
              )}
        </div>
      )}
    </div>
  );
}

// ── Tree Node Item ──

interface ITreeNodeItemProps {
  node: ITreeNode;
  depth: number;
  layerIndex: number;
  selectedInstanceId: string | null;
  onSelectInstance: (instanceId: string, layerIndex: number) => void;
}

function TreeNodeItem({ node, depth, layerIndex, selectedInstanceId, onSelectInstance }: ITreeNodeItemProps): ReactElement {
  const isSelected = node.instance.id === selectedInstanceId;

  const handleClick = (): void => {
    onSelectInstance(node.instance.id, layerIndex);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    onSelectInstance(node.instance.id, layerIndex);
  };

  return (
    <>
      <div
        className={cn(
          'flex cursor-pointer items-center gap-1 rounded-md py-1 pr-1.5 text-sm text-foreground transition-colors',
          'hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-focus',
          isSelected && 'bg-accent-soft'
        )}
        style={{ paddingLeft: `${(depth + 1) * 16}px` }}
        role="option"
        tabIndex={0}
        aria-selected={isSelected}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      >
        <Box className="h-3 w-3 shrink-0 text-muted" />
        <span className="min-w-0 flex-1 truncate">{node.instance.name}</span>
      </div>

      {node.children.map(child => (
        <TreeNodeItem
          key={child.instance.id}
          node={child}
          depth={depth + 1}
          layerIndex={layerIndex}
          selectedInstanceId={selectedInstanceId}
          onSelectInstance={onSelectInstance}
        />
      ))}
    </>
  );
}

// ── ObjectHierarchy Panel ──

export function ObjectHierarchy(): ReactElement {
  const mapFile = useEditorStore(state => state.mapFile);
  const selectedInstanceId = useEditorStore(state => state.selectedInstanceId);
  const selectInstance = useEditorStore(state => state.selectInstance);
  const setActiveLayer = useEditorStore(state => state.setActiveLayer);

  const [collapsedLayers, setCollapsedLayers] = useState<Set<string>>(() => new Set());

  const layers = mapFile?.layers ?? [];

  const objectLayers: { layer: IEditorObjectLayer; originalIndex: number }[] = [];

  for (let i = 0; i < layers.length; i++) {
    const layer = layers[i];

    if (layer.type === 'object') {
      objectLayers.push({ layer, originalIndex: i });
    }
  }

  const toggleCollapse = (layerName: string): void => {
    setCollapsedLayers(prev => {
      const next = new Set(prev);

      if (next.has(layerName)) {
        next.delete(layerName);
      } else {
        next.add(layerName);
      }

      return next;
    });
  };

  const handleSelectInstance = (instanceId: string, layerIndex: number): void => {
    setActiveLayer(layerIndex);
    // setActiveLayer clears selection, so we must re-select after
    selectInstance(instanceId);
  };

  if (objectLayers.length === 0) {
    return (
      <Panel className="shrink-0">
        <PanelHeader>Hierarchy</PanelHeader>
        <PanelContent>
          <p className="text-xs text-muted">No object layers in this map.</p>
        </PanelContent>
      </Panel>
    );
  }

  return (
    <Panel className="min-h-32 shrink-0">
      <PanelHeader>Hierarchy</PanelHeader>
      <PanelContent className="p-1.5">
        <div className="space-y-1">
          {objectLayers.map(({ layer, originalIndex }) => (
            <ObjectLayerSection
              key={`${layer.name}-${originalIndex}`}
              layer={layer}
              layerIndex={originalIndex}
              isCollapsed={collapsedLayers.has(layer.name)}
              onToggleCollapse={() => toggleCollapse(layer.name)}
              selectedInstanceId={selectedInstanceId}
              onSelectInstance={handleSelectInstance}
            />
          ))}
        </div>
      </PanelContent>
    </Panel>
  );
}
