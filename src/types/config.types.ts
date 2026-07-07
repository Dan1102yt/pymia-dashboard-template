// ─── Field types for dynamic entity forms ───────────────────────────────────
export type FieldType = 'text' | 'number' | 'date' | 'select' | 'currency';

export interface FieldDefinition {
  key: string;
  label: string;
  type: FieldType;
  options?: string[];        // for select
  alertDaysThreshold?: number; // for date: warn N days before
  unit?: string;             // e.g. "kg", "hrs"
  showInCard?: boolean;      // show in card view (default true)
  showInTable?: boolean;     // show in table view (default true)
}

export interface EntityStatus {
  key: string;
  label: string;
  color: string; // tailwind bg class e.g. "bg-green-100 text-green-700"
  dot: string;   // dot color class e.g. "bg-green-500"
}

export interface EntityChecklist {
  items: string[];
}

export interface EntityEvent {
  date: string;  // ISO string
  description: string;
  user?: string;
}

export interface EntityMock {
  id: string;
  name: string;
  statusKey: string;
  fields: Record<string, string | number>;
  responsable?: string;
  checklist?: { label: string; done: boolean }[];
  events?: EntityEvent[];
  alertas?: string[];
}

// ─── Industry module config ──────────────────────────────────────────────────
export interface IndustriaConfig {
  entityName: string;        // "Máquina"
  entityNamePlural: string;  // "Máquinas"
  icon: string;              // lucide icon name
  fields: FieldDefinition[];
  statuses: EntityStatus[];
  hasChecklist?: boolean;
  defaultView?: 'cards' | 'table';
  entities: EntityMock[];
}

// ─── Financial mock data ─────────────────────────────────────────────────────
export interface MonthlyFinancial {
  mes: string;
  ingresos: number;
  egresos: number;
}

export interface FinancialCategory {
  nombre: string;
  monto: number;
}

export interface FinancieroMockData {
  historico: MonthlyFinancial[];
  categorias_ingresos: FinancialCategory[];
  categorias_egresos: FinancialCategory[];
}

// ─── CRM mock data ───────────────────────────────────────────────────────────
export interface Interaccion {
  fecha: string;
  tipo: 'llamada' | 'correo' | 'reunion' | 'whatsapp' | 'visita';
  nota: string;
}

export interface ClienteMock {
  id: string;
  nombre: string;
  empresa?: string;
  telefono: string;
  email: string;
  ciudad: string;
  ultimaCompra?: string;
  totalCompras: number;
  interacciones: Interaccion[];
  notas?: string;
}

// ─── Sales mock data ─────────────────────────────────────────────────────────
export type VentaEstado = 'pendiente' | 'aprobado' | 'facturado' | 'pagado';

export interface VentaItem {
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
}

export interface VentaMock {
  id: string;
  numero: string;
  clienteId: string;
  fecha: string;
  estado: VentaEstado;
  items: VentaItem[];
  total: number;
  notas?: string;
}

// ─── Client config (root) ────────────────────────────────────────────────────
export interface ClientColors {
  primary: string;   // hex
  secondary: string; // hex
  bg: string;        // hex
}

export interface ModulesConfig {
  financiero: boolean;
  clientes: boolean;
  ventas: boolean;
  industria: boolean;
  asistente: boolean;
}

export interface ClientConfig {
  clientName: string;
  clientSlogan?: string;
  logo?: string;        // URL or base64
  colors: ClientColors;
  modules: ModulesConfig;
  industria: IndustriaConfig;
  mockData: {
    financiero: FinancieroMockData;
    clientes: ClienteMock[];
    ventas: VentaMock[];
  };
}
