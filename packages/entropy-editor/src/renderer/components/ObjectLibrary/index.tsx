import { Button, Disclosure, DisclosureGroup } from '@heroui/react';
import { Package } from 'lucide-react';
import { useCallback, useMemo } from 'react';
import type { DragEvent, KeyboardEvent, ReactElement } from 'react';
import type { IDiscoveredGameObject } from '../../../shared/types';
import { cn } from '../../lib/utils';
import { useEditorStore } from '../../stores/editor-store';
import { Panel, PanelContent, PanelHeader } from '../editor/Panel';

export function ObjectLibrary(): ReactElement {
  const discoveredGameObjects = useEditorStore(state => state.discoveredGameObjects);
  const selectedGameObjectClass = useEditorStore(state => state.selectedGameObjectClass);
  const setSelectedGameObjectClass = useEditorStore(state => state.setSelectedGameObjectClass);
  const selectInstance = useEditorStore(state => state.selectInstance);

  const categorized = useMemo(() => {
    const map = new Map<string, IDiscoveredGameObject[]>();

    for (const go of discoveredGameObjects) {
      const category = go.category || 'Uncategorized';
      const list = map.get(category);

      if (list !== undefined) {
        list.push(go);
      } else {
        map.set(category, [go]);
      }
    }

    return map;
  }, [discoveredGameObjects]);

  const defaultExpandedKeys = useMemo(
    () => new Set<string | number>(Array.from(categorized.keys())),
    [categorized]
  );

  const handleSelect = useCallback((className: string): void => {
    selectInstance(null);
    setSelectedGameObjectClass(className);
  }, [selectInstance, setSelectedGameObjectClass]);

  const handleKeyDown = useCallback((event: KeyboardEvent, className: string): void => {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    handleSelect(className);
  }, [handleSelect]);

  const handleDragStart = useCallback((event: DragEvent, className: string): void => {
    event.dataTransfer.setData('application/entropy-prefab', className);
    event.dataTransfer.effectAllowed = 'copy';
  }, []);

  return (
    <Panel className="min-h-0 flex-1">
      <PanelHeader>Game Objects</PanelHeader>

      <PanelContent className="p-1.5">
        {discoveredGameObjects.length === 0 ? (
          <p className="px-1 py-4 text-center text-xs text-muted">
            No game objects found in project.
          </p>
        ) : (
          <DisclosureGroup allowsMultipleExpanded defaultExpandedKeys={defaultExpandedKeys}>
            {Array.from(categorized.entries()).map(([category, gameObjects]) => (
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
                      {category} ({gameObjects.length})
                    </span>
                  </Button>
                </Disclosure.Heading>
                <Disclosure.Content>
                  <Disclosure.Body className="space-y-0.5 py-0.5">
                    {gameObjects.map(go => {
                      const isSelected = go.className === selectedGameObjectClass;

                      return (
                        <div
                          key={go.className}
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
                          onClick={() => handleSelect(go.className)}
                          onKeyDown={(e) => handleKeyDown(e, go.className)}
                          onDragStart={(e) => handleDragStart(e, go.className)}
                        >
                          <Package className="h-3.5 w-3.5 shrink-0 text-muted" />
                          <span className="min-w-0 flex-1 truncate text-xs">{go.className}</span>
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
    </Panel>
  );
}
