import type { ReactElement, ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface IPanelProps {
  children: ReactNode;
  className?: string;
}

export function Panel({ children, className }: IPanelProps): ReactElement {
  return (
    <div className={cn('flex flex-col overflow-hidden', className)}>
      {children}
    </div>
  );
}

interface IPanelHeaderProps {
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function PanelHeader({ children, actions, className }: IPanelHeaderProps): ReactElement {
  return (
    <div className={cn(
      'flex items-center justify-between px-2 py-1.5',
      'text-xs font-semibold uppercase tracking-wider text-muted-foreground',
      'border-b border-border',
      className
    )}>
      <span>{children}</span>
      {actions !== undefined && <div className="flex items-center gap-1">{actions}</div>}
    </div>
  );
}

interface IPanelContentProps {
  children: ReactNode;
  className?: string;
}

export function PanelContent({ children, className }: IPanelContentProps): ReactElement {
  return (
    <div className={cn('flex-1 overflow-y-auto p-2', className)}>
      {children}
    </div>
  );
}
