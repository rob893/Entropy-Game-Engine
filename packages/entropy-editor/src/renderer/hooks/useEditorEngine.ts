import { useRef, useEffect, useCallback } from 'react';

export interface IEditorEngineRef {
  canvas: HTMLCanvasElement | null;
}

export function useEditorEngine(): IEditorEngineRef {
  const ref = useRef<IEditorEngineRef>({ canvas: null });

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    switch (event.key) {
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case 'g':
      case 'G':
        // Handled by Zustand store subscribers
        break;
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return ref.current;
}
