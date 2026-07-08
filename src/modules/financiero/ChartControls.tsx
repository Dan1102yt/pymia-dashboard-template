import { clsx } from 'clsx';
import { BarChart3, AreaChart as AreaChartIcon, BarChart2 } from 'lucide-react';
import type { FinancialCategory } from '../../types/config.types';

export type ChartType = 'bar' | 'area' | 'grouped-bar';
export type PresetKey = 'ingresos-egresos' | 'ingresos-utilidad' | 'margen' | 'egresos-categoria' | 'personalizado';

export interface ChartVariable {
  key: string;
  label: string;
  color: string;
  unit: 'currency' | 'percent';
}

// Distinct from the fixed metric colors (ingresos/egresos/utilidad/margen) so a
// "Personalizado" combo mixing metrics and categories never collides in color.
const CATEGORY_COLORS = ['#F59E0B', '#06B6D4', '#EC4899', '#84CC16', '#F97316', '#14B8A6'];

export function getAvailableVariables(categorias: FinancialCategory[]): ChartVariable[] {
  return [
    { key: 'ingresos', label: 'Ingresos', color: '#10B981', unit: 'currency' },
    { key: 'egresos', label: 'Egresos', color: '#EF4444', unit: 'currency' },
    { key: 'utilidad', label: 'Utilidad', color: '#2563EB', unit: 'currency' },
    { key: 'margen', label: 'Margen (%)', color: '#8B5CF6', unit: 'percent' },
    ...categorias.map((c, i) => ({
      key: `cat_${i}`,
      label: c.nombre,
      color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
      unit: 'currency' as const,
    })),
  ];
}

export function getPresetVariableKeys(preset: PresetKey, categorias: FinancialCategory[]): string[] {
  switch (preset) {
    case 'ingresos-egresos': return ['ingresos', 'egresos'];
    case 'ingresos-utilidad': return ['ingresos', 'utilidad'];
    case 'margen': return ['margen'];
    case 'egresos-categoria': return categorias.map((_, i) => `cat_${i}`);
    case 'personalizado': return [];
  }
}

const PRESET_OPTIONS: { key: PresetKey; label: string }[] = [
  { key: 'ingresos-egresos', label: 'Ingresos vs Egresos' },
  { key: 'ingresos-utilidad', label: 'Ingresos vs Utilidad' },
  { key: 'margen', label: 'Margen (%)' },
  { key: 'egresos-categoria', label: 'Egresos por categoría' },
  { key: 'personalizado', label: 'Personalizado' },
];

const CHART_TYPE_OPTIONS: { key: ChartType; label: string; Icon: typeof BarChart3 }[] = [
  { key: 'bar', label: 'Barras', Icon: BarChart3 },
  { key: 'area', label: 'Área', Icon: AreaChartIcon },
  { key: 'grouped-bar', label: 'Barras comparativas', Icon: BarChart2 },
];

interface ChartControlsProps {
  categorias: FinancialCategory[];
  chartType: ChartType;
  onChartTypeChange: (type: ChartType) => void;
  preset: PresetKey;
  onPresetChange: (preset: PresetKey) => void;
  customKeys: string[];
  onCustomKeysChange: (keys: string[]) => void;
}

export function ChartControls({
  categorias, chartType, onChartTypeChange, preset, onPresetChange, customKeys, onCustomKeysChange,
}: ChartControlsProps) {
  const availableVariables = getAvailableVariables(categorias);

  const toggleCustomKey = (key: string) => {
    onCustomKeysChange(
      customKeys.includes(key) ? customKeys.filter(k => k !== key) : [...customKeys, key]
    );
  };

  return (
    <div className="space-y-3 mb-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="inline-flex items-center gap-1 bg-slate-100 rounded-lg p-1">
          {CHART_TYPE_OPTIONS.map(({ key, label, Icon }) => (
            <button
              key={key}
              type="button"
              aria-label={label}
              title={label}
              onClick={() => onChartTypeChange(key)}
              className={clsx(
                'inline-flex items-center justify-center gap-1.5 min-w-[40px] min-h-[40px] px-2.5 sm:px-3 rounded-md text-xs font-medium transition-colors',
                chartType === key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              )}
            >
              <Icon size={14} className="flex-shrink-0" />
              {/* Full labels overflow at narrow widths with 3 tabs — icon-only on mobile, label appears from sm up */}
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        <select
          value={preset}
          onChange={e => onPresetChange(e.target.value as PresetKey)}
          className="w-full sm:w-auto text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg px-3 py-2.5 sm:py-2 min-h-[40px] focus:outline-none focus:ring-2 focus:ring-slate-300"
        >
          {PRESET_OPTIONS.map(({ key, label }) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      {preset === 'personalizado' && (
        <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
          {availableVariables.map(v => {
            const active = customKeys.includes(v.key);
            return (
              <label
                key={v.key}
                className={clsx(
                  'inline-flex items-center gap-1.5 px-3 py-2.5 sm:py-1.5 min-h-[40px] sm:min-h-0 rounded-md text-xs font-medium cursor-pointer border transition-colors',
                  active ? 'border-transparent text-white' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                )}
                style={active ? { backgroundColor: v.color } : undefined}
              >
                <input type="checkbox" checked={active} onChange={() => toggleCustomKey(v.key)} className="hidden" />
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: active ? 'rgba(255,255,255,0.8)' : v.color }}
                />
                {v.label}
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}
