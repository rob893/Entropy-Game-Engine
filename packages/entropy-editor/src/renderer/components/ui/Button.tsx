import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import type { VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-white/6 border border-border text-foreground hover:bg-white/10',
        primary: 'bg-primary text-primary-foreground border border-primary hover:bg-primary/80',
        ghost: 'text-foreground hover:bg-white/8 border border-transparent',
        destructive: 'bg-destructive text-destructive-foreground border border-destructive hover:bg-destructive/80',
        outline: 'border border-border text-foreground hover:bg-white/6'
      },
      size: {
        default: 'h-8 px-3 py-1.5',
        sm: 'h-7 px-2 py-1 text-xs',
        lg: 'h-9 px-4 py-2',
        icon: 'h-8 w-8 p-0'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
);

type ButtonVariantProps = VariantProps<typeof buttonVariants>;

interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, ButtonVariantProps {
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, IButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
export type { IButtonProps };
