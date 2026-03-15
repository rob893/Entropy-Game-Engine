import { useState, useEffect, useRef } from 'react';
import type { ReactElement } from 'react';
import type { IEditorTileset } from '../../../shared/types';
import { useEditorStore } from '../../stores/editor-store';

export function TilePalette(): ReactElement {
  const mapFile = useEditorStore(state => state.mapFile);
  const activeTileId = useEditorStore(state => state.activeTileId);
  const activeTilesetId = useEditorStore(state => state.activeTilesetId);
  const setActiveTile = useEditorStore(state => state.setActiveTile);
  const promptImportTileset = useEditorStore(state => state.promptImportTileset);

  const tilesets = mapFile?.tilesets ?? [];

  return (
    <div>
      <div className="panel-header">
        Tile Palette
        <button
          onClick={() => void promptImportTileset()}
          style={{ float: 'right', padding: '0 6px', fontSize: '11px' }}
          title="Import tileset"
          aria-label="Import tileset"
        >
          + Import
        </button>
      </div>
      <div className="panel-content">
        {tilesets.length === 0 && (
          <p style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
            Import a tileset to get started.
          </p>
        )}
        {tilesets.map(tileset => (
          <TilesetGrid
            key={tileset.id}
            tileset={tileset}
            activeTileId={activeTilesetId === tileset.id ? activeTileId : -1}
            onSelectTile={(tileId) => setActiveTile(tileId, tileset.id)}
          />
        ))}
      </div>
    </div>
  );
}

interface ITilesetGridProps {
  tileset: IEditorTileset;
  activeTileId: number;
  onSelectTile: (id: number) => void;
}

function TilesetGrid({ tileset, activeTileId, onSelectTile }: ITilesetGridProps): ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new Image();
    img.src = tileset.imageDataUrl;
    img.onload = () => setImage(img);
  }, [tileset.imageDataUrl]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas === null || image === null) {
      return;
    }

    const context = canvas.getContext('2d');

    if (context === null) {
      return;
    }

    canvas.width = tileset.columns * tileset.tileWidth;
    canvas.height = tileset.rows * tileset.tileHeight;

    context.drawImage(image, 0, 0);

    // Highlight active tile
    if (activeTileId > 0 && activeTileId <= tileset.tileCount) {
      const col = (activeTileId - 1) % tileset.columns;
      const row = Math.floor((activeTileId - 1) / tileset.columns);
      context.strokeStyle = '#7c3aed';
      context.lineWidth = 2;
      context.strokeRect(
        col * tileset.tileWidth,
        row * tileset.tileHeight,
        tileset.tileWidth,
        tileset.tileHeight
      );
    }
  }, [image, tileset, activeTileId]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>): void => {
    const canvas = canvasRef.current;

    if (canvas === null) {
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const col = Math.floor(x / tileset.tileWidth);
    const row = Math.floor(y / tileset.tileHeight);
    const tileId = row * tileset.columns + col + 1;

    if (tileId >= 1 && tileId <= tileset.tileCount) {
      onSelectTile(tileId);
    }
  };

  return (
    <div style={{ marginBottom: '8px' }}>
      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
        {tileset.name} ({tileset.columns}×{tileset.rows})
      </div>
      <canvas
        ref={canvasRef}
        onClick={handleClick}
        style={{ width: '100%', imageRendering: 'pixelated', cursor: 'pointer', borderRadius: '4px' }}
        aria-label={`Tileset: ${tileset.name}. Click to select a tile.`}
        role="grid"
      />
    </div>
  );
}
