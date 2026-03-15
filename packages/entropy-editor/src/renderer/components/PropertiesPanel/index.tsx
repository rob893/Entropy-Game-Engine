import type { ReactElement } from 'react';
import { useEditorStore } from '../../stores/editor-store';

export function PropertiesPanel(): ReactElement {
  const mapFile = useEditorStore(state => state.mapFile);

  if (mapFile === null) {
    return (
      <div>
        <div className="panel-header">Properties</div>
        <div className="panel-content">
          <p style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>No map loaded.</p>
        </div>
      </div>
    );
  }

  const rows = mapFile.layers[0]?.grid.length ?? 0;
  const cols = mapFile.layers[0]?.grid[0]?.length ?? 0;

  return (
    <div>
      <div className="panel-header">Properties</div>
      <div className="panel-content">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div>
            <label htmlFor="map-name">Map Name</label>
            <div>{mapFile.name}</div>
          </div>
          <div>
            <label>Dimensions</label>
            <div>{cols} × {rows} tiles</div>
          </div>
          <div>
            <label>Tile Size</label>
            <div>{mapFile.tileWidth} × {mapFile.tileHeight} px</div>
          </div>
          <div>
            <label>Layers</label>
            <div>{mapFile.layers.length}</div>
          </div>
          <div>
            <label>Tilesets</label>
            <div>{mapFile.tilesets.length}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
