import { AlertTriangle, User } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { formatFieldValue, getDaysUntil } from './entityUtils';
import type { EntityMock, IndustriaConfig } from '../../types/config.types';

interface EntityCardProps {
  entity: EntityMock;
  config: IndustriaConfig;
  onClick: () => void;
}

export function EntityCard({ entity, config, onClick }: EntityCardProps) {
  const status = config.statuses.find(s => s.key === entity.statusKey);
  const visibleFields = config.fields.filter(f => f.showInCard !== false).slice(0, 4);

  const dateAlerts = config.fields.filter(f => {
    if (f.type !== 'date' || !f.alertDaysThreshold) return false;
    const val = entity.fields[f.key];
    if (!val) return false;
    const days = getDaysUntil(String(val));
    return days !== null && days <= f.alertDaysThreshold && days >= 0;
  });

  return (
    <div
      className="card p-4 cursor-pointer hover:shadow-md transition-shadow duration-150 hover:border-slate-300"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0 pr-2">
          <h3 className="font-semibold text-slate-900 truncate">{entity.name}</h3>
          {entity.responsable && (
            <div className="flex items-center gap-1 mt-0.5">
              <User size={11} className="text-slate-400" />
              <span className="text-xs text-slate-500">{entity.responsable}</span>
            </div>
          )}
        </div>
        <div className="flex-shrink-0">
          {status && <Badge label={status.label} colorClass={status.color} dot={status.dot} />}
        </div>
      </div>

      {dateAlerts.length > 0 && (
        <div className="flex items-center gap-1.5 mb-3 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5">
          <AlertTriangle size={13} className="text-amber-500 flex-shrink-0" />
          <span className="text-xs text-amber-700">
            {dateAlerts[0].label}: {getDaysUntil(String(entity.fields[dateAlerts[0].key]))} días
          </span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        {visibleFields.map(field => {
          const val = entity.fields[field.key];
          if (val === undefined || val === null || val === '') return null;
          return (
            <div key={field.key} className="min-w-0">
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide truncate">{field.label}</p>
              <p className="text-sm font-medium text-slate-800 truncate">
                {formatFieldValue(val, field)}
                {field.unit && val !== '' ? ` ${field.unit}` : ''}
              </p>
            </div>
          );
        })}
      </div>

      {config.hasChecklist && entity.checklist && entity.checklist.length > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">Checklist</span>
            <span className="text-xs text-slate-600">
              {entity.checklist.filter(c => c.done).length}/{entity.checklist.length}
            </span>
          </div>
          <div className="mt-1.5 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${(entity.checklist.filter(c => c.done).length / entity.checklist.length) * 100}%`,
                backgroundColor: 'var(--color-primary)',
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
