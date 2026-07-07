import { useState } from 'react';
import { Search, Phone, Mail, MapPin, MessageSquare, Clock, Users, Pencil, X, Check } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { clientConfig } from '../../config/client.config';
import type { ClienteMock, Interaccion } from '../../types/config.types';
import { format, parseISO, isValid } from 'date-fns';
import { es } from 'date-fns/locale';

const TIPO_ICON: Record<Interaccion['tipo'], string> = {
  llamada: '📞', correo: '✉️', reunion: '🤝', whatsapp: '💬', visita: '🏢',
};

function fmtDate(d: string) {
  try { const p = parseISO(d); return isValid(p) ? format(p, 'd MMM yyyy', { locale: es }) : d; } catch { return d; }
}

// ─── Reusable field components ────────────────────────────────────────────────

function ViewField({ icon, value, href }: { icon: React.ReactNode; value: string; href?: string }) {
  const content = (
    <div className="flex items-center gap-2 text-sm text-slate-700">
      <span className="text-slate-400 flex-shrink-0">{icon}</span>
      {value}
    </div>
  );
  if (href) return <a href={href} className="hover:text-blue-600 transition-colors">{content}</a>;
  return content;
}

function EditField({
  label, value, onChange, type = 'text', placeholder,
}: {
  label: string; value: string; onChange: (v: string) => void;
  type?: 'text' | 'email' | 'tel'; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-slate-400 focus:bg-white transition-colors"
      />
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

interface ClienteDetailModalProps {
  cliente: ClienteMock;
  onClose: () => void;
  onSave: (updated: ClienteMock) => void;
}

function ClienteDetailModal({ cliente, onClose, onSave }: ClienteDetailModalProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<ClienteMock>(cliente);

  // Sync draft if parent swaps the client (shouldn't happen, but safety net)
  // We intentionally don't use an effect here — draft is owned by this modal instance.

  const set = (key: keyof ClienteMock) => (value: string) =>
    setDraft(prev => ({ ...prev, [key]: value }));

  const handleSave = () => {
    onSave(draft);
    setEditing(false);
  };

  const handleCancel = () => {
    setDraft(cliente); // revert
    setEditing(false);
  };

  return (
    <Modal open title={editing ? `Editando: ${cliente.nombre}` : cliente.nombre} onClose={onClose} size="md">
      <div className="space-y-5">

        {editing ? (
          /* ── EDIT MODE ─────────────────────────────────────────────────── */
          <>
            <div className="grid grid-cols-1 gap-3">
              <EditField label="Nombre completo" value={draft.nombre} onChange={set('nombre')} placeholder="Nombre del contacto" />
              <EditField label="Empresa" value={draft.empresa ?? ''} onChange={set('empresa')} placeholder="Nombre de la empresa (opcional)" />
              <EditField label="Teléfono" value={draft.telefono} onChange={set('telefono')} type="tel" placeholder="3XXXXXXXXX" />
              <EditField label="Correo electrónico" value={draft.email} onChange={set('email')} type="email" placeholder="correo@ejemplo.com" />
              <EditField label="Ciudad" value={draft.ciudad} onChange={set('ciudad')} placeholder="Ciudad" />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Notas</label>
              <textarea
                value={draft.notas ?? ''}
                onChange={e => setDraft(prev => ({ ...prev, notas: e.target.value }))}
                placeholder="Observaciones sobre el cliente..."
                rows={3}
                className="w-full text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-slate-400 focus:bg-white transition-colors resize-none"
              />
            </div>

            <div className="flex gap-2 pt-1">
              <Button onClick={handleSave} className="flex-1 justify-center">
                <Check size={14} /> Guardar cambios
              </Button>
              <Button variant="secondary" onClick={handleCancel}>
                <X size={14} /> Cancelar
              </Button>
            </div>
          </>
        ) : (
          /* ── VIEW MODE ─────────────────────────────────────────────────── */
          <>
            {/* Contact info */}
            <div className="grid grid-cols-1 gap-2">
              {cliente.empresa && (
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <span className="font-medium text-slate-500">Empresa:</span>
                  {cliente.empresa}
                </div>
              )}
              <ViewField icon={<Phone size={14} />} value={cliente.telefono} href={`tel:${cliente.telefono}`} />
              {cliente.email && <ViewField icon={<Mail size={14} />} value={cliente.email} href={`mailto:${cliente.email}`} />}
              <ViewField icon={<MapPin size={14} />} value={cliente.ciudad} />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">Total compras</p>
                <p className="text-lg font-bold text-slate-900">${cliente.totalCompras.toLocaleString('es-CO')}</p>
              </div>
              {cliente.ultimaCompra && (
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">Última compra</p>
                  <p className="text-lg font-bold text-slate-900">{fmtDate(cliente.ultimaCompra)}</p>
                </div>
              )}
            </div>

            {/* Notes */}
            {cliente.notas && (
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
                <p className="text-xs font-medium text-amber-700 mb-1">Notas</p>
                <p className="text-sm text-slate-700">{cliente.notas}</p>
              </div>
            )}

            {/* Interaction history */}
            {cliente.interacciones.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Historial de interacciones</h3>
                <div className="space-y-3">
                  {cliente.interacciones.map((inter, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <span className="text-base">{TIPO_ICON[inter.tipo]}</span>
                        {i < cliente.interacciones.length - 1 && <div className="w-px flex-1 bg-slate-200 mt-1" />}
                      </div>
                      <div className="pb-3 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                            <Clock size={10} /> {fmtDate(inter.fecha)}
                          </span>
                          <span className="text-xs text-slate-400 capitalize">{inter.tipo}</span>
                        </div>
                        <p className="text-sm text-slate-700 mt-0.5">{inter.nota}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Edit button */}
            <div className="pt-1">
              <Button variant="secondary" onClick={() => setEditing(true)} className="w-full justify-center">
                <Pencil size={14} /> Editar información
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}

// ─── Main module ──────────────────────────────────────────────────────────────

export function ClientesModule() {
  const [clientes, setClientes] = useState<ClienteMock[]>(() => [...clientConfig.mockData.clientes]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<ClienteMock | null>(null);

  const filtered = clientes.filter(c =>
    `${c.nombre} ${c.empresa ?? ''} ${c.ciudad}`.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (updated: ClienteMock) => {
    setClientes(prev => prev.map(c => c.id === updated.id ? updated : c));
    setSelected(updated); // keep modal open showing fresh data
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Clientes / CRM</h1>
          <p className="text-sm text-slate-500">{clientes.length} clientes registrados</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 w-full sm:w-64">
          <Search size={15} className="text-slate-400 flex-shrink-0" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar cliente..."
            className="text-sm bg-transparent outline-none flex-1 placeholder-slate-400"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-slate-900">{clientes.length}</p>
          <p className="text-xs text-slate-500 mt-0.5">Clientes totales</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-slate-900">
            ${(clientes.reduce((s, c) => s + c.totalCompras, 0) / 1000000).toFixed(1)}M
          </p>
          <p className="text-xs text-slate-500 mt-0.5">Facturación acumulada</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-slate-900">
            {clientes.filter(c => c.interacciones.length > 0).length}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">Con historial activo</p>
        </div>
      </div>

      {/* Client list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(cliente => (
          <div
            key={cliente.id}
            className="card p-4 cursor-pointer hover:shadow-md transition-shadow hover:border-slate-300"
            onClick={() => setSelected(cliente)}
          >
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                {cliente.nombre.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 truncate">{cliente.nombre}</p>
                {cliente.empresa && <p className="text-xs text-slate-500 truncate">{cliente.empresa}</p>}
                <div className="flex items-center gap-1 mt-0.5">
                  <MapPin size={10} className="text-slate-400" />
                  <span className="text-xs text-slate-500">{cliente.ciudad}</span>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">Total compras</p>
                <p className="text-sm font-bold text-slate-900">${cliente.totalCompras.toLocaleString('es-CO')}</p>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <MessageSquare size={12} />
                <span>{cliente.interacciones.length} interac.</span>
              </div>
            </div>

            {cliente.ultimaCompra && (
              <p className="text-[10px] text-slate-400 mt-2">
                Última compra: {fmtDate(cliente.ultimaCompra)}
              </p>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="card p-12 text-center">
          <Users size={32} className="text-slate-300 mx-auto mb-2" />
          <p className="text-sm text-slate-500">No se encontraron clientes</p>
        </div>
      )}

      {selected && (
        <ClienteDetailModal
          cliente={selected}
          onClose={() => setSelected(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
