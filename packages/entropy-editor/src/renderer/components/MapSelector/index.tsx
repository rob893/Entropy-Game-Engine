import type { Key } from '@heroui/react';
import { ListBox, Select } from '@heroui/react';
import type { ReactElement } from 'react';
import { useEditorStore } from '../../stores/editor-store';

export function MapSelector(): ReactElement | null {
  const projectPath = useEditorStore(state => state.projectPath);
  const availableMaps = useEditorStore(state => state.availableMaps);
  const filePath = useEditorStore(state => state.filePath);
  const loadMapFromProject = useEditorStore(state => state.loadMapFromProject);

  if (projectPath === null || availableMaps.length === 0) {
    return null;
  }

  const handleChange = (value: Key | null): void => {
    if (typeof value !== 'string' || value === '') {
      return;
    }

    void loadMapFromProject(value);
  };

  return (
    <div className="flex shrink-0 items-center gap-1.5 py-1">
      <span className="text-xs text-muted">Map:</span>
      <Select aria-label="Map" className="w-48" placeholder="Select map" value={filePath} onChange={handleChange}>
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            {availableMaps.map(mapPath => {
              const name = mapPath.split(/[/\\]/).pop()?.replace('.entropy-map.json', '') ?? mapPath;

              return (
                <ListBox.Item key={mapPath} id={mapPath} textValue={name}>
                  {name}
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              );
            })}
          </ListBox>
        </Select.Popover>
      </Select>
    </div>
  );
}
