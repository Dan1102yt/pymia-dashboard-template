import type { FieldDefinition } from '../../types/config.types';
import { format, differenceInDays, parseISO, isValid } from 'date-fns';
import { es } from 'date-fns/locale';

export function formatFieldValue(val: string | number, field: FieldDefinition): string {
  if (val === undefined || val === null || val === '') return '—';

  if (field.type === 'currency') {
    const num = typeof val === 'string' ? parseFloat(val) : val;
    return `$${num.toLocaleString('es-CO')}`;
  }

  if (field.type === 'date') {
    try {
      const date = parseISO(String(val));
      if (!isValid(date)) return String(val);
      return format(date, 'dd MMM yyyy', { locale: es });
    } catch {
      return String(val);
    }
  }

  if (field.type === 'number') {
    const num = typeof val === 'string' ? parseFloat(val) : val;
    return num.toLocaleString('es-CO');
  }

  return String(val);
}

export function getDaysUntil(dateStr: string): number | null {
  try {
    const date = parseISO(dateStr);
    if (!isValid(date)) return null;
    return differenceInDays(date, new Date());
  } catch {
    return null;
  }
}
