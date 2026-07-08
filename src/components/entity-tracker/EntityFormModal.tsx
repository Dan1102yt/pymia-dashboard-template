import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import type { EntityMock, FieldDefinition, IndustriaConfig } from '../../types/config.types';

interface EntityFormModalProps {
  config: IndustriaConfig;
  onClose: () => void;
  onCreate: (entity: EntityMock) => void;
}

// The config doesn't carry grammatical gender, so this leans on the common Spanish
// pattern of feminine nouns ending in "a" (Máquina, Reserva) vs. masculine otherwise
// (Producto) to agree "Nueva/Nuevo" and "creada/creado" with the entity name.
function isFeminineNoun(entityName: string): boolean {
  return entityName.trim().toLowerCase().endsWith('a');
}

function newEntityLabel(entityName: string): string {
  return isFeminineNoun(entityName) ? `Nueva ${entityName}` : `Nuevo ${entityName}`;
}

function emptyFieldValues(fields: FieldDefinition[]): Record<string, string> {
  return Object.fromEntries(fields.map(f => [f.key, '']));
}

function inputClass(hasError: boolean) {
  return `w-full text-sm text-slate-800 bg-slate-50 border rounded-lg px-3 py-2.5 min-h-[44px] outline-none focus:bg-white transition-colors ${hasError ? 'border-red-300' : 'border-slate-200 focus:border-slate-400'}`;
}

export { newEntityLabel, isFeminineNoun };

export function EntityFormModal({ config, onClose, onCreate }: EntityFormModalProps) {
  const [name, setName] = useState('');
  const [statusKey, setStatusKey] = useState(config.statuses[0]?.key ?? '');
  const [responsable, setResponsable] = useState('');
  const [fieldValues, setFieldValues] = useState<Record<string, string>>(() => emptyFieldValues(config.fields));
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setField = (key: string) => (value: string) =>
    setFieldValues(prev => ({ ...prev, [key]: value }));

  const handleSave = () => {
    const nextErrors: Record<string, string> = {};
    if (!name.trim()) nextErrors.name = 'El nombre es obligatorio';
    config.fields.forEach(f => {
      if (!String(fieldValues[f.key] ?? '').trim()) nextErrors[f.key] = 'Campo obligatorio';
    });

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const fields: Record<string, string | number> = {};
    config.fields.forEach(f => {
      const raw = fieldValues[f.key];
      fields[f.key] = (f.type === 'number' || f.type === 'currency') ? parseFloat(raw) : raw;
    });

    onCreate({
      id: `entity-${Date.now()}`,
      name: name.trim(),
      statusKey,
      responsable: responsable.trim() || undefined,
      fields,
    });
  };

  return (
    <Modal open title={newEntityLabel(config.entityName)} onClose={onClose} size="md">
      <div className="space-y-4">
        <div>
          <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Nombre</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder={`Nombre de ${config.entityName.toLowerCase()}`}
            className={inputClass(!!errors.name)}
          />
          {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Estado</label>
            <select value={statusKey} onChange={e => setStatusKey(e.target.value)} className={inputClass(false)}>
              {config.statuses.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Responsable</label>
            <input
              value={responsable}
              onChange={e => setResponsable(e.target.value)}
              placeholder="Opcional"
              className={inputClass(false)}
            />
          </div>
        </div>

        {config.fields.map(field => (
          <div key={field.key}>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">
              {field.label}{field.unit ? ` (${field.unit})` : ''}
            </label>
            {field.type === 'select' ? (
              <select
                value={fieldValues[field.key] ?? ''}
                onChange={e => setField(field.key)(e.target.value)}
                className={inputClass(!!errors[field.key])}
              >
                <option value="">Selecciona...</option>
                {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            ) : (
              <input
                type={field.type === 'date' ? 'date' : (field.type === 'number' || field.type === 'currency') ? 'number' : 'text'}
                value={fieldValues[field.key] ?? ''}
                onChange={e => setField(field.key)(e.target.value)}
                placeholder={field.label}
                className={inputClass(!!errors[field.key])}
              />
            )}
            {errors[field.key] && <p className="text-xs text-red-600 mt-1">{errors[field.key]}</p>}
          </div>
        ))}

        <div className="flex gap-2 pt-1">
          <Button onClick={handleSave} className="flex-1 justify-center">
            <Check size={14} /> Guardar
          </Button>
          <Button variant="secondary" onClick={onClose}>
            <X size={14} /> Cancelar
          </Button>
        </div>
      </div>
    </Modal>
  );
}
