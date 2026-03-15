import { useState } from 'react';
import type { ReactElement } from 'react';

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

  const handleSubmit = (e: React.SyntheticEvent): void => {
    e.preventDefault();
    onConfirm(name, rows, cols, tileWidth, tileHeight);
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
      aria-label="New Map"
    >
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          padding: '24px',
          minWidth: '340px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>New Map</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label htmlFor="map-name">Name</label>
          <input
            id="map-name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            autoFocus
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label htmlFor="map-cols">Columns</label>
            <input
              id="map-cols"
              type="number"
              min={1}
              max={500}
              value={cols}
              onChange={e => setCols(Number(e.target.value))}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label htmlFor="map-rows">Rows</label>
            <input
              id="map-rows"
              type="number"
              min={1}
              max={500}
              value={rows}
              onChange={e => setRows(Number(e.target.value))}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label htmlFor="tile-width">Tile Width (px)</label>
            <input
              id="tile-width"
              type="number"
              min={1}
              max={256}
              value={tileWidth}
              onChange={e => setTileWidth(Number(e.target.value))}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label htmlFor="tile-height">Tile Height (px)</label>
            <input
              id="tile-height"
              type="number"
              min={1}
              max={256}
              value={tileHeight}
              onChange={e => setTileHeight(Number(e.target.value))}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
          <button type="button" onClick={onCancel}>Cancel</button>
          <button type="submit" className="active">Create</button>
        </div>
      </form>
    </div>
  );
}
