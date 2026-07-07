import { User, Clock, CheckSquare, Square, AlertTriangle } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { formatFieldValue, getDaysUntil } from './entityUtils';
import { format, parseISO, isValid } from 'date-fns';
import { es } from 'date-fns/locale';
import type { EntityMock, IndustriaConfig } from '../../types/config.types';

interface EntityDetailProps {
  entity: EntityMock | null;
  config: IndustriaConfig;
  onClose: () => void;
}

export function EntityDetail({ entity, config, onClose }: EntityDetailProps) {
  if (!entity) return null;

  const status = config.statuses.find(s => s.key === entity.statusKey);

  const dateAlerts = config.fields.filter(f => {
    if (f.type !== 'date' || !f.alertDaysThreshold) return false;
    const val = entity.fields[f.key];
    if (!val) return false;
    const days = getDaysUntil(String(val));
    return days !== null && days <= f.alertDaysThreshold && days >= 0;
  });

  return (
    <Modal open={!!entity} onClose={onClose} title={entity.name} size="lg">
      <div className="space-y-5">
        {/* Status & responsable */}
        <div className="flex items-center gap-3 flex-wrap">
          {status && <Badge label={status.label} colorClass={status.color} dot={status.dot} />}
          {entity.responsable && (
            <div className="flex items-center gap-1.5 text-sm text-slate-600">
              <User size={14} />
              <span>{entity.responsable}</span>
            </div>
          )}
        </div>

        {/* Alerts */}
        {dateAlerts.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 space-y-1">
            {dateAlerts.map(f => {
              const days = getDaysUntil(String(entity.fields[f.key]));
              return (
                <div key={f.key} className="flex items-center gap-2 text-sm text-amber-700">
                  <AlertTriangle size={14} className="flex-shrink-0" />
                  <span><strong>{f.label}</strong> vence en {days} día{days !== 1 ? 's' : ''}.</span>
                </div>
              );
            })}
          </div>
        )}

        {/* All fields */}
        <div>
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Información</h3>
          <div className="grid grid-cols-2 gap-3">
            {config.fields.map(field => {
              const val = entity.fields[field.key];
              if (val === undefined || val === null || val === '') return null;
              return (
                <div key={field.key} className="bg-slate-50 rounded-lg p-3">
                  <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide mb-0.5">{field.label}</p>
                  <p className="text-sm font-semibold text-slate-800">
                    {formatFieldValue(val, field)}
                    {field.unit ? ` ${field.unit}` : ''}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Checklist */}
        {config.hasChecklist && entity.checklist && entity.checklist.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Checklist</h3>
            <div className="space-y-2">
              {entity.checklist.map((item, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  {item.done
                    ? <CheckSquare size={16} className="flex-shrink-0" style={{ color: 'var(--color-primary)' }} />
                    : <Square size={16} className="text-slate-300 flex-shrink-0" />
                  }
                  <span className={`text-sm ${item.done ? 'text-slate-600 line-through' : 'text-slate-800'}`}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Event history */}
        {entity.events && entity.events.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Historial</h3>
            <div className="space-y-3">
              {entity.events.map((ev, i) => {
                let dateStr = ev.date;
                try {
                  const d = parseISO(ev.date);
                  if (isValid(d)) dateStr = format(d, "d 'de' MMMM yyyy", { locale: es });
                } catch { /* keep raw */ }
                return (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: 'var(--color-primary)' }} />
                      {i < (entity.events?.length ?? 0) - 1 && (
                        <div className="w-px flex-1 bg-slate-200 mt-1" />
                      )}
                    </div>
                    <div className="pb-3 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                          <Clock size={11} /> {dateStr}
                        </span>
                        {ev.user && <span className="text-xs text-slate-400">· {ev.user}</span>}
                      </div>
                      <p className="text-sm text-slate-700 mt-0.5">{ev.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
