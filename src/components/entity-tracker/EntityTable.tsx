import { AlertTriangle } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { formatFieldValue, getDaysUntil } from './entityUtils';
import type { EntityMock, IndustriaConfig } from '../../types/config.types';

interface EntityTableProps {
  entities: EntityMock[];
  config: IndustriaConfig;
  onRowClick: (entity: EntityMock) => void;
}

export function EntityTable({ entities, config, onRowClick }: EntityTableProps) {
  const tableFields = config.fields.filter(f => f.showInTable !== false);

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            <th className="text-left px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide whitespace-nowrap">
              {config.entityName}
            </th>
            <th className="text-left px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide whitespace-nowrap">
              Estado
            </th>
            {tableFields.map(field => (
              <th key={field.key} className="text-left px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide whitespace-nowrap">
                {field.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {entities.map(entity => {
            const status = config.statuses.find(s => s.key === entity.statusKey);
            const hasAlert = config.fields.some(f => {
              if (f.type !== 'date' || !f.alertDaysThreshold) return false;
              const val = entity.fields[f.key];
              if (!val) return false;
              const days = getDaysUntil(String(val));
              return days !== null && days <= f.alertDaysThreshold && days >= 0;
            });

            return (
              <tr
                key={entity.id}
                className="hover:bg-slate-50 cursor-pointer transition-colors"
                onClick={() => onRowClick(entity)}
              >
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {hasAlert && <AlertTriangle size={14} className="text-amber-500 flex-shrink-0" />}
                    <span className="font-medium text-slate-900">{entity.name}</span>
                  </div>
                  {entity.responsable && (
                    <p className="text-xs text-slate-500 mt-0.5">{entity.responsable}</p>
                  )}
                </td>
                <td className="px-4 py-3">
                  {status && <Badge label={status.label} colorClass={status.color} dot={status.dot} size="sm" />}
                </td>
                {tableFields.map(field => {
                  const val = entity.fields[field.key];
                  const isAlertField = field.type === 'date' && field.alertDaysThreshold != null;
                  const days = isAlertField && val ? getDaysUntil(String(val)) : null;
                  const isUrgent = days !== null && days <= (field.alertDaysThreshold ?? 0) && days >= 0;

                  return (
                    <td key={field.key} className={`px-4 py-3 whitespace-nowrap ${isUrgent ? 'text-amber-600 font-medium' : 'text-slate-700'}`}>
                      {val !== undefined && val !== null && val !== ''
                        ? formatFieldValue(val, field)
                        : <span className="text-slate-400">—</span>
                      }
                      {field.unit && val !== undefined && val !== '' ? ` ${field.unit}` : ''}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
