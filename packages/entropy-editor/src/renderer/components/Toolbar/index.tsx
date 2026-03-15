import type { ReactElement } from 'react';
import { useEditorStore } from '../../stores/editor-store';

export function Toolbar(): ReactElement {
  const activeTool = useEditorStore(state => state.activeTool);
  const setActiveTool = useEditorStore(state => state.setActiveTool);
  const showGrid = useEditorStore(state => state.showGrid);
  const toggleGrid = useEditorStore(state => state.toggleGrid);

  const tools = [
    { id: 'brush' as const, label: 'Brush', shortcut: '1' },
    { id: 'eraser' as const, label: 'Eraser', shortcut: '2' },
    { id: 'fill' as const, label: 'Fill', shortcut: '3' },
    { id: 'eyedropper' as const, label: 'Eyedropper', shortcut: '4' },
    { id: 'select' as const, label: 'Select', shortcut: '5' }
  ];

  return (
    <div className="toolbar-area" role="toolbar" aria-label="Editor tools">
      {tools.map(tool => (
        <button
          key={tool.id}
          className={activeTool === tool.id ? 'active' : ''}
          onClick={() => setActiveTool(tool.id)}
          title={`${tool.label} (${tool.shortcut})`}
          aria-pressed={activeTool === tool.id}
        >
          {tool.label}
        </button>
      ))}

      <div style={{ marginLeft: 'auto' }}>
        <button
          onClick={toggleGrid}
          className={showGrid ? 'active' : ''}
          title="Toggle Grid (G)"
          aria-pressed={showGrid}
        >
          Grid
        </button>
      </div>
    </div>
  );
}
