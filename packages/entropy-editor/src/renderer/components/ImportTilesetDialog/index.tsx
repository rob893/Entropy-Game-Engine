import { useEffect, useRef, useState } from 'react';
import type { ReactElement, SyntheticEvent } from 'react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/Dialog';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';

interface IImportTilesetDialogProps {
  imageDataUrl: string;
  fileName: string;
  onConfirm: (tileWidth: number, tileHeight: number) => void;
  onCancel: () => void;
}

interface ISizePreset {
  label: string;
  width: number;
  height: number;
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
      setTileWidth(img.width);
      setTileHeight(img.height);
    };
  }, [imageDataUrl]);

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

      ctx.strokeStyle = 'rgba(124, 58, 237, 0.7)';
      ctx.lineWidth = 1;
      ctx.beginPath();

      const cols = Math.floor(img.width / tileWidth);
      const rows = Math.floor(img.height / tileHeight);

      for (let col = 0; col <= cols; col++) {
        const x = col * tileWidth * scale;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
      }

      for (let row = 0; row <= rows; row++) {
        const y = row * tileHeight * scale;
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
      }

      ctx.stroke();
    };
  }, [imageDataUrl, tileWidth, tileHeight, imageWidth]);

  const cols = tileWidth > 0 ? Math.floor(imageWidth / tileWidth) : 0;
  const rows = tileHeight > 0 ? Math.floor(imageHeight / tileHeight) : 0;
  const sizePresets: ISizePreset[] = [
    { label: 'Whole Image', width: imageWidth, height: imageHeight },
    { label: '16×16', width: 16, height: 16 },
    { label: '32×32', width: 32, height: 32 },
    { label: '64×64', width: 64, height: 64 }
  ];

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (tileWidth > 0 && tileHeight > 0) {
      onConfirm(tileWidth, tileHeight);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-[420px]">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Import Tileset</DialogTitle>
            <p className="text-xs text-muted-foreground">
              {fileName} — {imageWidth}×{imageHeight}px
            </p>
          </DialogHeader>

          <div className="flex justify-center py-1">
            <canvas
              ref={previewRef}
              className="rounded-md border border-border"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="ts-tile-width">Tile Width (px)</Label>
              <Input
                id="ts-tile-width"
                type="number"
                min={1}
                max={imageWidth}
                value={tileWidth}
                onChange={event => setTileWidth(Number(event.target.value))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ts-tile-height">Tile Height (px)</Label>
              <Input
                id="ts-tile-height"
                type="number"
                min={1}
                max={imageHeight}
                value={tileHeight}
                onChange={event => setTileHeight(Number(event.target.value))}
              />
            </div>
          </div>

          <div className={cn('text-xs text-muted-foreground', (cols === 0 || rows === 0) && 'text-destructive')}>
            {cols}×{rows} tiles ({cols * rows} total)
            {cols === 1 && rows === 1 ? ' — entire image as one tile' : ''}
          </div>

          <div className="flex flex-wrap gap-2">
            {sizePresets.map((preset) => {
              const isActive = tileWidth === preset.width && tileHeight === preset.height;

              return (
                <Button
                  key={preset.label}
                  type="button"
                  size="sm"
                  variant={isActive ? 'primary' : 'default'}
                  className={cn(isActive && 'shadow-sm')}
                  onClick={() => {
                    setTileWidth(preset.width);
                    setTileHeight(preset.height);
                  }}
                  disabled={preset.width <= 0 || preset.height <= 0}
                >
                  {preset.label}
                </Button>
              );
            })}
          </div>

          <DialogFooter>
            <Button type="button" variant="default" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Import
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
