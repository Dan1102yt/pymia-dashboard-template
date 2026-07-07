import { clsx } from 'clsx';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: boolean;
}

export function Card({ children, className, padding = true }: CardProps) {
  return (
    <div className={clsx('card', padding && 'p-5', className)}>
      {children}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  icon?: ReactNode;
  trend?: { value: string; positive: boolean };
  color?: string; // CSS color for icon bg
}

export function StatCard({ label, value, sub, icon, trend, color }: StatCardProps) {
  return (
    <div className="stat-card flex items-start justify-between">
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">{label}</p>
        <p className="text-2xl font-bold text-slate-900 truncate">{value}</p>
        {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
        {trend && (
          <span className={clsx('text-xs font-medium mt-1 inline-block', trend.positive ? 'text-green-600' : 'text-red-600')}>
            {trend.positive ? '▲' : '▼'} {trend.value}
          </span>
        )}
      </div>
      {icon && (
        <div className="rounded-xl p-2.5 ml-3 flex-shrink-0" style={{ backgroundColor: color ? `${color}18` : '#EFF6FF' }}>
          <span style={{ color: color ?? 'var(--color-primary)' }}>{icon}</span>
        </div>
      )}
    </div>
  );
}
