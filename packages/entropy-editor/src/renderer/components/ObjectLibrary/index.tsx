import { Button, Disclosure } from '@heroui/react';
import { FolderOpen } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { ReactElement } from 'react';
import type { IObjectSprite } from '../../../shared/types';
import { useEditorStore } from '../../stores/editor-store';
import { Panel, PanelContent, PanelHeader } from '../editor/Panel';

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

  return (
    <Panel className="min-h-0 flex-1">
      <PanelHeader
        actions={(
          <Button aria-label="Import objects" onPress={() => void handleImportObjects()} size="sm" variant="ghost">
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
              <p className="text-xs text-muted">
                Import object sprites to populate this library.
              </p>
            )
          : (
              categories.map(category => {
                const isExpanded = !(collapsedCategories[category.name] ?? false);

                return (
                  <Disclosure
                    key={category.name}
                    isExpanded={isExpanded}
                    onExpandedChange={expanded => {
                      setCollapsedCategories(state => ({
                        ...state,
                        [category.name]: !expanded
                      }));
                    }}
                  >
                    <Disclosure.Heading>
                      <Button className="w-full justify-between" size="sm" slot="trigger" variant="ghost">
                        <span className="truncate">{category.name} ({category.sprites.length})</span>
                        <Disclosure.Indicator />
                      </Button>
                    </Disclosure.Heading>
                    <Disclosure.Content>
                      <Disclosure.Body className="px-0 pb-0 pt-1">
                        <div className="grid grid-cols-3 gap-1.5">
                          {category.sprites.map(sprite => {
                            const isSelected = sprite.id === activeObjectSpriteId;

                            return (
                              <Button
                                key={sprite.id}
                                aria-label={sprite.name}
                                aria-pressed={isSelected}
                                fullWidth
                                onPress={() => setActiveObjectSpriteId(sprite.id)}
                                size="sm"
                                variant={isSelected ? 'secondary' : 'ghost'}
                              >
                                <div className="flex w-full flex-col items-center gap-1">
                                  <img
                                    src={sprite.imageDataUrl}
                                    alt={sprite.name}
                                    className="mx-auto max-h-12 max-w-12 rounded-sm object-contain"
                                  />
                                  <div className="w-full truncate text-center text-[10px] text-muted">
                                    {sprite.name}
                                  </div>
                                </div>
                              </Button>
                            );
                          })}
                        </div>
                      </Disclosure.Body>
                    </Disclosure.Content>
                  </Disclosure>
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
