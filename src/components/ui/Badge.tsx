import { clsx } from 'clsx';

interface BadgeProps {
  label: string;
  colorClass: string; // e.g. "bg-green-100 text-green-700"
  dot?: string;       // e.g. "bg-green-500"
  size?: 'sm' | 'md';
}

export function Badge({ label, colorClass, dot, size = 'md' }: BadgeProps) {
  return (
    <span className={clsx('inline-flex items-center gap-1.5 font-medium rounded-full', colorClass, size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs')}>
      {dot && <span className={clsx('rounded-full flex-shrink-0', dot, size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2')} />}
      {label}
    </span>
  );
}
