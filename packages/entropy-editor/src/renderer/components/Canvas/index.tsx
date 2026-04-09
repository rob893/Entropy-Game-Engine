import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactElement } from 'react';
import type { IEditorObjectLayer, IEditorPrefabInstance, IEditorTileLayer } from '../../../shared/types';
import { cn } from '../../lib/utils';
import type { BrushShape, EditorMode } from '../../stores/editor-store';
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

function ensurePassabilityArray(layer: IEditorTileLayer): boolean[][] {
  if (layer.passability !== undefined) {
    return layer.passability;
  }

  const rows = layer.grid.length;
  const cols = layer.grid[0]?.length ?? 0;

  return Array.from({ length: rows }, () => new Array<boolean>(cols).fill(true));
}

function ensureWeightsArray(layer: IEditorTileLayer): number[][] {
  if (layer.weights !== undefined) {
    return layer.weights;
  }

  const rows = layer.grid.length;
  const cols = layer.grid[0]?.length ?? 0;

  return Array.from({ length: rows }, () => new Array<number>(cols).fill(1));
}

function floodFillPassability(passability: boolean[][], row: number, col: number, targetValue: boolean): boolean {
  const rows = passability.length;
  const cols = passability[0]?.length ?? 0;
  const currentValue = passability[row]?.[col] ?? true;

  if (currentValue === targetValue) {
    return false;
  }

  const stack: Array<[number, number]> = [[row, col]];
  let changed = false;

  while (stack.length > 0) {
    const [r, c] = stack.pop()!;

    if (r < 0 || r >= rows || c < 0 || c >= cols) {
      continue;
    }

    if ((passability[r]?.[c] ?? true) !== currentValue) {
      continue;
    }

    passability[r][c] = targetValue;
    changed = true;
    stack.push([r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]);
  }

  return changed;
}

function floodFillWeight(weights: number[][], row: number, col: number, targetValue: number): boolean {
  const rows = weights.length;
  const cols = weights[0]?.length ?? 0;
  const currentValue = weights[row]?.[col] ?? 1;

  if (currentValue === targetValue) {
    return false;
  }

  const stack: Array<[number, number]> = [[row, col]];
  let changed = false;

  while (stack.length > 0) {
    const [r, c] = stack.pop()!;

    if (r < 0 || r >= rows || c < 0 || c >= cols) {
      continue;
    }

    if ((weights[r]?.[c] ?? 1) !== currentValue) {
      continue;
    }

    weights[r][c] = targetValue;
    changed = true;
    stack.push([r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]);
  }

  return changed;
}

function getBrushOverlayColors(mode: EditorMode): { fill: string; stroke: string } {
  switch (mode) {
    case 'passability':
      return { fill: 'rgba(239, 68, 68, 0.3)', stroke: 'rgba(239, 68, 68, 0.6)' };
    case 'weight':
      return { fill: 'rgba(59, 130, 246, 0.3)', stroke: 'rgba(59, 130, 246, 0.6)' };
    default:
      return { fill: 'rgba(34, 197, 94, 0.3)', stroke: 'rgba(34, 197, 94, 0.6)' };
  }
}

export function Canvas(): ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const isPaintingRef = useRef(false);
  const isDraggingObjectRef = useRef(false);
  const tileImagesRef = useRef<Map<string, HTMLImageElement>>(new Map());
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
  const selectedInstanceId = useEditorStore(state => state.selectedInstanceId);
  const selectedPrefabId = useEditorStore(state => state.selectedPrefabId);
  const brushSize = useEditorStore(state => state.brushSize);
  const brushShape = useEditorStore(state => state.brushShape);
  const showGrid = useEditorStore(state => state.showGrid);
  const updateLayer = useEditorStore(state => state.updateLayer);
  const setActiveTile = useEditorStore(state => state.setActiveTile);
  const setDirty = useEditorStore(state => state.setDirty);
  const setCanvasElement = useEditorStore(state => state.setCanvasElement);
  const selectInstance = useEditorStore(state => state.selectInstance);
  const placeInstance = useEditorStore(state => state.placeInstance);
  const moveInstance = useEditorStore(state => state.moveInstance);
  const editorMode = useEditorStore(state => state.editorMode);
  const activeWeight = useEditorStore(state => state.activeWeight);
  const showPassability = useEditorStore(state => state.showPassability);
  const showWeights = useEditorStore(state => state.showWeights);
  const setActiveWeight = useEditorStore(state => state.setActiveWeight);
  const pushUndoSnapshot = useEditorStore(state => state.pushUndoSnapshot);

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
      const overlayColors = getBrushOverlayColors(editorMode);
      ctx.fillStyle = overlayColors.fill;
      ctx.strokeStyle = overlayColors.stroke;
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
  }, [mapFile, getGridPosition, activeTool, brushSize, brushShape, editorMode]);

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
        const sortedInstances = [...layer.instances].sort((a, b) => a.zIndex - b.zIndex);

        for (const inst of sortedInstances) {
          // Placeholder rendering: draw a labeled rectangle for each instance
          const instWidth = mapFile.tileWidth * inst.scaleX;
          const instHeight = mapFile.tileHeight * inst.scaleY;

          ctx.save();
          ctx.globalAlpha = layer.opacity;
          ctx.translate(inst.x + instWidth / 2, inst.y + instHeight / 2);
          ctx.rotate((inst.rotation * Math.PI) / 180);
          ctx.fillStyle = 'rgba(100, 149, 237, 0.3)';
          ctx.fillRect(-instWidth / 2, -instHeight / 2, instWidth, instHeight);
          ctx.strokeStyle = 'rgba(100, 149, 237, 0.8)';
          ctx.lineWidth = 1;
          ctx.strokeRect(-instWidth / 2, -instHeight / 2, instWidth, instHeight);

          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.font = '10px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          const label = inst.name.length > 12 ? `${inst.name.slice(0, 10)}…` : inst.name;
          ctx.fillText(label, 0, 0);
          ctx.restore();
        }
      }

      ctx.globalAlpha = 1;
    }

    // Draw grid
    if (showGrid) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 1;
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

    // Draw passability overlay
    if (showPassability) {
      ctx.save();

      for (const layer of mapFile.layers) {
        if (layer.type !== 'tile' || !layer.visible || layer.passability === undefined) {
          continue;
        }

        for (let row = 0; row < layer.passability.length; row++) {
          for (let col = 0; col < (layer.passability[row]?.length ?? 0); col++) {
            if (layer.passability[row][col] === false) {
              ctx.fillStyle = 'rgba(239, 68, 68, 0.35)';
              ctx.fillRect(
                col * mapFile.tileWidth,
                row * mapFile.tileHeight,
                mapFile.tileWidth,
                mapFile.tileHeight
              );

              // Draw X pattern
              ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)';
              ctx.lineWidth = 1;
              const x = col * mapFile.tileWidth;
              const y = row * mapFile.tileHeight;
              ctx.beginPath();
              ctx.moveTo(x + 2, y + 2);
              ctx.lineTo(x + mapFile.tileWidth - 2, y + mapFile.tileHeight - 2);
              ctx.moveTo(x + mapFile.tileWidth - 2, y + 2);
              ctx.lineTo(x + 2, y + mapFile.tileHeight - 2);
              ctx.stroke();
            }
          }
        }
      }

      ctx.restore();
    }

    // Draw weights overlay
    if (showWeights) {
      ctx.save();

      for (const layer of mapFile.layers) {
        if (layer.type !== 'tile' || !layer.visible || layer.weights === undefined) {
          continue;
        }

        ctx.font = `bold ${Math.min(mapFile.tileWidth, mapFile.tileHeight) * 0.4}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        for (let row = 0; row < layer.weights.length; row++) {
          for (let col = 0; col < (layer.weights[row]?.length ?? 0); col++) {
            const weight = layer.weights[row][col];

            if (weight > 1) {
              const x = col * mapFile.tileWidth + mapFile.tileWidth / 2;
              const y = row * mapFile.tileHeight + mapFile.tileHeight / 2;

              ctx.fillStyle = 'rgba(59, 130, 246, 0.35)';
              ctx.fillRect(
                col * mapFile.tileWidth,
                row * mapFile.tileHeight,
                mapFile.tileWidth,
                mapFile.tileHeight
              );

              ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
              ctx.fillText(String(weight), x, y);
            }
          }
        }
      }

      ctx.restore();
    }

    if (selectedInstanceId !== null) {
      for (const layer of mapFile.layers) {
        if (layer.type !== 'object') {
          continue;
        }

        const inst = layer.instances.find(instance => instance.id === selectedInstanceId);

        if (inst === undefined) {
          continue;
        }

        const instWidth = mapFile.tileWidth * inst.scaleX;
        const instHeight = mapFile.tileHeight * inst.scaleY;

        ctx.save();
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(inst.x - 1, inst.y - 1, instWidth + 2, instHeight + 2);
        ctx.restore();
        break;
      }
    }
  }, [mapFile, selectedInstanceId, showGrid, showPassability, showWeights]);

  const applyTool = useCallback((row: number, col: number): void => {
    if (mapFile === null) {
      return;
    }

    const layer = mapFile.layers[activeLayerIndex];

    if (layer === undefined || layer.type !== 'tile') {
      return;
    }

    const gridRows = layer.grid.length;
    const gridCols = layer.grid[0]?.length ?? 0;

    // Passability mode
    if (editorMode === 'passability') {
      const passability = ensurePassabilityArray(layer).map(r => [...r]);
      let changed = false;

      switch (activeTool) {
        case 'brush':
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

              if (passability[targetRow][targetCol] !== false) {
                passability[targetRow][targetCol] = false;
                changed = true;
              }
            }
          }

          break;
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

              if (passability[targetRow][targetCol] !== true) {
                passability[targetRow][targetCol] = true;
                changed = true;
              }
            }
          }

          break;
        case 'fill':
          changed = floodFillPassability(passability, row, col, false);
          break;
        case 'eyedropper': {
          const isPassable = layer.passability?.[row]?.[col] ?? true;

          if (!isPassable) {
            // Switch to eraser to indicate "impassable picked"
          }

          break;
        }
      }

      if (changed) {
        updateLayer(activeLayerIndex, { ...layer, passability });
        setDirty(true);
      }

      return;
    }

    // Weight mode
    if (editorMode === 'weight') {
      const weights = ensureWeightsArray(layer).map(r => [...r]);
      let changed = false;

      switch (activeTool) {
        case 'brush':
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

              if (weights[targetRow][targetCol] !== activeWeight) {
                weights[targetRow][targetCol] = activeWeight;
                changed = true;
              }
            }
          }

          break;
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

              if (weights[targetRow][targetCol] !== 1) {
                weights[targetRow][targetCol] = 1;
                changed = true;
              }
            }
          }

          break;
        case 'fill':
          changed = floodFillWeight(weights, row, col, activeWeight);
          break;
        case 'eyedropper': {
          const cellWeight = layer.weights?.[row]?.[col] ?? 1;
          setActiveWeight(cellWeight);
          break;
        }
      }

      if (changed) {
        updateLayer(activeLayerIndex, { ...layer, weights });
        setDirty(true);
      }

      return;
    }

    // Paint mode (default)
    let changed = false;
    let layerUpdated: IEditorTileLayer = { ...layer, grid: layer.grid.map((rowData: number[]) => [...rowData]) };

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
  }, [mapFile, activeLayerIndex, activeTool, activeTileId, activeTilesetId, brushSize, brushShape, editorMode, activeWeight, updateLayer, setActiveTile, setDirty, setActiveWeight]);

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

      if (activeTool === 'brush' && selectedPrefabId !== null) {
        placeInstance(selectedPrefabId, clickX, clickY);
        return;
      }

      if (activeTool === 'select') {
        const hitInstance = findInstanceAtPoint(layer, clickX, clickY, mapFile.tileWidth, mapFile.tileHeight);

        selectInstance(hitInstance?.id ?? null);

        if (hitInstance !== null) {
          pushUndoSnapshot();
          isDraggingObjectRef.current = true;
          dragStartRef.current = { x: clickX, y: clickY };
          dragObjectStartRef.current = { x: hitInstance.x, y: hitInstance.y };
        }

        return;
      }

      return;
    }

    pushUndoSnapshot();
    isPaintingRef.current = true;
    const pos = getGridPosition(e);

    if (pos !== null) {
      const offset = Math.floor(brushSize / 2);
      applyTool(pos.row - offset, pos.col - offset);
    }
  }, [activeLayerIndex, selectedPrefabId, activeTool, applyTool, brushSize, getCanvasPosition, getGridPosition, mapFile, placeInstance, pushUndoSnapshot, selectInstance]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>): void => {
    if (isPanningRef.current) {
      return;
    }

    if (isDraggingObjectRef.current && selectedInstanceId !== null) {
      const position = getCanvasPosition(e);

      if (position === null) {
        return;
      }

      const newX = dragObjectStartRef.current.x + (position.x - dragStartRef.current.x);
      const newY = dragObjectStartRef.current.y + (position.y - dragStartRef.current.y);
      moveInstance(selectedInstanceId, newX, newY);
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
  }, [activeTool, applyTool, brushSize, drawOverlay, getCanvasPosition, getGridPosition, moveInstance, selectedInstanceId]);

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

function findInstanceAtPoint(
  layer: IEditorObjectLayer,
  x: number,
  y: number,
  tileWidth: number,
  tileHeight: number
): IEditorPrefabInstance | null {
  const sortedInstances = [...layer.instances].sort((a, b) => b.zIndex - a.zIndex);

  for (const inst of sortedInstances) {
    const width = tileWidth * inst.scaleX;
    const height = tileHeight * inst.scaleY;

    if (x >= inst.x && x <= inst.x + width && y >= inst.y && y <= inst.y + height) {
      return inst;
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
