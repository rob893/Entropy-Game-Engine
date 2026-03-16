import { CloseButton, Surface } from '@heroui/react';
import { useEffect } from 'react';
import type { ReactElement } from 'react';
import { cn } from '../../lib/utils';

interface IErrorToastProps {
  message: string;
  onDismiss: () => void;
  className?: string;
}

export function ErrorToast({ message, onDismiss, className }: IErrorToastProps): ReactElement {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 8000);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        onDismiss();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onDismiss]);

  return (
    <Surface
      role="alert"
      className={cn(
        'fixed bottom-4 right-4 z-50 flex items-center gap-2',
        'border border-danger/30 bg-danger/10 px-4 py-2',
        'text-sm text-danger shadow-lg',
        className
      )}
      variant="default"
    >
      {message}
      <CloseButton aria-label="Dismiss error" onPress={onDismiss} />
    </Surface>
  );
}
