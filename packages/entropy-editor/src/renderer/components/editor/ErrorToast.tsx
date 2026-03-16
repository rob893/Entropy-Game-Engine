import { X } from 'lucide-react';
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
    <div
      role="alert"
      className={cn(
        'fixed bottom-4 right-4 z-50 flex items-center gap-2',
        'rounded-md border border-destructive/30 bg-destructive px-4 py-2',
        'text-sm text-destructive-foreground shadow-lg',
        className
      )}
    >
      {message}
      <button
        onClick={onDismiss}
        className="ml-1 rounded-sm p-0.5 opacity-70 transition-opacity hover:opacity-100"
        aria-label="Dismiss error"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
