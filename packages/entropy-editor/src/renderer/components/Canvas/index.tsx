import { useRef, useEffect, useCallback } from 'react';
import type { ReactElement } from 'react';
import { useEditorStore } from '../../stores/editor-store';

export function Canvas(): ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const isPaintingRef = useRef(false);
  const tileImagesRef = useRef<Map<string, HTMLImageElement>>(new Map());

  const mapFile = useEditorStore(state => state.mapFile);
  const activeLayerIndex = useEditorStore(state => state.activeLayerIndex);
  const activeTool = useEditorStore(state => state.activeTool);
  const activeTileId = useEditorStore(state => state.activeTileId);
  const activeTilesetId = useEditorStore(state => state.activeTilesetId);
  const showGrid = useEditorStore(state => state.showGrid);
  const updateLayer = useEditorStore(state => state.updateLayer);
  const setActiveTile = useEditorStore(state => state.setActiveTile);
  const setDirty = useEditorStore(state => state.setDirty);

  const getGridPosition = useCallback((e: React.MouseEvent<HTMLCanvasElement>): { row: number; col: number } | null => {
    if (mapFile === null) {
      return null;
    }

    const canvas = canvasRef.current;

    if (canvas === null) {
      return null;
    }

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const col = Math.floor(x / mapFile.tileWidth);
    const row = Math.floor(y / mapFile.tileHeight);
    const layer = mapFile.layers[activeLayerIndex];

    if (layer === undefined || row < 0 || row >= layer.grid.length || col < 0 || col >= layer.grid[0].length) {
      return null;
    }

    return { row, col };
  }, [mapFile, activeLayerIndex]);

  const applyTool = useCallback((row: number, col: number): void => {
    if (mapFile === null) {
      return;
    }

    const layer = mapFile.layers[activeLayerIndex];

    if (layer === undefined) {
      return;
    }

    let changed = false;
    let layerUpdated = { ...layer, grid: layer.grid.map(r => [...r]) };

    switch (activeTool) {
      case 'brush':
        if (layerUpdated.grid[row][col] !== activeTileId) {
          layerUpdated.grid[row][col] = activeTileId;

          // Bind the active tileset to this layer if not already set
          if (activeTilesetId !== null && layerUpdated.tileSetId !== activeTilesetId) {
            layerUpdated = { ...layerUpdated, tileSetId: activeTilesetId };
          }

          changed = true;
        }
        break;
      case 'eraser':
        if (layerUpdated.grid[row][col] !== 0) {
          layerUpdated.grid[row][col] = 0;
          changed = true;
        }
        break;
      case 'eyedropper': {
        const tileId = layer.grid[row][col];

        if (tileId !== 0) {
          setActiveTile(tileId, layer.tileSetId);
        }

        break;
      }
      case 'fill':
        changed = floodFill(layerUpdated.grid, row, col, activeTileId);

        if (changed && activeTilesetId !== null && layerUpdated.tileSetId !== activeTilesetId) {
          layerUpdated = { ...layerUpdated, tileSetId: activeTilesetId };
        }

        break;
    }

    if (changed) {
      updateLayer(activeLayerIndex, layerUpdated);
      setDirty(true);
    }
  }, [mapFile, activeLayerIndex, activeTool, activeTileId, activeTilesetId, updateLayer, setActiveTile, setDirty]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>): void => {
    if (e.button !== 0) {
      return;
    }

    isPaintingRef.current = true;
    const pos = getGridPosition(e);

    if (pos !== null) {
      applyTool(pos.row, pos.col);
    }
  }, [getGridPosition, applyTool]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>): void => {
    // Draw hover on overlay
    drawOverlay(e);

    if (!isPaintingRef.current) {
      return;
    }

    if (activeTool !== 'brush' && activeTool !== 'eraser') {
      return;
    }

    const pos = getGridPosition(e);

    if (pos !== null) {
      applyTool(pos.row, pos.col);
    }
  }, [getGridPosition, applyTool, activeTool]);

  const handleMouseUp = useCallback((): void => {
    isPaintingRef.current = false;
  }, []);

  const drawOverlay = useCallback((e: React.MouseEvent<HTMLCanvasElement>): void => {
    const overlay = overlayRef.current;

    if (overlay === null || mapFile === null) {
      return;
    }

    const ctx = overlay.getContext('2d');

    if (ctx === null) {
      return;
    }

    ctx.clearRect(0, 0, overlay.width, overlay.height);

    const pos = getGridPosition(e);

    if (pos !== null) {
      ctx.fillStyle = 'rgba(124, 58, 237, 0.3)';
      ctx.fillRect(pos.col * mapFile.tileWidth, pos.row * mapFile.tileHeight, mapFile.tileWidth, mapFile.tileHeight);
    }
  }, [mapFile, getGridPosition]);

  // Load tileset images
  useEffect(() => {
    if (mapFile === null) {
      return;
    }

    for (const tileset of mapFile.tilesets) {
      if (!tileImagesRef.current.has(tileset.id)) {
        const img = new Image();
        img.src = tileset.imageDataUrl;
        img.onload = () => {
          tileImagesRef.current.set(tileset.id, img);
          renderCanvas();
        };
      }
    }
  }, [mapFile?.tilesets]);

  const renderCanvas = useCallback((): void => {
    const canvas = canvasRef.current;

    if (canvas === null || mapFile === null) {
      return;
    }

    const ctx = canvas.getContext('2d');

    if (ctx === null) {
      return;
    }

    const rows = mapFile.layers[0]?.grid.length ?? 0;
    const cols = mapFile.layers[0]?.grid[0]?.length ?? 0;

    canvas.width = cols * mapFile.tileWidth;
    canvas.height = rows * mapFile.tileHeight;

    // Also resize overlay
    const overlay = overlayRef.current;

    if (overlay !== null) {
      overlay.width = canvas.width;
      overlay.height = canvas.height;
    }

    ctx.fillStyle = '#1a1a2a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw checkerboard for empty cells
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if ((row + col) % 2 === 0) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
          ctx.fillRect(col * mapFile.tileWidth, row * mapFile.tileHeight, mapFile.tileWidth, mapFile.tileHeight);
        }
      }
    }

    // Render each visible layer
    for (const layer of mapFile.layers) {
      if (!layer.visible) {
        continue;
      }

      ctx.globalAlpha = layer.opacity;

      // Find the tileset for this layer
      const tileset = mapFile.tilesets.find(ts => ts.id === layer.tileSetId) ?? mapFile.tilesets[0];
      const tilesetImage = tileset !== undefined ? tileImagesRef.current.get(tileset.id) : undefined;

      for (let row = 0; row < layer.grid.length; row++) {
        for (let col = 0; col < layer.grid[row].length; col++) {
          const tileId = layer.grid[row][col];

          if (tileId === 0 || tileset === undefined || tilesetImage === undefined) {
            continue;
          }

          const srcCol = (tileId - 1) % tileset.columns;
          const srcRow = Math.floor((tileId - 1) / tileset.columns);

          ctx.drawImage(
            tilesetImage,
            srcCol * tileset.tileWidth,
            srcRow * tileset.tileHeight,
            tileset.tileWidth,
            tileset.tileHeight,
            col * mapFile.tileWidth,
            row * mapFile.tileHeight,
            mapFile.tileWidth,
            mapFile.tileHeight
          );
        }
      }

      ctx.globalAlpha = 1;
    }

    // Draw grid
    if (showGrid) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 0.5;
      ctx.beginPath();

      for (let col = 0; col <= cols; col++) {
        const x = col * mapFile.tileWidth;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
      }

      for (let row = 0; row <= rows; row++) {
        const y = row * mapFile.tileHeight;
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
      }

      ctx.stroke();
    }
  }, [mapFile, showGrid]);

  // Re-render when map data changes
  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  if (mapFile === null) {
    return <div className="canvas-area" />;
  }

  return (
    <div className="canvas-area" style={{ overflow: 'auto' }}>
      <canvas
        ref={canvasRef}
        style={{ imageRendering: 'pixelated', cursor: 'crosshair' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
      <canvas
        ref={overlayRef}
        style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', imageRendering: 'pixelated' }}
        aria-hidden="true"
      />
    </div>
  );
}

function floodFill(grid: number[][], startRow: number, startCol: number, fillId: number): boolean {
  const targetId = grid[startRow][startCol];

  if (targetId === fillId) {
    return false;
  }

  const rows = grid.length;
  const cols = grid[0].length;
  const stack: Array<[number, number]> = [[startRow, startCol]];
  let changed = false;

  while (stack.length > 0) {
    const current = stack.pop();

    if (current === undefined) {
      break;
    }

    const [r, c] = current;

    if (r < 0 || r >= rows || c < 0 || c >= cols) {
      continue;
    }

    if (grid[r][c] !== targetId) {
      continue;
    }

    grid[r][c] = fillId;
    changed = true;

    stack.push([r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]);
  }

  return changed;
}
