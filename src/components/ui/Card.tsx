import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '@/lib/util';

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ children, className, ...rest }: Props) {
  return (
    <div
      className={cx(
        'rounded-3xl bg-surface border border-app p-6 shadow-sm',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
