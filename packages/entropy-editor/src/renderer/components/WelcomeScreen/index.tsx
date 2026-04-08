import { Button, Spinner } from '@heroui/react';
import { FolderOpen } from 'lucide-react';
import type { ReactElement } from 'react';

interface IWelcomeScreenProps {
  onOpenProject: () => void;
  isInitializing: boolean;
}

export function WelcomeScreen({ onOpenProject, isInitializing }: IWelcomeScreenProps): ReactElement {
  if (isInitializing) {
    return (
      <div className="flex h-full items-center justify-center bg-background px-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <Spinner size="lg" />
          <p className="text-sm text-muted">Reopening last project…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full items-center justify-center bg-background px-6">
      <div className="flex max-w-xl flex-col items-center gap-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-surface text-2xl font-semibold text-accent shadow-lg shadow-black/20">
          E
        </div>

        <div className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-[0.32em] text-accent/80">Entropy Editor</p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Open an Entropy Project</h1>
          <p className="max-w-md text-sm leading-6 text-muted">
            Open or create an Entropy project to begin building maps, importing assets, and editing your world.
          </p>
        </div>

        <Button type="button" variant="primary" size="lg" onPress={onOpenProject}>
          <FolderOpen className="h-4 w-4" />
          Open Project
        </Button>
      </div>
    </div>
  );
}
