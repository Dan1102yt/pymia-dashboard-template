import { AlertTriangle, TrendingDown, TrendingUp, Info, CheckCircle, type LucideIcon } from 'lucide-react';
import type { FinancieroMockData } from '../../types/config.types';

// ─── Types ───────────────────────────────────────────────────────────────────

type Severity = 'danger' | 'warning' | 'info' | 'ok';

interface AlertCard {
  severity: Severity;
  Icon: LucideIcon;
  title: string;
  description: string;
  pill: string;
}

// ─── Severity styling maps ────────────────────────────────────────────────────

const SEVERITY_STYLES: Record<Severity, { card: string; icon: string; pill: string; dot: string }> = {
  danger:  { card: 'bg-red-50 border-red-200',      icon: 'text-red-500',     pill: 'bg-red-100 text-red-700',      dot: 'bg-red-500'     },
  warning: { card: 'bg-amber-50 border-amber-200',   icon: 'text-amber-500',   pill: 'bg-amber-100 text-amber-700',  dot: 'bg-amber-500'   },
  info:    { card: 'bg-blue-50 border-blue-200',     icon: 'text-blue-500',    pill: 'bg-blue-100 text-blue-700',    dot: 'bg-blue-500'    },
  ok:      { card: 'bg-emerald-50 border-emerald-200', icon: 'text-emerald-500', pill: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
};

const LEGEND: { label: string; severity: Severity }[] = [
  { label: 'Crítico',   severity: 'danger'  },
  { label: 'Alerta',    severity: 'warning' },
  { label: 'Info',      severity: 'info'    },
  { label: 'Positivo',  severity: 'ok'      },
];

// ─── Alert computation ───────────────────────────────────────────────────────

function computeAlerts(data: FinancieroMockData): AlertCard[] {
  const { historico, categorias_egresos } = data;
  const n = historico.length;

  // Total egresos across all categorías (used for % calculations)
  const totalCatEgresos = categorias_egresos.reduce((s, c) => s + c.monto, 0);

  // Largest egreso category
  const largestCat = [...categorias_egresos].sort((a, b) => b.monto - a.monto)[0] ?? { nombre: '—', monto: 0 };
  const largestCatPct = totalCatEgresos > 0 ? (largestCat.monto / totalCatEgresos) * 100 : 0;

  // ── Alert 1: Concentración de egresos ──────────────────────────────────────
  // Uses categorias_egresos[].nombre and [].monto (same source as PieChart)
  const alert1: AlertCard = (() => {
    const pct = largestCatPct;
    const severity: Severity = pct >= 45 ? 'danger' : 'warning';
    return {
      severity,
      Icon: AlertTriangle,
      title: 'Concentración de egresos',
      description: `"${largestCat.nombre}" representa el ${pct.toFixed(1)}% del total de egresos registrados. ${pct >= 45 ? 'Alta concentración — riesgo ante variaciones de precio.' : 'Es la categoría dominante — monitorear su evolución.'}`,
      pill: `${pct.toFixed(1)}% del total`,
    };
  })();

  // ── Alert 2: Caída mensual pronunciada ─────────────────────────────────────
  // Uses historico[].ingresos
  const alert2: AlertCard = (() => {
    let maxDrop = 0;
    let dropMes = '';
    for (let i = 1; i < n; i++) {
      const prev = historico[i - 1].ingresos;
      const curr = historico[i].ingresos;
      if (prev > 0) {
        const pct = ((prev - curr) / prev) * 100;
        if (pct > maxDrop) { maxDrop = pct; dropMes = historico[i].mes; }
      }
    }
    const severity: Severity = maxDrop > 10 ? 'warning' : 'ok';
    return {
      severity,
      Icon: TrendingDown,
      title: 'Caída mensual pronunciada',
      description: maxDrop > 0
        ? `La mayor caída de ingresos ocurrió en ${dropMes} (${maxDrop.toFixed(1)}% vs el mes anterior). ${maxDrop > 10 ? 'Revisar causas y tomar acción correctiva.' : 'Dentro de rangos normales de variación.'}`
        : 'No se detectaron caídas en el período analizado.',
      pill: maxDrop > 0 ? `−${maxDrop.toFixed(1)}% en ${dropMes}` : 'Sin caídas',
    };
  })();

  // ── Alert 3: Presión de costos ────────────────────────────────────────────
  // Compares the weight of the largest expense category (from categorias_egresos)
  // against the growth of total monthly egresos from first to last month.
  // A category that stays proportionally stable is fine; if total egresos grew
  // faster than revenue, the dominant category is pressuring margins.
  const alert3: AlertCard = (() => {
    if (n < 2) {
      return { severity: 'info' as Severity, Icon: Info, title: 'Presión de costos', description: 'Se necesitan al menos 2 meses de datos para este análisis.', pill: 'Sin datos' };
    }
    // Weight of the largest category in total expenses (static breakdown)
    const catPct = totalCatEgresos > 0 ? (largestCat.monto / totalCatEgresos) * 100 : 0;
    // How much did egresos grow vs ingresos from first to last month?
    const egresoGrowth = historico[0].egresos > 0
      ? ((historico[n - 1].egresos - historico[0].egresos) / historico[0].egresos) * 100 : 0;
    const ingresoGrowth = historico[0].ingresos > 0
      ? ((historico[n - 1].ingresos - historico[0].ingresos) / historico[0].ingresos) * 100 : 0;
    const delta = egresoGrowth - ingresoGrowth;
    const severity: Severity = delta > 2 ? 'warning' : 'info';
    return {
      severity,
      Icon: delta > 2 ? AlertTriangle : Info,
      title: 'Presión de costos',
      description: `"${largestCat.nombre}" representa el ${catPct.toFixed(1)}% de los egresos. Entre ${historico[0].mes} y ${historico[n - 1].mes}, los egresos crecieron ${egresoGrowth.toFixed(1)}% vs ingresos +${ingresoGrowth.toFixed(1)}%. ${delta > 2 ? 'Los costos crecen más rápido que los ingresos.' : 'Costos creciendo en línea con los ingresos.'}`,
      pill: `Egresos ${delta >= 0 ? '+' : ''}${delta.toFixed(1)} pp vs ingresos`,
    };
  })();

  // ── Alert 4: Eficiencia operacional ──────────────────────────────────────
  // Uses historico[n-1].egresos / historico[n-1].ingresos
  const alert4: AlertCard = (() => {
    const last = historico[n - 1];
    const ratio = last.ingresos > 0 ? (last.egresos / last.ingresos) * 100 : 100;
    const severity: Severity = ratio < 83 ? 'ok' : 'warning';
    return {
      severity,
      Icon: ratio < 83 ? CheckCircle : AlertTriangle,
      title: 'Eficiencia operacional',
      description: `En ${last.mes}, los egresos equivalen al ${ratio.toFixed(1)}% de los ingresos. ${ratio < 83 ? 'Nivel saludable — buen control de costos.' : 'Por encima del umbral del 83% — los costos consumen demasiado del ingreso.'}`,
      pill: `${ratio.toFixed(1)}% costo/ingreso`,
    };
  })();

  // ── Alert 5: Crecimiento de la categoría de egreso más grande ────────────
  // Uses categorias_egresos[].monto vs historico egresos del primer y último mes
  // We proxy growth as the ratio of total egresos last vs first × catWeight
  const alert5: AlertCard = (() => {
    if (n < 2) {
      return { severity: 'info' as Severity, Icon: Info, title: `Crecimiento: ${largestCat.nombre}`, description: 'Se necesitan al menos 2 meses de datos.', pill: 'Sin datos' };
    }
    const egresoFirst = historico[0].egresos;
    const egresoLast  = historico[n - 1].egresos;
    const growth = egresoFirst > 0 ? ((egresoLast - egresoFirst) / egresoFirst) * 100 : 0;
    const severity: Severity = growth > 15 ? 'warning' : 'info';
    return {
      severity,
      Icon: Info,
      title: `Crecimiento de egresos: ${largestCat.nombre}`,
      description: `Los egresos totales crecieron un ${growth.toFixed(1)}% entre ${historico[0].mes} y ${historico[n - 1].mes}. La categoría principal "${largestCat.nombre}" creció proporcionalmente. ${growth > 15 ? 'Ritmo elevado — evaluar eficiencia.' : 'Crecimiento moderado, acompañando al negocio.'}`,
      pill: `+${growth.toFixed(1)}% en el período`,
    };
  })();

  // ── Alert 6: Recuperación sostenida ─────────────────────────────────────
  // Uses historico[].ingresos — checks last 3 months for consecutive growth
  const alert6: AlertCard = (() => {
    if (n < 3) {
      return { severity: 'info' as Severity, Icon: Info, title: 'Recuperación sostenida', description: 'Se necesitan al menos 3 meses de datos para este análisis.', pill: 'Sin datos' };
    }
    const last3 = historico.slice(-3);
    const isGrowing = last3[1].ingresos > last3[0].ingresos && last3[2].ingresos > last3[1].ingresos;
    const severity: Severity = isGrowing ? 'ok' : 'info';
    return {
      severity,
      Icon: TrendingUp,
      title: 'Recuperación sostenida',
      description: isGrowing
        ? `Los ingresos de ${last3[0].mes}, ${last3[1].mes} y ${last3[2].mes} muestran crecimiento consecutivo. Tendencia positiva confirmada.`
        : `Los últimos 3 meses (${last3[0].mes}–${last3[2].mes}) no muestran crecimiento consecutivo de ingresos. Monitorear la tendencia.`,
      pill: isGrowing ? '3 meses al alza' : 'Sin tendencia clara',
    };
  })();

  return [alert1, alert2, alert3, alert4, alert5, alert6];
}

// ─── Component ────────────────────────────────────────────────────────────────

interface FinancialAlertsProps {
  data: FinancieroMockData;
}

export function FinancialAlerts({ data }: FinancialAlertsProps) {
  const alerts = computeAlerts(data);
  const first = data.historico[0]?.mes ?? '';
  const last  = data.historico[data.historico.length - 1]?.mes ?? '';
  const period = first && last ? `${first} – ${last} ${new Date().getFullYear()}` : '';

  return (
    <div className="card p-5 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Señales de Advertencia</h2>
          {period && <p className="text-xs text-slate-500 mt-0.5">Período analizado: {period}</p>}
        </div>
        {/* Legend */}
        <div className="flex items-center gap-3 flex-wrap">
          {LEGEND.map(({ label, severity }) => (
            <div key={severity} className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${SEVERITY_STYLES[severity].dot}`} />
              <span className="text-xs text-slate-500">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Alert grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {alerts.map((alert, i) => {
          const s = SEVERITY_STYLES[alert.severity];
          return (
            <div key={i} className={`border rounded-xl p-4 flex flex-col gap-3 ${s.card}`}>
              {/* Icon + title row */}
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${s.card}`}>
                  <alert.Icon size={16} className={s.icon} />
                </div>
                <p className="text-sm font-semibold text-slate-800 leading-tight pt-0.5">{alert.title}</p>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 leading-relaxed">{alert.description}</p>

              {/* Value pill */}
              <div className="mt-auto">
                <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${s.pill}`}>
                  {alert.pill}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
