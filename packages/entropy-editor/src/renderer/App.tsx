import { useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import type { MenuAction } from '../shared/types';
import { Canvas } from './components/Canvas';
import { ImportTilesetDialog } from './components/ImportTilesetDialog';
import { LayerPanel } from './components/LayerPanel';
import { NewMapDialog } from './components/NewMapDialog';
import { PropertiesPanel } from './components/PropertiesPanel';
import { TilePalette } from './components/TilePalette';
import { Toolbar } from './components/Toolbar';
import { WelcomeScreen } from './components/WelcomeScreen';
import { useEditorStore } from './stores/editor-store';
import './styles/editor.css';

export function App(): ReactElement {
  const mapFile = useEditorStore(state => state.mapFile);
  const pendingTilesetImport = useEditorStore(state => state.pendingTilesetImport);
  const error = useEditorStore(state => state.error);
  const setError = useEditorStore(state => state.setError);
  const [showNewMapDialog, setShowNewMapDialog] = useState(false);

  useEffect(() => {
    const unsubscribe = window.electronAPI.onMenuAction((action: MenuAction) => {
      const store = useEditorStore.getState();

      switch (action) {
        case 'file-new':
          setShowNewMapDialog(true);
          break;
        case 'file-open':
          void store.openFile();
          break;
        case 'file-save':
          void store.saveFile();
          break;
        case 'file-save-as':
          void store.saveFileAs();
          break;
        case 'tileset-import':
          void store.promptImportTileset();
          break;
        case 'toggle-grid':
          store.toggleGrid();
          break;
      }
    });

    return unsubscribe;
  }, []);

  const handleNewMap = (name: string, rows: number, cols: number, tileWidth: number, tileHeight: number): void => {
    useEditorStore.getState().createNewMap(name, rows, cols, tileWidth, tileHeight);
    setShowNewMapDialog(false);
  };

  if (mapFile === null && !showNewMapDialog) {
    return (
      <div style={{ height: '100%' }}>
        <WelcomeScreen
          onNewMap={() => setShowNewMapDialog(true)}
          onOpenMap={() => void useEditorStore.getState().openFile()}
        />
        {pendingTilesetImport !== null && (
          <ImportTilesetDialog
            imageDataUrl={pendingTilesetImport.imageDataUrl}
            fileName={pendingTilesetImport.filePath.split(/[/\\]/).pop() ?? 'Untitled'}
            onConfirm={(tileWidth, tileHeight) => useEditorStore.getState().finalizeTilesetImport(tileWidth, tileHeight)}
            onCancel={() => useEditorStore.getState().cancelTilesetImport()}
          />
        )}
      </div>
    );
  }

  return (
    <div className="editor-layout">
      <Toolbar />

      <div className="left-panel">
        <TilePalette />
        <LayerPanel />
      </div>

      <Canvas />

      <div className="right-panel">
        <PropertiesPanel />
      </div>

      {showNewMapDialog && (
        <NewMapDialog onConfirm={handleNewMap} onCancel={() => setShowNewMapDialog(false)} />
      )}

      {pendingTilesetImport !== null && (
        <ImportTilesetDialog
          imageDataUrl={pendingTilesetImport.imageDataUrl}
          fileName={pendingTilesetImport.filePath.split(/[/\\]/).pop() ?? 'Untitled'}
          onConfirm={(tileWidth, tileHeight) => useEditorStore.getState().finalizeTilesetImport(tileWidth, tileHeight)}
          onCancel={() => useEditorStore.getState().cancelTilesetImport()}
        />
      )}

      {error !== null && (
        <div
          role="alert"
          style={{
            position: 'fixed',
            bottom: '16px',
            right: '16px',
            background: 'var(--danger)',
            color: '#fff',
            padding: '8px 16px',
            borderRadius: '6px',
            fontSize: '13px',
            zIndex: 1000,
            display: 'flex',
            gap: '8px',
            alignItems: 'center'
          }}
        >
          {error}
          <button
            onClick={() => setError(null)}
            style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}
            aria-label="Dismiss error"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
