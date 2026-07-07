import { useState } from 'react';
import { LayoutGrid, Table2, AlertTriangle } from 'lucide-react';
import { EntityCard } from './EntityCard';
import { EntityTable } from './EntityTable';
import { EntityDetail } from './EntityDetail';
import { getDaysUntil } from './entityUtils';
import type { EntityMock, IndustriaConfig } from '../../types/config.types';

interface EntityTrackerProps {
  config: IndustriaConfig;
}

export function EntityTracker({ config }: EntityTrackerProps) {
  const [view, setView] = useState<'cards' | 'table'>(config.defaultView ?? 'cards');
  const [selected, setSelected] = useState<EntityMock | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Compute global alerts
  const globalAlerts = config.entities.flatMap(entity =>
    config.fields
      .filter(f => f.type === 'date' && f.alertDaysThreshold != null)
      .flatMap(f => {
        const val = entity.fields[f.key];
        if (!val) return [];
        const days = getDaysUntil(String(val));
        if (days !== null && days <= (f.alertDaysThreshold ?? 0) && days >= 0) {
          return [{ entity: entity.name, field: f.label, days }];
        }
        return [];
      })
  );

  const filtered = filterStatus === 'all'
    ? config.entities
    : config.entities.filter(e => e.statusKey === filterStatus);

  return (
    <div className="space-y-5">
      {/* Global alerts banner */}
      {globalAlerts.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={16} className="text-amber-600" />
            <span className="text-sm font-semibold text-amber-800">
              {globalAlerts.length} alerta{globalAlerts.length > 1 ? 's' : ''} de vencimiento
            </span>
          </div>
          <div className="space-y-1">
            {globalAlerts.map((a, i) => (
              <p key={i} className="text-xs text-amber-700">
                <strong>{a.entity}</strong>: {a.field} vence en <strong>{a.days}</strong> día{a.days !== 1 ? 's' : ''}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Status filter */}
        <div className="flex items-center gap-1.5 flex-wrap flex-1">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filterStatus === 'all' ? 'text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            style={filterStatus === 'all' ? { backgroundColor: 'var(--color-primary)' } : {}}
          >
            Todos ({config.entities.length})
          </button>
          {config.statuses.map(s => {
            const count = config.entities.filter(e => e.statusKey === s.key).length;
            return (
              <button
                key={s.key}
                onClick={() => setFilterStatus(s.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filterStatus === s.key ? 'text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                style={filterStatus === s.key ? { backgroundColor: 'var(--color-primary)' } : {}}
              >
                {s.label} ({count})
              </button>
            );
          })}
        </div>

        {/* View toggle */}
        <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5">
          <button
            onClick={() => setView('cards')}
            className={`p-1.5 rounded-md transition-colors ${view === 'cards' ? 'text-white' : 'text-slate-500 hover:bg-slate-100'}`}
            style={view === 'cards' ? { backgroundColor: 'var(--color-primary)' } : {}}
            title="Vista tarjetas"
          >
            <LayoutGrid size={16} />
          </button>
          <button
            onClick={() => setView('table')}
            className={`p-1.5 rounded-md transition-colors ${view === 'table' ? 'text-white' : 'text-slate-500 hover:bg-slate-100'}`}
            style={view === 'table' ? { backgroundColor: 'var(--color-primary)' } : {}}
            title="Vista tabla"
          >
            <Table2 size={16} />
          </button>
        </div>
      </div>

      {/* Entity list */}
      {filtered.length === 0 ? (
        <div className="card p-12 text-center text-slate-400">
          <p className="text-sm">No hay {config.entityNamePlural.toLowerCase()} con este estado.</p>
        </div>
      ) : view === 'cards' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(entity => (
            <EntityCard
              key={entity.id}
              entity={entity}
              config={config}
              onClick={() => setSelected(entity)}
            />
          ))}
        </div>
      ) : (
        <EntityTable entities={filtered} config={config} onRowClick={setSelected} />
      )}

      <EntityDetail entity={selected} config={config} onClose={() => setSelected(null)} />
    </div>
  );
}
