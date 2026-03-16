import { ToggleButton, ToggleButtonGroup, Tooltip } from '@heroui/react';
import type { LucideIcon } from 'lucide-react';
import type { ReactElement } from 'react';

interface IToolButtonProps {
  id?: string;
  icon: LucideIcon;
  label: string;
  shortcut?: string;
  active?: boolean;
  onClick?: () => void;
  showSeparator?: boolean;
}

export function ToolButton({
  id,
  icon: Icon,
  label,
  shortcut,
  active,
  onClick,
  showSeparator = false
}: IToolButtonProps): ReactElement {
  const tooltipText = shortcut !== undefined ? `${label} (${shortcut})` : label;
  const handleChange = onClick === undefined
    ? undefined
    : (): void => {
        onClick();
      };

  return (
    <Tooltip delay={300}>
      <ToggleButton
        id={id}
        isIconOnly
        aria-label={label}
        variant="ghost"
        size="sm"
        isSelected={onClick === undefined ? undefined : active ?? false}
        onChange={handleChange}
      >
        {showSeparator && <ToggleButtonGroup.Separator />}
        <Icon className="h-4 w-4" />
      </ToggleButton>
      <Tooltip.Content>{tooltipText}</Tooltip.Content>
    </Tooltip>
  );
}
