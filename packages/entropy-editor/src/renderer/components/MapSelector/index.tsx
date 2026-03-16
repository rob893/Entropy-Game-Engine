import type { ChangeEvent, ReactElement } from 'react';
import { cn } from '../../lib/utils';
import { useEditorStore } from '../../stores/editor-store';

export function MapSelector(): ReactElement | null {
  const projectPath = useEditorStore(state => state.projectPath);
  const availableMaps = useEditorStore(state => state.availableMaps);
  const filePath = useEditorStore(state => state.filePath);
  const loadMapFromProject = useEditorStore(state => state.loadMapFromProject);

  if (projectPath === null || availableMaps.length === 0) {
    return null;
  }

  const handleChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    void loadMapFromProject(event.target.value);
  };

  return (
    <div className="flex shrink-0 items-center gap-1.5 py-1">
      <span className="text-xs text-muted-foreground">Map:</span>
      <select
        className={cn(
          'h-8 rounded-md border border-border bg-white/6 px-2 text-sm text-foreground',
          'focus:outline-2 focus:outline-offset-1 focus:outline-ring'
        )}
        value={filePath ?? ''}
        onChange={handleChange}
      >
        {availableMaps.map(mapPath => {
          const name = mapPath.split(/[/\\]/).pop()?.replace('.entropy-map', '') ?? mapPath;

          return (
            <option key={mapPath} value={mapPath}>
              {name}
            </option>
          );
        })}
      </select>
    </div>
  );
}
