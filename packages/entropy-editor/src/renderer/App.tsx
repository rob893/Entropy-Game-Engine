import { useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import type { MenuAction } from '../shared/types';
import { Canvas } from './components/Canvas';
import { ErrorToast } from './components/editor/ErrorToast';
import { LayerPanel } from './components/LayerPanel';
import { NewMapDialog } from './components/NewMapDialog';
import { ObjectLibrary } from './components/ObjectLibrary';
import { PropertiesPanel } from './components/PropertiesPanel';
import { TilePalette } from './components/TilePalette';
import { Toolbar } from './components/Toolbar';
import { WelcomeScreen } from './components/WelcomeScreen';
import { useEditorStore } from './stores/editor-store';
import './styles/globals.css';

export function App(): ReactElement {
  const projectPath = useEditorStore(state => state.projectPath);
  const mapFile = useEditorStore(state => state.mapFile);
  const createMapInProject = useEditorStore(state => state.createMapInProject);
  const error = useEditorStore(state => state.error);
  const setError = useEditorStore(state => state.setError);
  const isInitializing = useEditorStore(state => state.isInitializing);
  const [showNewMapDialog, setShowNewMapDialog] = useState(false);

  useEffect(() => {
    void useEditorStore.getState().initializeSettings();
  }, []);

  useEffect(() => {
    const unsubscribe = window.electronAPI.onMenuAction((action: MenuAction) => {
      const store = useEditorStore.getState();

      switch (action) {
        case 'file-new':
          if (store.projectPath === null) {
            store.setError('Open or create an Entropy project before creating a map.');
            break;
          }
          setShowNewMapDialog(true);
          break;
        case 'file-save':
          void store.saveFile();
          break;
        case 'open-project':
          void store.openProject();
          break;
        case 'tileset-import':
          void store.importTilesetToProject();
          break;
        case 'objects-import':
          void store.importObjectsToProject();
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
          store.undo();
          break;
        case 'redo':
          store.redo();
          break;
      }
    });

    return unsubscribe;
  }, []);

  const handleNewMap = (name: string, rows: number, cols: number, tileWidth: number, tileHeight: number): void => {
    if (projectPath === null) {
      return;
    }

    void createMapInProject(name, rows, cols, tileWidth, tileHeight);
    setShowNewMapDialog(false);
  };

  const errorToast = error !== null
    ? <ErrorToast message={error} onDismiss={() => setError(null)} />
    : null;

  if (projectPath === null) {
    return (
      <div className="h-full">
        <WelcomeScreen onOpenProject={() => void useEditorStore.getState().openProject()} isInitializing={isInitializing} />
        {errorToast}
      </div>
    );
  }

  const projectContent = mapFile === null
    ? (
        <div className="flex min-h-0 flex-1 items-center justify-center bg-surface px-6 text-center">
          <p className="text-sm text-muted">Select a map or create a new one.</p>
        </div>
      )
    : (
        <>
          <div className="left-panel">
            <TilePalette />
            <ObjectLibrary />
            <LayerPanel />
          </div>

          <Canvas />

          <div className="right-panel">
            <PropertiesPanel />
          </div>
        </>
      );

  return (
    <div className={mapFile === null ? 'flex h-full min-h-0 flex-col bg-border p-1' : 'editor-layout'}>
      <Toolbar />
      {projectContent}

      {showNewMapDialog && (
        <NewMapDialog onConfirm={handleNewMap} onCancel={() => setShowNewMapDialog(false)} />
      )}

      {errorToast}
    </div>
  );
}
