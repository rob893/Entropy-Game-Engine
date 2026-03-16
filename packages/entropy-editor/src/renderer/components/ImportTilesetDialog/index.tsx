import { Button, Form, Label, Modal, NumberField } from '@heroui/react';
import { useEffect, useRef, useState } from 'react';
import type { ReactElement, SyntheticEvent } from 'react';
import { cn } from '../../lib/utils';

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

      ctx.strokeStyle = 'rgba(34, 197, 94, 0.7)';
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

  const handleOpenChange = (isOpen: boolean): void => {
    if (!isOpen) {
      onCancel();
    }
  };

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (tileWidth > 0 && tileHeight > 0) {
      onConfirm(tileWidth, tileHeight);
    }
  };

  return (
    <Modal isOpen={true} onOpenChange={handleOpenChange}>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog className="max-w-[420px]">
            <Form onSubmit={handleSubmit} className="space-y-4">
              <Modal.Header>
                <div>
                  <Modal.Heading>Import Tileset</Modal.Heading>
                  <p className="text-xs text-muted">
                    {fileName} — {imageWidth}×{imageHeight}px
                  </p>
                </div>
              </Modal.Header>

              <Modal.Body className="space-y-4">
                <div className="flex justify-center py-1">
                  <canvas
                    ref={previewRef}
                    className="rounded-md border border-border"
                    style={{ imageRendering: 'pixelated' }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <NumberField
                    maxValue={imageWidth > 0 ? imageWidth : undefined}
                    minValue={imageWidth > 0 ? 1 : 0}
                    name="tileWidth"
                    value={tileWidth}
                    onChange={setTileWidth}
                  >
                    <Label>Tile Width (px)</Label>
                    <NumberField.Group>
                      <NumberField.Input />
                    </NumberField.Group>
                  </NumberField>
                  <NumberField
                    maxValue={imageHeight > 0 ? imageHeight : undefined}
                    minValue={imageHeight > 0 ? 1 : 0}
                    name="tileHeight"
                    value={tileHeight}
                    onChange={setTileHeight}
                  >
                    <Label>Tile Height (px)</Label>
                    <NumberField.Group>
                      <NumberField.Input />
                    </NumberField.Group>
                  </NumberField>
                </div>

                <div className={cn('text-xs text-muted', (cols === 0 || rows === 0) && 'text-danger')}>
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
                        variant={isActive ? 'primary' : 'secondary'}
                        className={cn(isActive && 'shadow-sm')}
                        onPress={() => {
                          setTileWidth(preset.width);
                          setTileHeight(preset.height);
                        }}
                        isDisabled={preset.width <= 0 || preset.height <= 0}
                      >
                        {preset.label}
                      </Button>
                    );
                  })}
                </div>
              </Modal.Body>

              <Modal.Footer>
                <Button type="button" variant="secondary" onPress={onCancel}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Import
                </Button>
              </Modal.Footer>
            </Form>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
