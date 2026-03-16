import type { LucideIcon } from 'lucide-react';
import type { ReactElement } from 'react';
import { cn } from '../../lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/Tooltip';

interface IToolButtonProps {
  icon: LucideIcon;
  label: string;
  shortcut?: string;
  active?: boolean;
  onClick: () => void;
  className?: string;
}

export function ToolButton({ icon: Icon, label, shortcut, active = false, onClick, className }: IToolButtonProps): ReactElement {
  const tooltipText = shortcut !== undefined ? `${label} (${shortcut})` : label;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          className={cn(
            'inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors',
            'text-muted-foreground hover:bg-white/8 hover:text-foreground',
            'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring',
            active && 'bg-primary text-primary-foreground hover:bg-primary/80',
            className
          )}
          onClick={onClick}
          aria-pressed={active}
          aria-label={label}
        >
          <Icon className="h-4 w-4" />
        </button>
      </TooltipTrigger>
      <TooltipContent>{tooltipText}</TooltipContent>
    </Tooltip>
  );
}
