import { useEffect, useRef, useState } from 'react';
import type { ReactElement } from 'react';

interface IImportTilesetDialogProps {
  imageDataUrl: string;
  fileName: string;
  onConfirm: (tileWidth: number, tileHeight: number) => void;
  onCancel: () => void;
}

export function ImportTilesetDialog({ imageDataUrl, fileName, onConfirm, onCancel }: IImportTilesetDialogProps): ReactElement {
  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);
  const [tileWidth, setTileWidth] = useState(0);
  const [tileHeight, setTileHeight] = useState(0);
  const previewRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const img = new Image();
    img.src = imageDataUrl;
    img.onload = () => {
      setImageWidth(img.width);
      setImageHeight(img.height);
      // Default: entire image is one tile
      setTileWidth(img.width);
      setTileHeight(img.height);
    };
  }, [imageDataUrl]);

  // Draw preview with grid overlay
  useEffect(() => {
    const canvas = previewRef.current;

    if (canvas === null || tileWidth <= 0 || tileHeight <= 0 || imageWidth === 0) {
      return;
    }

    const ctx = canvas.getContext('2d');

    if (ctx === null) {
      return;
    }

    const img = new Image();
    img.src = imageDataUrl;
    img.onload = () => {
      const scale = Math.min(220 / img.width, 220 / img.height, 1);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Draw tile grid
      ctx.strokeStyle = 'rgba(124, 58, 237, 0.7)';
      ctx.lineWidth = 1;
      ctx.beginPath();

      const cols = Math.floor(img.width / tileWidth);
      const rows = Math.floor(img.height / tileHeight);

      for (let c = 0; c <= cols; c++) {
        const x = c * tileWidth * scale;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
      }

      for (let r = 0; r <= rows; r++) {
        const y = r * tileHeight * scale;
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
      }

      ctx.stroke();
    };
  }, [imageDataUrl, tileWidth, tileHeight, imageWidth]);

  const cols = tileWidth > 0 ? Math.floor(imageWidth / tileWidth) : 0;
  const rows = tileHeight > 0 ? Math.floor(imageHeight / tileHeight) : 0;

  const handleSubmit = (e: React.SyntheticEvent): void => {
    e.preventDefault();

    if (tileWidth > 0 && tileHeight > 0) {
      onConfirm(tileWidth, tileHeight);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Import Tileset"
    >
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          padding: '24px',
          minWidth: '320px',
          maxWidth: '400px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Import Tileset</h2>
        <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>
          {fileName} — {imageWidth}×{imageHeight}px
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0' }}>
          <canvas
            ref={previewRef}
            style={{ imageRendering: 'pixelated', borderRadius: '4px', border: '1px solid var(--border-color)' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label htmlFor="ts-tile-width">Tile Width (px)</label>
            <input
              id="ts-tile-width"
              type="number"
              min={1}
              max={imageWidth}
              value={tileWidth}
              onChange={e => setTileWidth(Number(e.target.value))}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label htmlFor="ts-tile-height">Tile Height (px)</label>
            <input
              id="ts-tile-height"
              type="number"
              min={1}
              max={imageHeight}
              value={tileHeight}
              onChange={e => setTileHeight(Number(e.target.value))}
            />
          </div>
        </div>

        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
          {cols}×{rows} tiles ({cols * rows} total)
          {cols === 1 && rows === 1 && ' — entire image as one tile'}
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={() => { setTileWidth(imageWidth); setTileHeight(imageHeight); }}
            style={{ fontSize: '11px' }}
          >
            Whole Image
          </button>
          <button
            type="button"
            onClick={() => { setTileWidth(16); setTileHeight(16); }}
            style={{ fontSize: '11px' }}
          >
            16×16
          </button>
          <button
            type="button"
            onClick={() => { setTileWidth(32); setTileHeight(32); }}
            style={{ fontSize: '11px' }}
          >
            32×32
          </button>
          <button
            type="button"
            onClick={() => { setTileWidth(64); setTileHeight(64); }}
            style={{ fontSize: '11px' }}
          >
            64×64
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '4px' }}>
          <button type="button" onClick={onCancel}>Cancel</button>
          <button type="submit" className="active">Import</button>
        </div>
      </form>
    </div>
  );
}
