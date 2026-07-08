import { useState } from 'react';
import { ShoppingCart, ChevronRight, Search, Plus, Trash2, Check, X } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Toast } from '../../components/ui/Toast';
import { useToast } from '../../hooks/useToast';
import { clientConfig } from '../../config/client.config';
import type { VentaMock, VentaEstado, VentaItem } from '../../types/config.types';
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

// ─── New sale form ────────────────────────────────────────────────────────────

interface DraftItem { descripcion: string; cantidad: string; precioUnitario: string }

const EMPTY_ITEM: DraftItem = { descripcion: '', cantidad: '', precioUnitario: '' };

interface VentaFormModalProps {
  nextNumero: string;
  onClose: () => void;
  onCreate: (venta: VentaMock) => void;
}

function VentaFormModal({ nextNumero, onClose, onCreate }: VentaFormModalProps) {
  const clientes = clientConfig.mockData.clientes;
  const estados: VentaEstado[] = ['pendiente', 'aprobado', 'facturado', 'pagado'];

  const [clienteId, setClienteId] = useState('');
  const [estado, setEstado] = useState<VentaEstado>('pendiente');
  const [monto, setMonto] = useState('');
  const [items, setItems] = useState<DraftItem[]>([{ ...EMPTY_ITEM }]);
  const [notas, setNotas] = useState('');
  const [errors, setErrors] = useState<{ clienteId?: string; monto?: string }>({});

  const updateItem = (i: number, patch: Partial<DraftItem>) =>
    setItems(prev => prev.map((it, idx) => idx === i ? { ...it, ...patch } : it));

  const addItem = () => setItems(prev => [...prev, { ...EMPTY_ITEM }]);
  const removeItem = (i: number) => setItems(prev => prev.filter((_, idx) => idx !== i));

  const handleSave = () => {
    const nextErrors: typeof errors = {};
    const montoNum = parseFloat(monto);
    if (!clienteId) nextErrors.clienteId = 'Selecciona un cliente';
    if (!monto || isNaN(montoNum) || montoNum <= 0) nextErrors.monto = 'Ingresa un monto válido';

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const cleanItems: VentaItem[] = items
      .filter(it => it.descripcion.trim() !== '')
      .map(it => ({
        descripcion: it.descripcion.trim(),
        cantidad: parseFloat(it.cantidad) || 0,
        precioUnitario: parseFloat(it.precioUnitario) || 0,
      }));

    onCreate({
      id: `v-${Date.now()}`,
      numero: nextNumero,
      clienteId,
      fecha: format(new Date(), 'yyyy-MM-dd'),
      estado,
      items: cleanItems,
      total: montoNum,
      notas: notas.trim() || undefined,
    });
  };

  return (
    <Modal open title="Nueva venta" onClose={onClose} size="md">
      <div className="space-y-4">
        <div>
          <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Cliente</label>
          <select
            value={clienteId}
            onChange={e => setClienteId(e.target.value)}
            className={`w-full text-sm text-slate-800 bg-slate-50 border rounded-lg px-3 py-2.5 min-h-[44px] outline-none focus:bg-white transition-colors ${errors.clienteId ? 'border-red-300' : 'border-slate-200 focus:border-slate-400'}`}
          >
            <option value="">Selecciona un cliente...</option>
            {clientes.map(c => (
              <option key={c.id} value={c.id}>{c.nombre}{c.empresa ? ` (${c.empresa})` : ''}</option>
            ))}
          </select>
          {errors.clienteId && <p className="text-xs text-red-600 mt-1">{errors.clienteId}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Estado inicial</label>
            <select
              value={estado}
              onChange={e => setEstado(e.target.value as VentaEstado)}
              className="w-full text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 min-h-[44px] outline-none focus:border-slate-400 focus:bg-white transition-colors"
            >
              {estados.map(e => (
                <option key={e} value={e}>{ESTADO_LABELS[e]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Monto total</label>
            <input
              type="number"
              value={monto}
              onChange={e => setMonto(e.target.value)}
              placeholder="0"
              className={`w-full text-sm text-slate-800 bg-slate-50 border rounded-lg px-3 py-2.5 min-h-[44px] outline-none focus:bg-white transition-colors ${errors.monto ? 'border-red-300' : 'border-slate-200 focus:border-slate-400'}`}
            />
            {errors.monto && <p className="text-xs text-red-600 mt-1">{errors.monto}</p>}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Ítems (opcional)</label>
            <button type="button" onClick={addItem} className="text-xs font-medium flex items-center gap-1 min-h-[32px]" style={{ color: 'var(--color-primary)' }}>
              <Plus size={13} /> Agregar ítem
            </button>
          </div>
          <div className="space-y-2">
            {items.map((item, i) => (
              <div key={i} className="flex gap-2 items-start">
                <input
                  value={item.descripcion}
                  onChange={e => updateItem(i, { descripcion: e.target.value })}
                  placeholder="Descripción"
                  className="flex-1 min-w-0 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 min-h-[44px] outline-none focus:border-slate-400 focus:bg-white transition-colors"
                />
                <input
                  type="number"
                  value={item.cantidad}
                  onChange={e => updateItem(i, { cantidad: e.target.value })}
                  placeholder="Cant."
                  className="w-16 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-2 py-2.5 min-h-[44px] outline-none focus:border-slate-400 focus:bg-white transition-colors"
                />
                <input
                  type="number"
                  value={item.precioUnitario}
                  onChange={e => updateItem(i, { precioUnitario: e.target.value })}
                  placeholder="Precio"
                  className="w-24 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-2 py-2.5 min-h-[44px] outline-none focus:border-slate-400 focus:bg-white transition-colors"
                />
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(i)}
                    className="min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-400 hover:text-red-500 flex-shrink-0"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Notas</label>
          <textarea
            value={notas}
            onChange={e => setNotas(e.target.value)}
            placeholder="Observaciones (opcional)"
            rows={2}
            className="w-full text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-slate-400 focus:bg-white transition-colors resize-none"
          />
        </div>

        <div className="flex gap-2 pt-1">
          <Button onClick={handleSave} className="flex-1 justify-center">
            <Check size={14} /> Guardar venta
          </Button>
          <Button variant="secondary" onClick={onClose}>
            <X size={14} /> Cancelar
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export function VentasModule() {
  const [ventas, setVentas] = useState<VentaMock[]>(() => [...clientConfig.mockData.ventas]);
  const [selected, setSelected] = useState<VentaMock | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [filterEstado, setFilterEstado] = useState<VentaEstado | 'all'>('all');
  const toast = useToast();
  const estados: VentaEstado[] = ['pendiente', 'aprobado', 'facturado', 'pagado'];

  const handleCreate = (venta: VentaMock) => {
    setVentas(prev => [venta, ...prev]);
    setShowForm(false);
    toast.show('Venta registrada correctamente');
  };

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
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 flex-1 min-w-0 sm:w-64 sm:flex-none">
            <Search size={15} className="text-slate-400 flex-shrink-0" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por número o cliente..."
              className="text-sm bg-transparent outline-none flex-1 placeholder-slate-400"
            />
          </div>
          <Button onClick={() => setShowForm(true)} size="sm" className="flex-shrink-0">
            <Plus size={15} /> Nueva venta
          </Button>
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

      {showForm && (
        <VentaFormModal
          nextNumero={`FAC-${new Date().getFullYear()}-${String(ventas.length + 1).padStart(3, '0')}`}
          onClose={() => setShowForm(false)}
          onCreate={handleCreate}
        />
      )}

      <Toast message={toast.message} onDismiss={toast.dismiss} />
    </div>
  );
}
