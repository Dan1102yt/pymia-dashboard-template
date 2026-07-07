import { useState } from 'react';
import { ShoppingCart, ChevronRight, Search } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';
import { clientConfig } from '../../config/client.config';
import type { VentaMock, VentaEstado } from '../../types/config.types';
import { format, parseISO, isValid } from 'date-fns';
import { es } from 'date-fns/locale';

const ESTADO_COLORS: Record<VentaEstado, { color: string; dot: string }> = {
  pendiente: { color: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
  aprobado: { color: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
  facturado: { color: 'bg-purple-100 text-purple-700', dot: 'bg-purple-500' },
  pagado: { color: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
};

const ESTADO_LABELS: Record<VentaEstado, string> = {
  pendiente: 'Pendiente', aprobado: 'Aprobado', facturado: 'Facturado', pagado: 'Pagado',
};

function fmtDate(d: string) {
  try { const p = parseISO(d); return isValid(p) ? format(p, "d MMM yyyy", { locale: es }) : d; } catch { return d; }
}

function VentaDetail({ venta, onClose }: { venta: VentaMock; onClose: () => void }) {
  const cliente = clientConfig.mockData.clientes.find(c => c.id === venta.clienteId);
  const estadoInfo = ESTADO_COLORS[venta.estado];

  return (
    <Modal open title={venta.numero} onClose={onClose}>
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <Badge label={ESTADO_LABELS[venta.estado]} colorClass={estadoInfo.color} dot={estadoInfo.dot} />
          <span className="text-sm text-slate-500">{fmtDate(venta.fecha)}</span>
        </div>

        {cliente && (
          <div className="bg-slate-50 rounded-xl p-3">
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide mb-1">Cliente</p>
            <p className="font-semibold text-slate-900">{cliente.nombre}</p>
            {cliente.empresa && <p className="text-xs text-slate-500">{cliente.empresa}</p>}
            <p className="text-xs text-slate-500">{cliente.telefono}</p>
          </div>
        )}

        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Ítems</p>
          <div className="space-y-2">
            {venta.items.map((item, i) => (
              <div key={i} className="flex justify-between items-start gap-3">
                <div className="flex-1">
                  <p className="text-sm text-slate-800">{item.descripcion}</p>
                  <p className="text-xs text-slate-500">{item.cantidad} × ${item.precioUnitario.toLocaleString('es-CO')}</p>
                </div>
                <p className="text-sm font-semibold text-slate-900 flex-shrink-0">
                  ${(item.cantidad * item.precioUnitario).toLocaleString('es-CO')}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center">
            <span className="text-sm font-bold text-slate-900">Total</span>
            <span className="text-lg font-bold" style={{ color: 'var(--color-primary)' }}>
              ${venta.total.toLocaleString('es-CO')}
            </span>
          </div>
        </div>

        {venta.notas && (
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
            <p className="text-xs text-amber-700">{venta.notas}</p>
          </div>
        )}
      </div>
    </Modal>
  );
}

export function VentasModule() {
  const [selected, setSelected] = useState<VentaMock | null>(null);
  const [search, setSearch] = useState('');
  const [filterEstado, setFilterEstado] = useState<VentaEstado | 'all'>('all');
  const ventas = clientConfig.mockData.ventas;
  const estados: VentaEstado[] = ['pendiente', 'aprobado', 'facturado', 'pagado'];

  const filtered = ventas.filter(v => {
    const cliente = clientConfig.mockData.clientes.find(c => c.id === v.clienteId);
    const matchSearch = `${v.numero} ${cliente?.nombre ?? ''} ${cliente?.empresa ?? ''}`.toLowerCase().includes(search.toLowerCase());
    const matchEstado = filterEstado === 'all' || v.estado === filterEstado;
    return matchSearch && matchEstado;
  });

  const totalPorEstado = Object.fromEntries(
    estados.map(e => [e, ventas.filter(v => v.estado === e)])
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Ventas / Facturación</h1>
          <p className="text-sm text-slate-500">{ventas.length} cotizaciones y pedidos</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 w-full sm:w-64">
          <Search size={15} className="text-slate-400 flex-shrink-0" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por número o cliente..."
            className="text-sm bg-transparent outline-none flex-1 placeholder-slate-400"
          />
        </div>
      </div>

      {/* Pipeline cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {estados.map(e => {
          const count = totalPorEstado[e].length;
          const monto = totalPorEstado[e].reduce((s, v) => s + v.total, 0);
          const { color, dot } = ESTADO_COLORS[e];
          return (
            <div
              key={e}
              className={`card p-4 cursor-pointer transition-all ${filterEstado === e ? 'ring-2 shadow-md' : 'hover:border-slate-300'}`}
              style={filterEstado === e ? { outline: `2px solid var(--color-primary)`, outlineOffset: '0px', borderColor: 'var(--color-primary)' } : {}}
              onClick={() => setFilterEstado(filterEstado === e ? 'all' : e)}
            >
              <Badge label={ESTADO_LABELS[e]} colorClass={color} dot={dot} size="sm" />
              <p className="text-2xl font-bold text-slate-900 mt-2">{count}</p>
              <p className="text-xs text-slate-500">${(monto / 1000000).toFixed(1)}M</p>
            </div>
          );
        })}
      </div>

      {/* Order list */}
      <div className="space-y-2">
        {filtered.map(venta => {
          const cliente = clientConfig.mockData.clientes.find(c => c.id === venta.clienteId);
          const { color, dot } = ESTADO_COLORS[venta.estado];
          return (
            <div
              key={venta.id}
              className="card p-4 cursor-pointer hover:shadow-md transition-shadow hover:border-slate-300 flex items-center gap-4"
              onClick={() => setSelected(venta)}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold text-slate-900">{venta.numero}</span>
                  <Badge label={ESTADO_LABELS[venta.estado]} colorClass={color} dot={dot} size="sm" />
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-slate-500">{cliente?.nombre ?? 'Cliente desconocido'}</span>
                  <span className="text-xs text-slate-400">{fmtDate(venta.fecha)}</span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold text-slate-900">${venta.total.toLocaleString('es-CO')}</p>
                <p className="text-xs text-slate-400">{venta.items.length} ítem{venta.items.length > 1 ? 's' : ''}</p>
              </div>
              <ChevronRight size={16} className="text-slate-400 flex-shrink-0" />
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="card p-12 text-center">
          <ShoppingCart size={32} className="text-slate-300 mx-auto mb-2" />
          <p className="text-sm text-slate-500">No se encontraron resultados</p>
        </div>
      )}

      {selected && <VentaDetail venta={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
