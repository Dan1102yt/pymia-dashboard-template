import { clsx } from 'clsx';
import type { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export function Button({ variant = 'primary', size = 'md', children, className, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center gap-2 font-medium rounded-lg transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed',
        {
          'btn-primary': variant === 'primary',
          'btn-secondary': variant === 'secondary',
          'hover:bg-slate-100 text-slate-600 active:bg-slate-200': variant === 'ghost',
          'bg-red-600 text-white hover:bg-red-700': variant === 'danger',
          'px-2.5 py-1.5 text-xs': size === 'sm',
          'px-4 py-2 text-sm': size === 'md',
          'px-5 py-2.5 text-base': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
