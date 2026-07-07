import type { ClientConfig } from '../types/config.types';

export const retailConfig: ClientConfig = {
  clientName: 'Distribuidora El Condor',
  clientSlogan: 'Ferretería y materiales para construcción',
  colors: {
    primary: '#DC2626',
    secondary: '#6B7280',
    bg: '#FFF7ED',
  },
  modules: {
    financiero: true,
    clientes: true,
    ventas: true,
    industria: true,
    asistente: true,
  },
  industria: {
    entityName: 'Producto',
    entityNamePlural: 'Productos',
    icon: 'Package',
    defaultView: 'table',
    hasChecklist: false,
    fields: [
      { key: 'sku', label: 'SKU', type: 'text', showInCard: true, showInTable: true },
      { key: 'categoria', label: 'Categoría', type: 'select', options: ['Herramientas', 'Eléctrico', 'Plomería', 'Pinturas', 'Fijaciones', 'Construcción'], showInCard: true, showInTable: true },
      { key: 'stock', label: 'Stock actual', type: 'number', unit: 'und', showInCard: true, showInTable: true },
      { key: 'stockMinimo', label: 'Stock mínimo', type: 'number', unit: 'und', showInCard: true, showInTable: true },
      { key: 'precioCompra', label: 'Precio compra', type: 'currency', showInCard: false, showInTable: true },
      { key: 'precioVenta', label: 'Precio venta', type: 'currency', showInCard: true, showInTable: true },
      { key: 'proveedor', label: 'Proveedor', type: 'text', showInCard: false, showInTable: true },
      { key: 'ultimaReposicion', label: 'Última reposición', type: 'date', showInCard: false, showInTable: true },
      { key: 'proximaReposicion', label: 'Próxima reposición', type: 'date', alertDaysThreshold: 5, showInCard: false, showInTable: true },
    ],
    statuses: [
      { key: 'disponible', label: 'Disponible', color: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
      { key: 'stockbajo', label: 'Stock bajo', color: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
      { key: 'agotado', label: 'Agotado', color: 'bg-red-100 text-red-700', dot: 'bg-red-500' },
    ],
    entities: [
      {
        id: 'p1', name: 'Taladro percutor 600W', statusKey: 'disponible',
        responsable: 'Bodega principal',
        fields: { sku: 'HER-TAL-001', categoria: 'Herramientas', stock: 14, stockMinimo: 5, precioCompra: 185000, precioVenta: 289000, proveedor: 'Herramientas Pro S.A.', ultimaReposicion: '2026-06-01', proximaReposicion: '2026-08-01' },
        events: [{ date: '2026-06-01', description: 'Reposición de 10 unidades. Proveedor Herramientas Pro.', user: 'Almacén' }, { date: '2026-05-05', description: 'Stock bajo. Se realizó pedido a proveedor.', user: 'Almacén' }],
      },
      {
        id: 'p2', name: 'Cable THHN #12 AWG (m)', statusKey: 'disponible',
        responsable: 'Bodega principal',
        fields: { sku: 'ELE-CAB-012', categoria: 'Eléctrico', stock: 450, stockMinimo: 100, precioCompra: 2800, precioVenta: 4200, proveedor: 'Cablex Colombia', ultimaReposicion: '2026-06-15', proximaReposicion: '2026-09-15' },
        events: [{ date: '2026-06-15', description: 'Ingreso de 500m. Precio actualizado por alza en cobre.', user: 'Almacén' }],
      },
      {
        id: 'p3', name: 'Tubo PVC presión 1/2" x 6m', statusKey: 'stockbajo',
        responsable: 'Bodega principal',
        fields: { sku: 'PLO-TUB-050', categoria: 'Plomería', stock: 8, stockMinimo: 20, precioCompra: 18500, precioVenta: 28000, proveedor: 'Amanco Colombia', ultimaReposicion: '2026-05-20', proximaReposicion: '2026-07-10' },
        events: [{ date: '2026-07-01', description: 'Alerta stock bajo. Pedido realizado a Amanco.', user: 'Almacén' }, { date: '2026-05-20', description: 'Reposición de 30 unidades.', user: 'Almacén' }],
      },
      {
        id: 'p4', name: 'Pintura vinilo int/ext blanca 5L', statusKey: 'disponible',
        responsable: 'Bodega principal',
        fields: { sku: 'PIN-VIN-BLA5', categoria: 'Pinturas', stock: 32, stockMinimo: 10, precioCompra: 58000, precioVenta: 88000, proveedor: 'Corona S.A.', ultimaReposicion: '2026-06-10', proximaReposicion: '2026-08-10' },
        events: [{ date: '2026-06-10', description: 'Reposición temporada alta. 20 cubetas ingresadas.', user: 'Almacén' }],
      },
      {
        id: 'p5', name: 'Tornillo tirafondo 3/4" x 100u', statusKey: 'agotado',
        responsable: 'Bodega principal',
        fields: { sku: 'FIJ-TOR-034', categoria: 'Fijaciones', stock: 0, stockMinimo: 20, precioCompra: 12000, precioVenta: 18500, proveedor: 'Fijaciones Andinas', ultimaReposicion: '2026-04-15', proximaReposicion: '2026-07-08' },
        events: [{ date: '2026-07-02', description: 'AGOTADO. Pedido urgente realizado. Llegada estimada 8 jul.', user: 'Almacén' }, { date: '2026-04-15', description: 'Reposición de 50 paquetes. Mayor rotación de lo esperado.', user: 'Almacén' }],
      },
      {
        id: 'p6', name: 'Cemento Argos 50kg', statusKey: 'disponible',
        responsable: 'Bodega externa',
        fields: { sku: 'CON-CEM-ARG50', categoria: 'Construcción', stock: 85, stockMinimo: 30, precioCompra: 38000, precioVenta: 54000, proveedor: 'Distribuidora Argos Cali', ultimaReposicion: '2026-06-25', proximaReposicion: '2026-08-01' },
        events: [{ date: '2026-06-25', description: 'Ingreso de paleta: 100 bultos. Descuento por volumen.', user: 'Almacén' }],
      },
    ],
  },
  mockData: {
    financiero: {
      historico: [
        { mes: 'Ene', ingresos: 38200000, egresos: 27400000 },
        { mes: 'Feb', ingresos: 42100000, egresos: 30100000 },
        { mes: 'Mar', ingresos: 56800000, egresos: 39200000 },
        { mes: 'Abr', ingresos: 49300000, egresos: 34700000 },
        { mes: 'May', ingresos: 61200000, egresos: 42800000 },
        { mes: 'Jun', ingresos: 58400000, egresos: 40500000 },
      ],
      categorias_ingresos: [
        { nombre: 'Herramientas', monto: 16800000 },
        { nombre: 'Materiales construcción', monto: 22400000 },
        { nombre: 'Eléctrico/Plomería', monto: 12600000 },
        { nombre: 'Pinturas', monto: 6600000 },
      ],
      categorias_egresos: [
        { nombre: 'Compra de mercancía', monto: 28500000 },
        { nombre: 'Nómina', monto: 7200000 },
        { nombre: 'Arriendo y servicios', monto: 3400000 },
        { nombre: 'Fletes y logística', monto: 1400000 },
      ],
    },
    clientes: [
      { id: 'c1', nombre: 'Constructora RyH S.A.S', empresa: 'Constructora RyH', telefono: '6015674321', email: 'compras@ryhconstruye.co', ciudad: 'Bogotá', ultimaCompra: '2026-07-01', totalCompras: 82400000, notas: 'Cliente ancla. Pedidos semanales. Requiere crédito a 30 días.', interacciones: [{ fecha: '2026-07-01', tipo: 'llamada', nota: 'Pedido semanal confirmado. Solicitaron cemento y varilla.' }] },
      { id: 'c2', nombre: 'Maestro Bernardo Cárdenas', telefono: '3154329876', email: '', ciudad: 'Cali', ultimaCompra: '2026-06-30', totalCompras: 18200000, interacciones: [{ fecha: '2026-06-30', tipo: 'visita', nota: 'Compra en mostrador. Obra de ampliación vivienda unifamiliar.' }] },
    ],
    ventas: [
      { id: 'v1', numero: 'FAC-2026-312', clienteId: 'c1', fecha: '2026-07-01', estado: 'facturado', items: [{ descripcion: 'Cemento Argos 50kg', cantidad: 20, precioUnitario: 54000 }, { descripcion: 'Varilla 1/2" x 6m', cantidad: 15, precioUnitario: 32000 }], total: 1560000 },
      { id: 'v2', numero: 'FAC-2026-311', clienteId: 'c2', fecha: '2026-06-30', estado: 'pagado', items: [{ descripcion: 'Pintura vinilo int/ext blanca 5L', cantidad: 4, precioUnitario: 88000 }, { descripcion: 'Brocha 4" premium', cantidad: 2, precioUnitario: 28000 }], total: 408000 },
    ],
  },
};
