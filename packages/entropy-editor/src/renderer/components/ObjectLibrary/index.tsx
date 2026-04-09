import { Button, Disclosure, DisclosureGroup, Dropdown, Label, Tooltip } from '@heroui/react';
import { Copy, EllipsisVertical, Package, Pencil, Plus, Trash2 } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import type { DragEvent, KeyboardEvent, MouseEvent, ReactElement } from 'react';
import type { IEditorPrefab } from '../../../shared/types';
import { cn } from '../../lib/utils';
import { useEditorStore } from '../../stores/editor-store';
import { Panel, PanelContent, PanelHeader } from '../editor/Panel';
import { PrefabEditor } from '../PrefabEditor';

function generateUniqueName(baseName: string, existingNames: ReadonlySet<string>): string {
  if (!existingNames.has(baseName)) {
    return baseName;
  }

  let i = 1;

  while (existingNames.has(`${baseName} (${i})`)) {
    i++;
  }

  return `${baseName} (${i})`;
}

function isActionTarget(target: EventTarget | null): boolean {
  return target instanceof HTMLElement && target.closest('[data-prefab-action="true"]') !== null;
}

export function ObjectLibrary(): ReactElement {
  const prefabs = useEditorStore(state => state.prefabs);
  const selectedPrefabId = useEditorStore(state => state.selectedPrefabId);
  const setSelectedPrefabId = useEditorStore(state => state.setSelectedPrefabId);
  const createPrefab = useEditorStore(state => state.createPrefab);
  const updatePrefab = useEditorStore(state => state.updatePrefab);
  const deletePrefab = useEditorStore(state => state.deletePrefab);

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPrefab, setEditingPrefab] = useState<IEditorPrefab | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const categorizedPrefabs = useMemo(() => {
    const map = new Map<string, IEditorPrefab[]>();

    for (const prefab of prefabs) {
      const category = prefab.category || 'Uncategorized';
      const list = map.get(category);

      if (list !== undefined) {
        list.push(prefab);
      } else {
        map.set(category, [prefab]);
      }
    }

    return map;
  }, [prefabs]);

  const existingNames = useMemo(() => new Set(prefabs.map(p => p.name)), [prefabs]);

  const defaultExpandedKeys = useMemo(
    () => new Set<string | number>(Array.from(categorizedPrefabs.keys())),
    [categorizedPrefabs]
  );

  const handleNewPrefab = useCallback((): void => {
    setEditingPrefab(null);
    setIsEditorOpen(true);
  }, []);

  const handleEditPrefab = useCallback((prefab: IEditorPrefab): void => {
    setEditingPrefab(prefab);
    setIsEditorOpen(true);
  }, []);

  const handleCloseEditor = useCallback((): void => {
    setIsEditorOpen(false);
    setEditingPrefab(null);
  }, []);

  const handleSaveEditor = useCallback((prefab: IEditorPrefab): void => {
    if (editingPrefab !== null) {
      void updatePrefab(prefab);
    } else {
      void createPrefab(prefab);
    }

    setIsEditorOpen(false);
    setEditingPrefab(null);
  }, [editingPrefab, createPrefab, updatePrefab]);

  const handleDuplicatePrefab = useCallback((prefab: IEditorPrefab): void => {
    const newName = generateUniqueName(prefab.name, existingNames);
    const duplicate: IEditorPrefab = {
      id: crypto.randomUUID(),
      name: newName,
      category: prefab.category,
      thumbnail: prefab.thumbnail,
      template: { ...prefab.template, id: crypto.randomUUID(), name: newName }
    };

    void createPrefab(duplicate);
  }, [createPrefab, existingNames]);

  const handleDeletePrefab = useCallback((prefabId: string): void => {
    void deletePrefab(prefabId);
  }, [deletePrefab]);

  const handlePrefabClick = useCallback((event: MouseEvent, prefabId: string): void => {
    if (isActionTarget(event.target)) {
      return;
    }

    setSelectedPrefabId(prefabId);
  }, [setSelectedPrefabId]);

  const handlePrefabDoubleClick = useCallback((_event: MouseEvent, prefab: IEditorPrefab): void => {
    if (isActionTarget(_event.target)) {
      return;
    }

    handleEditPrefab(prefab);
  }, [handleEditPrefab]);

  const handlePrefabKeyDown = useCallback((event: KeyboardEvent, prefabId: string): void => {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    setSelectedPrefabId(prefabId);
  }, [setSelectedPrefabId]);

  const handleContextMenu = useCallback((event: MouseEvent, prefabId: string): void => {
    event.preventDefault();
    setSelectedPrefabId(prefabId);
    setOpenDropdownId(prefabId);
  }, [setSelectedPrefabId]);

  const handleDragStart = useCallback((event: DragEvent, prefabId: string): void => {
    event.dataTransfer.setData('application/entropy-prefab', prefabId);
    event.dataTransfer.effectAllowed = 'copy';
  }, []);

  const handleDropdownAction = useCallback((key: string | number, prefab: IEditorPrefab): void => {
    setOpenDropdownId(null);

    switch (key) {
      case 'edit':
        handleEditPrefab(prefab);
        break;
      case 'duplicate':
        handleDuplicatePrefab(prefab);
        break;
      case 'delete':
        handleDeletePrefab(prefab.id);
        break;
    }
  }, [handleEditPrefab, handleDuplicatePrefab, handleDeletePrefab]);

  return (
    <Panel className="min-h-0 flex-1">
      <PanelHeader
        actions={(
          <Tooltip delay={300}>
            <Button
              size="sm"
              variant="ghost"
              isIconOnly
              onPress={handleNewPrefab}
              aria-label="New prefab"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Tooltip.Content>New prefab</Tooltip.Content>
          </Tooltip>
        )}
      >
        Prefab Library
      </PanelHeader>

      <PanelContent className="p-1.5">
        {prefabs.length === 0 ? (
          <p className="px-1 py-4 text-center text-xs text-muted">
            Create a prefab to start.
          </p>
        ) : (
          <DisclosureGroup allowsMultipleExpanded defaultExpandedKeys={defaultExpandedKeys}>
            {Array.from(categorizedPrefabs.entries()).map(([category, categoryPrefabs]) => (
              <Disclosure key={category} id={category}>
                <Disclosure.Heading>
                  <Button
                    slot="trigger"
                    variant="tertiary"
                    size="sm"
                    className="w-full justify-start border-none bg-transparent px-1"
                  >
                    <Disclosure.Indicator className="h-3 w-3 text-muted" />
                    <span className="text-xs font-semibold text-muted">
                      {category} ({categoryPrefabs.length})
                    </span>
                  </Button>
                </Disclosure.Heading>
                <Disclosure.Content>
                  <Disclosure.Body className="space-y-0.5 py-0.5">
                    {categoryPrefabs.map(prefab => {
                      const isSelected = prefab.id === selectedPrefabId;

                      return (
                        <div
                          key={prefab.id}
                          className={cn(
                            'flex cursor-pointer items-center gap-1.5 rounded-md px-1.5 py-1 text-sm',
                            'text-foreground transition-colors',
                            'hover:bg-surface-hover',
                            'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-focus',
                            isSelected && 'bg-accent-soft'
                          )}
                          role="option"
                          tabIndex={0}
                          aria-selected={isSelected}
                          draggable
                          onClick={(e) => handlePrefabClick(e, prefab.id)}
                          onDoubleClick={(e) => handlePrefabDoubleClick(e, prefab)}
                          onKeyDown={(e) => handlePrefabKeyDown(e, prefab.id)}
                          onContextMenu={(e) => handleContextMenu(e, prefab.id)}
                          onDragStart={(e) => handleDragStart(e, prefab.id)}
                        >
                          <Package className="h-3.5 w-3.5 shrink-0 text-muted" />
                          <span className="min-w-0 flex-1 truncate text-xs">{prefab.name}</span>

                          <Dropdown
                            isOpen={openDropdownId === prefab.id}
                            onOpenChange={(open) => setOpenDropdownId(open ? prefab.id : null)}
                          >
                            <Button
                              data-prefab-action="true"
                              isIconOnly
                              variant="ghost"
                              size="sm"
                              aria-label={`Actions for ${prefab.name}`}
                              className="h-5 w-5 min-w-0"
                            >
                              <EllipsisVertical className="h-3 w-3" />
                            </Button>
                            <Dropdown.Popover>
                              <Dropdown.Menu onAction={(key) => handleDropdownAction(key, prefab)}>
                                <Dropdown.Item id="edit" textValue="Edit Prefab">
                                  <Pencil className="size-3.5 shrink-0 text-muted" />
                                  <Label>Edit Prefab</Label>
                                </Dropdown.Item>
                                <Dropdown.Item id="duplicate" textValue="Duplicate">
                                  <Copy className="size-3.5 shrink-0 text-muted" />
                                  <Label>Duplicate</Label>
                                </Dropdown.Item>
                                <Dropdown.Item id="delete" textValue="Delete" variant="danger">
                                  <Trash2 className="size-3.5 shrink-0 text-danger" />
                                  <Label>Delete</Label>
                                </Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown.Popover>
                          </Dropdown>
                        </div>
                      );
                    })}
                  </Disclosure.Body>
                </Disclosure.Content>
              </Disclosure>
            ))}
          </DisclosureGroup>
        )}
      </PanelContent>

      <PrefabEditor
        prefab={editingPrefab}
        isOpen={isEditorOpen}
        onClose={handleCloseEditor}
        onSave={handleSaveEditor}
      />
    </Panel>
  );
}
