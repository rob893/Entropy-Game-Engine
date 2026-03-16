import { ImagePlus } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { MouseEvent, ReactElement } from 'react';
import type { IEditorTileset } from '../../../shared/types';
import { cn } from '../../lib/utils';
import { useEditorStore } from '../../stores/editor-store';
import { Panel, PanelContent, PanelHeader } from '../editor/Panel';
import { Button } from '../ui/Button';

export function TilePalette(): ReactElement {
  const mapFile = useEditorStore(state => state.mapFile);
  const activeTileId = useEditorStore(state => state.activeTileId);
  const activeTilesetId = useEditorStore(state => state.activeTilesetId);
  const brushSize = useEditorStore(state => state.brushSize);
  const setActiveTile = useEditorStore(state => state.setActiveTile);
  const importTilesetToProject = useEditorStore(state => state.importTilesetToProject);

  const tilesets = mapFile?.tilesets ?? [];

  return (
    <Panel className="min-h-0 flex-1">
      <PanelHeader
        actions={(
          <Button
            aria-label="Import tileset"
            onClick={() => void importTilesetToProject()}
            size="sm"
            title="Import tileset"
            type="button"
            variant="ghost"
          >
            <ImagePlus className="size-3.5" />
            <span>Import</span>
          </Button>
        )}
      >
        Tile Palette
      </PanelHeader>
      <PanelContent className="space-y-3">
        {tilesets.length === 0 && (
          <p className="text-xs text-muted-foreground">
            Import a tileset to get started.
          </p>
        )}
        {tilesets.map(tileset => (
          <TilesetGrid
            key={tileset.id}
            tileset={tileset}
            activeTileId={activeTilesetId === tileset.id ? activeTileId : -1}
            brushSize={activeTilesetId === tileset.id ? brushSize : 1}
            onSelectTile={(tileId) => setActiveTile(tileId, tileset.id)}
          />
        ))}
      </PanelContent>
    </Panel>
  );
}

interface ITilesetGridProps {
  tileset: IEditorTileset;
  activeTileId: number;
  brushSize: number;
  onSelectTile: (id: number) => void;
}

function TilesetGrid({ tileset, activeTileId, brushSize, onSelectTile }: ITilesetGridProps): ReactElement {
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

    // Highlight active tile region (brushSize × brushSize)
    if (activeTileId > 0 && activeTileId <= tileset.tileCount) {
      const startCol = (activeTileId - 1) % tileset.columns;
      const startRow = Math.floor((activeTileId - 1) / tileset.columns);
      const highlightCols = Math.min(brushSize, tileset.columns - startCol);
      const highlightRows = Math.min(brushSize, tileset.rows - startRow);

      context.strokeStyle = '#7c3aed';
      context.lineWidth = 2;
      context.strokeRect(
        startCol * tileset.tileWidth,
        startRow * tileset.tileHeight,
        tileset.tileWidth * highlightCols,
        tileset.tileHeight * highlightRows
      );

      // Fill with semi-transparent overlay
      context.fillStyle = 'rgba(124, 58, 237, 0.15)';
      context.fillRect(
        startCol * tileset.tileWidth,
        startRow * tileset.tileHeight,
        tileset.tileWidth * highlightCols,
        tileset.tileHeight * highlightRows
      );
    }
  }, [image, tileset, activeTileId, brushSize]);

  const handleClick = (event: MouseEvent<HTMLCanvasElement>): void => {
    const canvas = canvasRef.current;

    if (canvas === null) {
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    const clickedCol = Math.floor(x / tileset.tileWidth);
    const clickedRow = Math.floor(y / tileset.tileHeight);

    // Offset so the clicked cell is the center of the brush region
    const offset = Math.floor(brushSize / 2);
    const startCol = Math.max(0, Math.min(clickedCol - offset, tileset.columns - brushSize));
    const startRow = Math.max(0, Math.min(clickedRow - offset, tileset.rows - brushSize));
    const tileId = startRow * tileset.columns + startCol + 1;

    if (tileId >= 1 && tileId <= tileset.tileCount) {
      onSelectTile(tileId);
    }
  };

  return (
    <div className="space-y-1.5">
      <div className={cn(
        'text-[11px] text-muted-foreground',
        activeTileId > 0 && 'text-primary'
      )}>
        {tileset.name} ({tileset.columns}×{tileset.rows})
      </div>
      <canvas
        ref={canvasRef}
        aria-label={`Tileset: ${tileset.name}. Click to select a tile.`}
        className={cn(
          'block w-full cursor-pointer rounded-md border border-border/70 bg-black/10',
          'transition-colors hover:border-primary/50 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring',
          activeTileId > 0 && 'border-primary/70 shadow-[0_0_0_1px_rgba(124,58,237,0.25)]'
        )}
        onClick={handleClick}
        role="grid"
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  );
}
