import type { ReactElement } from 'react';

interface IWelcomeScreenProps {
  onNewMap: () => void;
  onOpenMap: () => void;
}

export function WelcomeScreen({ onNewMap, onOpenMap }: IWelcomeScreenProps): ReactElement {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        gap: '24px',
        color: 'var(--text-secondary)'
      }}
    >
      <h1 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
        Entropy Terrain Editor
      </h1>
      <p style={{ fontSize: '14px', maxWidth: '360px', textAlign: 'center', lineHeight: 1.5 }}>
        Create a new terrain map or open an existing one to get started.
      </p>
      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={onNewMap}
          className="active"
          style={{ padding: '8px 20px', fontSize: '14px' }}
        >
          New Map
        </button>
        <button
          onClick={onOpenMap}
          style={{ padding: '8px 20px', fontSize: '14px' }}
        >
          Open Map
        </button>
      </div>
    </div>
  );
}
