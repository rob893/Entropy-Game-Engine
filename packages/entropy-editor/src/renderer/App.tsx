import { useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import type { MenuAction } from '../shared/types';
import { Canvas } from './components/Canvas';
import { ErrorToast } from './components/editor/ErrorToast';
import { ImportTilesetDialog } from './components/ImportTilesetDialog';
import { LayerPanel } from './components/LayerPanel';
import { NewMapDialog } from './components/NewMapDialog';
import { PropertiesPanel } from './components/PropertiesPanel';
import { TilePalette } from './components/TilePalette';
import { Toolbar } from './components/Toolbar';
import { TooltipProvider } from './components/ui/Tooltip';
import { WelcomeScreen } from './components/WelcomeScreen';
import { useEditorStore } from './stores/editor-store';
import './styles/globals.css';

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
        case 'export-png':
          void store.exportPng();
          break;
        case 'export-tiled':
          void store.exportTiledMap();
          break;
        case 'toggle-grid':
          store.toggleGrid();
          break;
        case 'undo':
        case 'redo':
          // TODO: wire undo/redo when EditorHistory is integrated
          break;
      }
    });

    return unsubscribe;
  }, []);

  const handleNewMap = (name: string, rows: number, cols: number, tileWidth: number, tileHeight: number): void => {
    useEditorStore.getState().createNewMap(name, rows, cols, tileWidth, tileHeight);
    setShowNewMapDialog(false);
  };

  const tilesetImportDialog = pendingTilesetImport !== null
    ? (
        <ImportTilesetDialog
          imageDataUrl={pendingTilesetImport.imageDataUrl}
          fileName={pendingTilesetImport.filePath.split(/[/\\]/).pop() ?? 'Untitled'}
          onConfirm={(tileWidth, tileHeight) => useEditorStore.getState().finalizeTilesetImport(tileWidth, tileHeight)}
          onCancel={() => useEditorStore.getState().cancelTilesetImport()}
        />
      )
    : null;

  const errorToast = error !== null
    ? <ErrorToast message={error} onDismiss={() => setError(null)} />
    : null;

  if (mapFile === null && !showNewMapDialog) {
    return (
      <TooltipProvider>
        <div className="h-full">
          <WelcomeScreen
            onNewMap={() => setShowNewMapDialog(true)}
            onOpenMap={() => void useEditorStore.getState().openFile()}
          />
          {tilesetImportDialog}
          {errorToast}
        </div>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
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

        {tilesetImportDialog}
        {errorToast}
      </div>
    </TooltipProvider>
  );
}
