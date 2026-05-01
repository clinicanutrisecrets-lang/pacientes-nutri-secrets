import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cx } from '@/lib/util';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'md' | 'lg';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

const base =
  'inline-flex items-center justify-center rounded-2xl font-medium transition-colors duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed';

const sizes: Record<Size, string> = {
  md: 'min-h-[48px] px-5 text-base',
  lg: 'min-h-[56px] px-7 text-lg',
};

const variants: Record<Variant, string> = {
  primary:
    'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] focus-visible:ring-[var(--color-primary)]',
  secondary:
    'bg-[var(--color-surface-soft)] text-app hover:bg-[var(--color-surface)] border border-app focus-visible:ring-[var(--color-primary)]',
  ghost:
    'bg-transparent text-app hover:bg-[var(--color-surface-soft)] focus-visible:ring-[var(--color-primary)]',
  danger:
    'bg-rose-dusty text-white hover:opacity-90 focus-visible:ring-rose-dusty',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...rest
}: Props) {
  return (
    <button
      type="button"
      className={cx(base, sizes[size], variants[variant], className)}
      {...rest}
    >
      {children}
    </button>
  );
}
