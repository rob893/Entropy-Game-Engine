import { ChevronDown, ChevronRight, FolderOpen } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { ReactElement } from 'react';
import type { IObjectSprite } from '../../../shared/types';
import { cn } from '../../lib/utils';
import { useEditorStore } from '../../stores/editor-store';
import { Panel, PanelContent, PanelHeader } from '../editor/Panel';
import { Button } from '../ui/Button';

const DEFAULT_CATEGORY = 'Imported';

interface IObjectCategory {
  name: string;
  sprites: IObjectSprite[];
}

export function ObjectLibrary(): ReactElement {
  const mapFile = useEditorStore(state => state.mapFile);
  const activeObjectSpriteId = useEditorStore(state => state.activeObjectSpriteId);
  const importObjectsToProject = useEditorStore(state => state.importObjectsToProject);
  const setActiveObjectSpriteId = useEditorStore(state => state.setActiveObjectSpriteId);
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  const sprites = mapFile?.objectSprites;
  const categories = useMemo((): IObjectCategory[] => groupByCategory(sprites ?? []), [sprites]);
  const hasSprites = (sprites?.length ?? 0) > 0;

  const handleImportObjects = async (): Promise<void> => {
    await importObjectsToProject();
  };

  const toggleCategory = (categoryName: string): void => {
    setCollapsedCategories(state => ({
      ...state,
      [categoryName]: !(state[categoryName] ?? false)
    }));
  };

  return (
    <Panel className="min-h-0 flex-1">
      <PanelHeader
        actions={(
          <Button
            aria-label="Import objects"
            onClick={() => void handleImportObjects()}
            size="sm"
            title="Import objects"
            type="button"
            variant="ghost"
          >
            <FolderOpen className="size-3.5" />
            <span>Import</span>
          </Button>
        )}
      >
        Object Library
      </PanelHeader>
      <PanelContent className="space-y-3">
        {!hasSprites
          ? (
              <p className="text-xs text-muted-foreground">
                Import object sprites to populate this library.
              </p>
            )
          : (
              categories.map(category => {
                const isCollapsed = collapsedCategories[category.name] ?? false;
                const ChevronIcon = isCollapsed ? ChevronRight : ChevronDown;

                return (
                  <section key={category.name} className="space-y-1.5">
                    <button
                      type="button"
                      className="mb-1 flex w-full items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                      onClick={() => toggleCategory(category.name)}
                      aria-expanded={!isCollapsed}
                    >
                      <ChevronIcon className="size-3 shrink-0" />
                      <span className="truncate">{category.name}</span>
                      <span className="text-[10px] text-muted-foreground/80">({category.sprites.length})</span>
                    </button>
                    {!isCollapsed && (
                      <div className="grid grid-cols-3 gap-1.5">
                        {category.sprites.map(sprite => {
                          const isSelected = sprite.id === activeObjectSpriteId;

                          return (
                            <button
                              key={sprite.id}
                              type="button"
                              className={cn(
                                'cursor-pointer rounded-md border border-border p-1 hover:border-primary/50',
                                'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring',
                                isSelected && 'border-primary bg-primary/10'
                              )}
                              onClick={() => setActiveObjectSpriteId(sprite.id)}
                              title={sprite.name}
                              aria-pressed={isSelected}
                            >
                              <img
                                src={sprite.imageDataUrl}
                                alt={sprite.name}
                                className="mx-auto max-h-12 max-w-12 rounded-sm object-contain"
                              />
                              <div className="mt-0.5 truncate text-center text-[10px] text-muted-foreground">
                                {sprite.name}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </section>
                );
              })
            )}
      </PanelContent>
    </Panel>
  );
}

function groupByCategory(sprites: IObjectSprite[]): IObjectCategory[] {
  const categories = new Map<string, IObjectSprite[]>();

  for (const sprite of sprites) {
    const categoryName = sprite.category.trim() === '' ? DEFAULT_CATEGORY : sprite.category;
    const categorySprites = categories.get(categoryName) ?? [];
    categorySprites.push(sprite);
    categories.set(categoryName, categorySprites);
  }

  return [...categories.entries()]
    .sort(([leftName], [rightName]) => leftName.localeCompare(rightName))
    .map(([name, categorySprites]) => ({
      name,
      sprites: [...categorySprites].sort((leftSprite, rightSprite) => leftSprite.name.localeCompare(rightSprite.name))
    }));
}
