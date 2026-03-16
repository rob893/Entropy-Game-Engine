import { FilePlus, FolderOpen } from 'lucide-react';
import type { ReactElement } from 'react';
import { Button } from '../ui/Button';

interface IWelcomeScreenProps {
  onNewMap: () => void;
  onOpenMap: () => void;
}

export function WelcomeScreen({ onNewMap, onOpenMap }: IWelcomeScreenProps): ReactElement {
  return (
    <div className="flex h-full items-center justify-center bg-background px-6">
      <div className="flex max-w-xl flex-col items-center gap-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-card text-2xl font-semibold text-primary shadow-lg shadow-black/20">
          E
        </div>

        <div className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-[0.32em] text-primary/80">Entropy Editor</p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Entropy Terrain Editor</h1>
          <p className="max-w-md text-sm leading-6 text-muted-foreground">
            Create a new terrain map or open an existing one to start building your world.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button type="button" variant="primary" size="lg" onClick={onNewMap}>
            <FilePlus className="h-4 w-4" />
            New Map
          </Button>
          <Button type="button" variant="default" size="lg" onClick={onOpenMap}>
            <FolderOpen className="h-4 w-4" />
            Open Map
          </Button>
        </div>
      </div>
    </div>
  );
}
