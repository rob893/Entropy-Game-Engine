import type { ReactElement } from 'react';
import { useEditorStore } from '../../stores/editor-store';

export function LayerPanel(): ReactElement {
  const mapFile = useEditorStore(state => state.mapFile);
  const activeLayerIndex = useEditorStore(state => state.activeLayerIndex);
  const setActiveLayer = useEditorStore(state => state.setActiveLayer);
  const setLayerVisibility = useEditorStore(state => state.setLayerVisibility);
  const addLayer = useEditorStore(state => state.addLayer);
  const removeLayer = useEditorStore(state => state.removeLayer);

  const layers = mapFile?.layers ?? [];

  return (
    <div>
      <div className="panel-header">
        Layers
        <button
          onClick={() => addLayer(`Layer ${layers.length + 1}`)}
          style={{ float: 'right', padding: '0 4px', fontSize: '14px' }}
          title="Add layer"
          aria-label="Add layer"
        >
          +
        </button>
      </div>
      <div className="panel-content">
        {layers.map((layer, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px',
              backgroundColor: index === activeLayerIndex ? 'rgba(124, 58, 237, 0.2)' : 'transparent',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
            role="button"
            tabIndex={0}
            onClick={() => setActiveLayer(index)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setActiveLayer(index);
              }
            }}
            aria-selected={index === activeLayerIndex}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLayerVisibility(index, !layer.visible);
              }}
              style={{ padding: '0 4px', opacity: layer.visible ? 1 : 0.4 }}
              title={layer.visible ? 'Hide layer' : 'Show layer'}
              aria-label={`${layer.visible ? 'Hide' : 'Show'} ${layer.name}`}
            >
              👁
            </button>
            <span style={{ flex: 1, fontSize: '12px' }}>{layer.name}</span>
            {layers.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeLayer(index);
                }}
                style={{ padding: '0 4px', fontSize: '10px' }}
                title="Remove layer"
                aria-label={`Remove ${layer.name}`}
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
