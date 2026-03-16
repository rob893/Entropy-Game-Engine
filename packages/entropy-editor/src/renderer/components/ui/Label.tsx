import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

const Label = forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn('text-xs text-muted-foreground', className)}
        {...props}
      />
    );
  }
);

Label.displayName = 'Label';

export { Label };
