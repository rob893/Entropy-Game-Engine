import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactElement } from 'react';
import type { IEditorObject, IEditorObjectLayer, IEditorTileLayer, IObjectSprite } from '../../../shared/types';
import { cn } from '../../lib/utils';
import type { BrushShape } from '../../stores/editor-store';
import { useEditorStore } from '../../stores/editor-store';

function isInBrushMask(dr: number, dc: number, brushSize: number, shape: BrushShape): boolean {
  if (shape === 'square') {
    return true;
  }

  // Circle: check if the cell center is within the radius
  const radius = brushSize / 2;
  const centerDr = dr + 0.5 - radius;
  const centerDc = dc + 0.5 - radius;

  return (centerDr * centerDr + centerDc * centerDc) <= (radius * radius);
}

export function Canvas(): ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const isPaintingRef = useRef(false);
  const isDraggingObjectRef = useRef(false);
  const tileImagesRef = useRef<Map<string, HTMLImageElement>>(new Map());
  const objectImagesRef = useRef<Map<string, HTMLImageElement>>(new Map());
  const dragStartRef = useRef({ x: 0, y: 0 });
  const dragObjectStartRef = useRef({ x: 0, y: 0 });
  const zoomRef = useRef(1);
  const panRef = useRef({ x: 0, y: 0 });
  const isPanningRef = useRef(false);
  const lastPanPosRef = useRef({ x: 0, y: 0 });
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);

  const mapFile = useEditorStore(state => state.mapFile);
  const activeLayerIndex = useEditorStore(state => state.activeLayerIndex);
  const activeTool = useEditorStore(state => state.activeTool);
  const activeTileId = useEditorStore(state => state.activeTileId);
  const activeTilesetId = useEditorStore(state => state.activeTilesetId);
  const activeObjectSpriteId = useEditorStore(state => state.activeObjectSpriteId);
  const selectedObjectId = useEditorStore(state => state.selectedObjectId);
  const brushSize = useEditorStore(state => state.brushSize);
  const brushShape = useEditorStore(state => state.brushShape);
  const showGrid = useEditorStore(state => state.showGrid);
  const updateLayer = useEditorStore(state => state.updateLayer);
  const setActiveTile = useEditorStore(state => state.setActiveTile);
  const setDirty = useEditorStore(state => state.setDirty);
  const setCanvasElement = useEditorStore(state => state.setCanvasElement);
  const selectObject = useEditorStore(state => state.selectObject);
  const placeObject = useEditorStore(state => state.placeObject);
  const moveObject = useEditorStore(state => state.moveObject);
  const objectSprites = useMemo<IObjectSprite[]>(() => mapFile?.objectSprites ?? [], [mapFile?.objectSprites]);

  // Register canvas element for export operations
  useEffect(() => {
    setCanvasElement(canvasRef.current);

    return () => setCanvasElement(null);
  }, [setCanvasElement]);

  const getCanvasPosition = useCallback((e: React.MouseEvent<HTMLCanvasElement>): { x: number; y: number } | null => {
    const canvas = canvasRef.current;

    if (canvas === null) {
      return null;
    }

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  }, []);

  const getGridPosition = useCallback((e: React.MouseEvent<HTMLCanvasElement>): { row: number; col: number } | null => {
    if (mapFile === null) {
      return null;
    }

    const position = getCanvasPosition(e);

    if (position === null) {
      return null;
    }

    const col = Math.floor(position.x / mapFile.tileWidth);
    const row = Math.floor(position.y / mapFile.tileHeight);
    const layer = mapFile.layers[activeLayerIndex];

    if (layer === undefined || layer.type !== 'tile') {
      return null;
    }

    if (row < 0 || row >= layer.grid.length || col < 0 || col >= layer.grid[0].length) {
      return null;
    }

    return { row, col };
  }, [mapFile, activeLayerIndex, getCanvasPosition]);

  const applyTransform = useCallback((): void => {
    const wrapper = wrapperRef.current;

    if (wrapper === null) {
      return;
    }

    const z = zoomRef.current;
    const p = panRef.current;
    wrapper.style.transform = `scale(${z}) translate(${p.x}px, ${p.y}px)`;
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
      const size = (activeTool === 'brush' || activeTool === 'eraser') ? brushSize : 1;
      const shape = (activeTool === 'brush' || activeTool === 'eraser') ? brushShape : 'square' as const;
      const offset = Math.floor(size / 2);
      const anchorCol = pos.col - offset;
      const anchorRow = pos.row - offset;

      // Canvas colors — can't use CSS vars in canvas 2D API
      ctx.fillStyle = 'rgba(34, 197, 94, 0.3)';
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.6)';
      ctx.lineWidth = 1;

      for (let dr = 0; dr < size; dr++) {
        for (let dc = 0; dc < size; dc++) {
          if (!isInBrushMask(dr, dc, size, shape)) {
            continue;
          }

          const cellCol = anchorCol + dc;
          const cellRow = anchorRow + dr;

          ctx.fillRect(
            cellCol * mapFile.tileWidth,
            cellRow * mapFile.tileHeight,
            mapFile.tileWidth,
            mapFile.tileHeight
          );
          ctx.strokeRect(
            cellCol * mapFile.tileWidth,
            cellRow * mapFile.tileHeight,
            mapFile.tileWidth,
            mapFile.tileHeight
          );
        }
      }
    }
  }, [mapFile, getGridPosition, activeTool, brushSize, brushShape]);

  const renderCanvas = useCallback((): void => {
    const canvas = canvasRef.current;

    if (canvas === null || mapFile === null) {
      return;
    }

    const ctx = canvas.getContext('2d');

    if (ctx === null) {
      return;
    }

    const firstTileLayer = mapFile.layers.find((layer): layer is IEditorTileLayer => layer.type === 'tile');
    const rows = firstTileLayer?.grid.length ?? 0;
    const cols = firstTileLayer?.grid[0]?.length ?? 0;

    canvas.width = cols * mapFile.tileWidth;
    canvas.height = rows * mapFile.tileHeight;

    // Also resize overlay
    const overlay = overlayRef.current;

    if (overlay !== null) {
      overlay.width = canvas.width;
      overlay.height = canvas.height;
    }

    ctx.fillStyle = '#151a1e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw checkerboard for empty cells
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if ((row + col) % 2 === 0) {
          ctx.fillStyle = 'rgba(34, 197, 94, 0.04)';
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

      if (layer.type === 'tile') {
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
      }

      if (layer.type === 'object') {
        const sortedObjects = [...layer.objects].sort((a, b) => a.zIndex - b.zIndex);

        for (const obj of sortedObjects) {
          const sprite = mapFile.objectSprites.find(s => s.id === obj.spriteId);

          if (sprite === undefined) {
            continue;
          }

          const spriteImage = objectImagesRef.current.get(sprite.id);

          if (spriteImage === undefined) {
            continue;
          }

          ctx.save();
          ctx.globalAlpha = layer.opacity;
          ctx.translate(obj.x + (sprite.width * obj.scaleX) / 2, obj.y + (sprite.height * obj.scaleY) / 2);
          ctx.rotate((obj.rotation * Math.PI) / 180);
          ctx.scale(obj.scaleX, obj.scaleY);
          ctx.drawImage(spriteImage, -sprite.width / 2, -sprite.height / 2);
          ctx.restore();
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

    if (selectedObjectId !== null) {
      for (const layer of mapFile.layers) {
        if (layer.type !== 'object') {
          continue;
        }

        const obj = layer.objects.find(object => object.id === selectedObjectId);

        if (obj === undefined) {
          continue;
        }

        const sprite = mapFile.objectSprites.find(objectSprite => objectSprite.id === obj.spriteId);

        if (sprite === undefined) {
          continue;
        }

        ctx.save();
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(obj.x - 1, obj.y - 1, sprite.width * obj.scaleX + 2, sprite.height * obj.scaleY + 2);
        ctx.restore();
        break;
      }
    }
  }, [mapFile, selectedObjectId, showGrid]);

  const applyTool = useCallback((row: number, col: number): void => {
    if (mapFile === null) {
      return;
    }

    const layer = mapFile.layers[activeLayerIndex];

    if (layer === undefined || layer.type !== 'tile') {
      return;
    }

    let changed = false;
    let layerUpdated: IEditorTileLayer = { ...layer, grid: layer.grid.map((rowData: number[]) => [...rowData]) };
    const gridRows = layerUpdated.grid.length;
    const gridCols = layerUpdated.grid[0]?.length ?? 0;

    // Find the active tileset to compute multi-tile offsets
    const tileset = activeTilesetId !== null
      ? mapFile.tilesets.find(ts => ts.id === activeTilesetId)
      : mapFile.tilesets[0];

    switch (activeTool) {
      case 'brush': {
        const baseTileCol = tileset !== undefined ? (activeTileId - 1) % tileset.columns : 0;
        const baseTileRow = tileset !== undefined ? Math.floor((activeTileId - 1) / tileset.columns) : 0;
        const tilesetCols = tileset?.columns ?? 1;
        const tilesetRows = tileset?.rows ?? 1;
        for (let dr = 0; dr < brushSize; dr++) {
          for (let dc = 0; dc < brushSize; dc++) {
            if (!isInBrushMask(dr, dc, brushSize, brushShape)) {
              continue;
            }

            const targetRow = row + dr;
            const targetCol = col + dc;

            if (targetRow < 0 || targetRow >= gridRows || targetCol < 0 || targetCol >= gridCols) {
              continue;
            }

            const srcTileCol = baseTileCol + dc;
            const srcTileRow = baseTileRow + dr;

            if (srcTileCol >= tilesetCols || srcTileRow >= tilesetRows) {
              continue;
            }

            const tileIndex = srcTileRow * tilesetCols + srcTileCol;
            const tileId = tileIndex + 1;

            if (layerUpdated.grid[targetRow][targetCol] !== tileId) {
              layerUpdated.grid[targetRow][targetCol] = tileId;
              changed = true;
            }
          }
        }

        if (changed && activeTilesetId !== null && layerUpdated.tileSetId !== activeTilesetId) {
          layerUpdated = { ...layerUpdated, tileSetId: activeTilesetId };
        }

        break;
      }
      case 'eraser':
        for (let dr = 0; dr < brushSize; dr++) {
          for (let dc = 0; dc < brushSize; dc++) {
            if (!isInBrushMask(dr, dc, brushSize, brushShape)) {
              continue;
            }

            const targetRow = row + dr;
            const targetCol = col + dc;

            if (targetRow < 0 || targetRow >= gridRows || targetCol < 0 || targetCol >= gridCols) {
              continue;
            }

            if (layerUpdated.grid[targetRow][targetCol] !== 0) {
              layerUpdated.grid[targetRow][targetCol] = 0;
              changed = true;
            }
          }
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
  }, [mapFile, activeLayerIndex, activeTool, activeTileId, activeTilesetId, brushSize, brushShape, updateLayer, setActiveTile, setDirty]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>): void => {
    if (e.button !== 0) {
      return;
    }

    const layer = mapFile?.layers[activeLayerIndex];

    if (layer !== undefined && layer.type === 'object') {
      const position = getCanvasPosition(e);

      if (position === null || mapFile === null) {
        return;
      }

      const clickX = position.x;
      const clickY = position.y;

      if (activeTool === 'brush' && activeObjectSpriteId !== null) {
        placeObject(activeObjectSpriteId, clickX, clickY);
        return;
      }

      if (activeTool === 'select') {
        const hitObject = findObjectAtPoint(layer, clickX, clickY, mapFile.objectSprites);

        selectObject(hitObject?.id ?? null);

        if (hitObject !== null) {
          isDraggingObjectRef.current = true;
          dragStartRef.current = { x: clickX, y: clickY };
          dragObjectStartRef.current = { x: hitObject.x, y: hitObject.y };
        }

        return;
      }

      return;
    }

    isPaintingRef.current = true;
    const pos = getGridPosition(e);

    if (pos !== null) {
      const offset = Math.floor(brushSize / 2);
      applyTool(pos.row - offset, pos.col - offset);
    }
  }, [activeLayerIndex, activeObjectSpriteId, activeTool, applyTool, brushSize, getCanvasPosition, getGridPosition, mapFile, placeObject, selectObject]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>): void => {
    if (isPanningRef.current) {
      return;
    }

    if (isDraggingObjectRef.current && selectedObjectId !== null) {
      const position = getCanvasPosition(e);

      if (position === null) {
        return;
      }

      const newX = dragObjectStartRef.current.x + (position.x - dragStartRef.current.x);
      const newY = dragObjectStartRef.current.y + (position.y - dragStartRef.current.y);
      moveObject(selectedObjectId, newX, newY);
      return;
    }

    drawOverlay(e);

    if (!isPaintingRef.current) {
      return;
    }

    if (activeTool !== 'brush' && activeTool !== 'eraser') {
      return;
    }

    const pos = getGridPosition(e);

    if (pos !== null) {
      const offset = Math.floor(brushSize / 2);
      applyTool(pos.row - offset, pos.col - offset);
    }
  }, [activeTool, applyTool, brushSize, drawOverlay, getCanvasPosition, getGridPosition, moveObject, selectedObjectId]);

  const handleMouseUp = useCallback((): void => {
    isPaintingRef.current = false;
    isDraggingObjectRef.current = false;
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>): void => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    zoomRef.current = Math.max(0.25, Math.min(4, zoomRef.current + delta));
    applyTransform();
  }, [applyTransform]);

  const handlePanStart = useCallback((e: React.MouseEvent<HTMLDivElement>): void => {
    if (e.button !== 1) {
      return;
    }

    e.preventDefault();
    isPanningRef.current = true;
    lastPanPosRef.current = { x: e.clientX, y: e.clientY };
    setIsPanning(true);
  }, []);

  const handlePanMove = useCallback((e: React.MouseEvent<HTMLDivElement>): void => {
    if (!isPanningRef.current) {
      return;
    }

    e.preventDefault();
    const dx = e.clientX - lastPanPosRef.current.x;
    const dy = e.clientY - lastPanPosRef.current.y;
    panRef.current = {
      x: panRef.current.x + (dx / zoomRef.current),
      y: panRef.current.y + (dy / zoomRef.current)
    };
    lastPanPosRef.current = { x: e.clientX, y: e.clientY };
    applyTransform();
  }, [applyTransform]);

  const handlePanEnd = useCallback((): void => {
    isPanningRef.current = false;
    setIsPanning(false);
  }, []);

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
  }, [mapFile, renderCanvas]);

  useEffect(() => {
    for (const sprite of objectSprites) {
      if (!objectImagesRef.current.has(sprite.id)) {
        const img = new Image();
        img.src = sprite.imageDataUrl;
        img.onload = () => {
          objectImagesRef.current.set(sprite.id, img);
          renderCanvas();
        };
      }
    }
  }, [objectSprites, renderCanvas]);

  // Re-render when map data changes
  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  useEffect((): void => {
    applyTransform();
  }, [applyTransform, mapFile]);

  if (mapFile === null) {
    return <div className="canvas-area" />;
  }

  return (
    <div
      className={cn(
        'canvas-area overflow-hidden flex items-center justify-center',
        isPanning ? 'cursor-grabbing' : 'cursor-crosshair'
      )}
      onWheel={handleWheel}
      onMouseDown={handlePanStart}
      onMouseMove={handlePanMove}
      onMouseUp={handlePanEnd}
      onMouseLeave={handlePanEnd}
      onAuxClick={(e): void => e.preventDefault()}
    >
      <div
        ref={wrapperRef}
        className="relative shrink-0 origin-center"
        style={{
          transformOrigin: 'center center',
          willChange: 'transform'
        }}
      >
        <canvas
          ref={canvasRef}
          className={cn(isPanning ? 'cursor-grabbing' : 'cursor-crosshair')}
          style={{ imageRendering: 'pixelated' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
        <canvas
          ref={overlayRef}
          className="pointer-events-none absolute inset-0"
          style={{ imageRendering: 'pixelated' }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

function findObjectAtPoint(
  layer: IEditorObjectLayer,
  x: number,
  y: number,
  sprites: IObjectSprite[]
): IEditorObject | null {
  const sortedObjects = [...layer.objects].sort((a, b) => b.zIndex - a.zIndex);

  for (const obj of sortedObjects) {
    const sprite = sprites.find(objectSprite => objectSprite.id === obj.spriteId);

    if (sprite === undefined) {
      continue;
    }

    const width = sprite.width * obj.scaleX;
    const height = sprite.height * obj.scaleY;

    if (x >= obj.x && x <= obj.x + width && y >= obj.y && y <= obj.y + height) {
      return obj;
    }
  }

  return null;
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
