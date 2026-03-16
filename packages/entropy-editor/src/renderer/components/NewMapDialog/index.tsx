import { useState } from 'react';
import type { ReactElement, SyntheticEvent } from 'react';
import { Button } from '../ui/Button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/Dialog';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';

interface INewMapDialogProps {
  onConfirm: (name: string, rows: number, cols: number, tileWidth: number, tileHeight: number) => void;
  onCancel: () => void;
}

export function NewMapDialog({ onConfirm, onCancel }: INewMapDialogProps): ReactElement {
  const [name, setName] = useState('Untitled');
  const [cols, setCols] = useState(30);
  const [rows, setRows] = useState(20);
  const [tileWidth, setTileWidth] = useState(32);
  const [tileHeight, setTileHeight] = useState(32);

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>): void => {
    event.preventDefault();
    onConfirm(name, rows, cols, tileWidth, tileHeight);
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-[420px]">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>New Map</DialogTitle>
          </DialogHeader>

          <div className="space-y-1.5">
            <Label htmlFor="map-name">Name</Label>
            <Input
              id="map-name"
              type="text"
              value={name}
              onChange={event => setName(event.target.value)}
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="map-cols">Columns</Label>
              <Input
                id="map-cols"
                type="number"
                min={1}
                max={500}
                value={cols}
                onChange={event => setCols(Number(event.target.value))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="map-rows">Rows</Label>
              <Input
                id="map-rows"
                type="number"
                min={1}
                max={500}
                value={rows}
                onChange={event => setRows(Number(event.target.value))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="tile-width">Tile Width (px)</Label>
              <Input
                id="tile-width"
                type="number"
                min={1}
                max={256}
                value={tileWidth}
                onChange={event => setTileWidth(Number(event.target.value))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tile-height">Tile Height (px)</Label>
              <Input
                id="tile-height"
                type="number"
                min={1}
                max={256}
                value={tileHeight}
                onChange={event => setTileHeight(Number(event.target.value))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="default" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
