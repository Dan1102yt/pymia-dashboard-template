import { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Percent, Camera } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { StatCard } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { ReceiptUploader } from './ReceiptUploader';
import { FinancialAlerts } from './FinancialAlerts';
import { ChartControls, getAvailableVariables, getPresetVariableKeys, type ChartType, type PresetKey } from './ChartControls';
import { clientConfig } from '../../config/client.config';

const fmt = (n: number) => `$${(n / 1000000).toFixed(1)}M`;
const fmtFull = (n: number) => `$${n.toLocaleString('es-CO')}`;

const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

export function FinancieroModule() {
  const [showReceipt, setShowReceipt] = useState(false);
  const [chartType, setChartType] = useState<ChartType>('area');
  const [preset, setPreset] = useState<PresetKey>('ingresos-egresos');
  const [customKeys, setCustomKeys] = useState<string[]>(['ingresos', 'egresos']);
  const { financiero } = clientConfig.mockData;

  const lastMonth = financiero.historico[financiero.historico.length - 1];
  const prevMonth = financiero.historico[financiero.historico.length - 2];

  const totalIngresos = financiero.historico.reduce((s, m) => s + m.ingresos, 0);
  const totalEgresos = financiero.historico.reduce((s, m) => s + m.egresos, 0);
  const utilidad = totalIngresos - totalEgresos;
  const margen = totalIngresos > 0 ? ((utilidad / totalIngresos) * 100).toFixed(1) : '0';

  const ingDelta = prevMonth ? (((lastMonth.ingresos - prevMonth.ingresos) / prevMonth.ingresos) * 100).toFixed(1) : null;

  // categorias_egresos is a single-period breakdown (not tracked per month), so
  // its shares are applied to each month's egresos as a proportional estimate
  // for display in the time-series chart.
  const totalCatEgresos = financiero.categorias_egresos.reduce((s, c) => s + c.monto, 0);

  const chartData = financiero.historico.map(m => {
    const monthUtilidad = m.ingresos - m.egresos;
    const monthMargen = m.ingresos > 0 ? (monthUtilidad / m.ingresos) * 100 : 0;
    const categorias = Object.fromEntries(
      financiero.categorias_egresos.map((c, i) => [
        `cat_${i}`,
        totalCatEgresos > 0 ? (c.monto / totalCatEgresos) * m.egresos : 0,
      ])
    );
    return { ...m, utilidad: monthUtilidad, margen: monthMargen, ...categorias };
  });

  const availableVariables = getAvailableVariables(financiero.categorias_egresos);
  const activeKeys = preset === 'personalizado' ? customKeys : getPresetVariableKeys(preset, financiero.categorias_egresos);
  const activeVariables = availableVariables.filter(v => activeKeys.includes(v.key));
  const allPercent = activeVariables.length > 0 && activeVariables.every(v => v.unit === 'percent');

  const formatAxisValue = (v: number) => allPercent ? `${v.toFixed(0)}%` : `$${(v / 1000000).toFixed(0)}M`;
  const formatTooltipValue = (value: number, _name: string, props: { dataKey?: string | number }) => {
    const variable = availableVariables.find(v => v.key === props.dataKey);
    return variable?.unit === 'percent' ? `${value.toFixed(1)}%` : fmtFull(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Financiero</h1>
          <p className="text-sm text-slate-500">Resumen de los últimos 6 meses</p>
        </div>
        <Button onClick={() => setShowReceipt(true)} size="sm">
          <Camera size={15} /> Subir recibo
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Ingresos totales"
          value={fmt(totalIngresos)}
          sub="Últimos 6 meses"
          icon={<TrendingUp size={20} />}
          trend={ingDelta ? { value: `${ingDelta}% vs mes ant.`, positive: parseFloat(ingDelta) >= 0 } : undefined}
          color="#10B981"
        />
        <StatCard
          label="Egresos totales"
          value={fmt(totalEgresos)}
          sub="Últimos 6 meses"
          icon={<TrendingDown size={20} />}
          color="#EF4444"
        />
        <StatCard
          label="Utilidad neta"
          value={fmt(utilidad)}
          sub="Ingresos - Egresos"
          icon={<DollarSign size={20} />}
          color="#2563EB"
        />
        <StatCard
          label="Margen neto"
          value={`${margen}%`}
          sub={`${lastMonth.mes}: ${fmt(lastMonth.ingresos - lastMonth.egresos)}`}
          icon={<Percent size={20} />}
          color="#8B5CF6"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main configurable chart */}
        <div className="lg:col-span-2 card p-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-1">Serie financiera mensual</h2>
          <ChartControls
            categorias={financiero.categorias_egresos}
            chartType={chartType}
            onChartTypeChange={setChartType}
            preset={preset}
            onPresetChange={setPreset}
            customKeys={customKeys}
            onCustomKeysChange={setCustomKeys}
          />
          {activeVariables.length === 0 ? (
            <div className="h-[220px] flex items-center justify-center text-sm text-slate-400">
              Selecciona al menos una variable
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              {chartType === 'area' ? (
                <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                  <defs>
                    {activeVariables.map(v => (
                      <linearGradient key={v.key} id={`grad-${v.key}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={v.color} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={v.color} stopOpacity={0.02} />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="mes" tick={{ fontSize: 12, fill: '#94A3B8' }} tickLine={false} axisLine={false} />
                  <YAxis tickFormatter={formatAxisValue} tick={{ fontSize: 11, fill: '#94A3B8' }} tickLine={false} axisLine={false} />
                  <Tooltip formatter={formatTooltipValue} labelStyle={{ fontWeight: 600 }} />
                  <Legend />
                  {activeVariables.map(v => (
                    <Area key={v.key} type="monotone" dataKey={v.key} name={v.label} stroke={v.color} fill={`url(#grad-${v.key})`} strokeWidth={2} />
                  ))}
                </AreaChart>
              ) : (
                <BarChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="mes" tick={{ fontSize: 12, fill: '#94A3B8' }} tickLine={false} axisLine={false} />
                  <YAxis tickFormatter={formatAxisValue} tick={{ fontSize: 11, fill: '#94A3B8' }} tickLine={false} axisLine={false} />
                  <Tooltip formatter={formatTooltipValue} labelStyle={{ fontWeight: 600 }} />
                  <Legend />
                  {activeVariables.map(v => (
                    <Bar
                      key={v.key}
                      dataKey={v.key}
                      name={v.label}
                      fill={v.color}
                      radius={[4, 4, 0, 0]}
                      {...(chartType === 'bar' ? { stackId: 'stack' } : {})}
                    />
                  ))}
                </BarChart>
              )}
            </ResponsiveContainer>
          )}
        </div>

        {/* Pie chart egresos */}
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Distribución de egresos</h2>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie data={financiero.categorias_egresos} dataKey="monto" nameKey="nombre" cx="50%" cy="50%" outerRadius={60} innerRadius={30}>
                {financiero.categorias_egresos.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => fmtFull(v)} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {financiero.categorias_egresos.map((c, i) => (
              <div key={c.nombre} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-slate-600">{c.nombre}</span>
                </div>
                <span className="font-medium text-slate-800">{fmt(c.monto)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Financial alerts */}
      <FinancialAlerts data={financiero} />

      {/* Bar chart utilidad */}
      <div className="card p-5">
        <h2 className="text-sm font-semibold text-slate-700 mb-4">Utilidad mensual</h2>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="mes" tick={{ fontSize: 12, fill: '#94A3B8' }} tickLine={false} axisLine={false} />
            <YAxis tickFormatter={v => `$${(v / 1000000).toFixed(0)}M`} tick={{ fontSize: 11, fill: '#94A3B8' }} tickLine={false} axisLine={false} />
            <Tooltip formatter={(v: number) => fmtFull(v)} />
            <Bar dataKey="utilidad" name="Utilidad" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.utilidad >= 0 ? 'var(--color-primary)' : '#EF4444'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Receipt modal */}
      <Modal open={showReceipt} onClose={() => setShowReceipt(false)} title="Registrar recibo con IA">
        <ReceiptUploader />
      </Modal>
    </div>
  );
}
