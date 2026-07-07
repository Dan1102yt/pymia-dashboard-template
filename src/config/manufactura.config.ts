import type { ClientConfig } from '../types/config.types';

export const manufacturaConfig: ClientConfig = {
  clientName: 'Industrias Caucho del Valle',
  clientSlogan: 'Moldeado y vulcanizado de precisión',
  colors: {
    primary: '#1D4ED8',
    secondary: '#475569',
    bg: '#F1F5F9',
  },
  modules: {
    financiero: true,
    clientes: true,
    ventas: true,
    industria: true,
    asistente: true,
  },
  industria: {
    entityName: 'Máquina',
    entityNamePlural: 'Máquinas',
    icon: 'Cog',
    defaultView: 'cards',
    hasChecklist: true,
    fields: [
      { key: 'tipo', label: 'Tipo', type: 'select', options: ['Inyectora', 'Vulcanizadora', 'Mezcladora', 'Prensa'], showInCard: true, showInTable: true },
      { key: 'operario', label: 'Operario asignado', type: 'text', showInCard: true, showInTable: true },
      { key: 'ultimoMantenimiento', label: 'Último mantenimiento', type: 'date', showInCard: true, showInTable: true },
      { key: 'proximoMantenimiento', label: 'Próximo mantenimiento', type: 'date', alertDaysThreshold: 7, showInCard: true, showInTable: true },
      { key: 'horasUso', label: 'Horas de uso', type: 'number', unit: 'hrs', showInCard: false, showInTable: true },
      { key: 'ubicacion', label: 'Planta / Sector', type: 'text', showInCard: true, showInTable: true },
      { key: 'costoMantenimiento', label: 'Costo último mant.', type: 'currency', showInCard: false, showInTable: true },
    ],
    statuses: [
      { key: 'operativa', label: 'Operativa', color: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
      { key: 'mantenimiento', label: 'En mantenimiento', color: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
      { key: 'alerta', label: 'Alerta', color: 'bg-red-100 text-red-700', dot: 'bg-red-500' },
    ],
    entities: [
      {
        id: 'm1', name: 'Inyectora #1', statusKey: 'operativa',
        responsable: 'Carlos Rincón',
        fields: { tipo: 'Inyectora', operario: 'Carlos Rincón', ultimoMantenimiento: '2026-05-15', proximoMantenimiento: '2026-07-15', horasUso: 1240, ubicacion: 'Planta A - Sector 1', costoMantenimiento: 850000 },
        checklist: [
          { label: 'Revisión de aceite hidráulico', done: true },
          { label: 'Calibración de temperatura', done: true },
          { label: 'Limpieza de moldes', done: false },
        ],
        events: [
          { date: '2026-05-15', description: 'Mantenimiento preventivo completado. Cambio de aceite y ajuste de presión.', user: 'Carlos Rincón' },
          { date: '2026-04-02', description: 'Falla en resistencia calefactora. Reemplazo realizado.', user: 'Técnico externo' },
          { date: '2026-03-10', description: 'Mantenimiento preventivo de rutina OK.', user: 'Carlos Rincón' },
        ],
      },
      {
        id: 'm2', name: 'Inyectora #2', statusKey: 'mantenimiento',
        responsable: 'Pedro Gutiérrez',
        fields: { tipo: 'Inyectora', operario: 'Pedro Gutiérrez', ultimoMantenimiento: '2026-07-01', proximoMantenimiento: '2026-09-01', horasUso: 980, ubicacion: 'Planta A - Sector 2', costoMantenimiento: 1200000 },
        checklist: [
          { label: 'Revisión de aceite hidráulico', done: true },
          { label: 'Calibración de temperatura', done: false },
          { label: 'Reemplazo de sello de cilindro', done: false },
        ],
        events: [
          { date: '2026-07-01', description: 'Ingresó a mantenimiento correctivo. Fuga detectada en cilindro principal.', user: 'Pedro Gutiérrez' },
          { date: '2026-05-20', description: 'Mantenimiento preventivo OK.', user: 'Pedro Gutiérrez' },
        ],
      },
      {
        id: 'm3', name: 'Vulcanizadora #1', statusKey: 'operativa',
        responsable: 'Ana Morales',
        fields: { tipo: 'Vulcanizadora', operario: 'Ana Morales', ultimoMantenimiento: '2026-06-01', proximoMantenimiento: '2026-07-10', horasUso: 2100, ubicacion: 'Planta B - Sector 1', costoMantenimiento: 650000 },
        checklist: [
          { label: 'Verificación de presión de vapor', done: true },
          { label: 'Inspección de sellos', done: true },
        ],
        events: [
          { date: '2026-06-01', description: 'Mantenimiento preventivo. Reemplazo de empaque de vapor.', user: 'Ana Morales' },
          { date: '2026-04-15', description: 'Revisión de termostatos. Todo OK.', user: 'Ana Morales' },
          { date: '2026-03-05', description: 'Ajuste de presión de platos.', user: 'Técnico externo' },
        ],
      },
      {
        id: 'm4', name: 'Vulcanizadora #2', statusKey: 'alerta',
        responsable: 'Luis Herrera',
        fields: { tipo: 'Vulcanizadora', operario: 'Luis Herrera', ultimoMantenimiento: '2026-03-15', proximoMantenimiento: '2026-07-08', horasUso: 3400, ubicacion: 'Planta B - Sector 2', costoMantenimiento: 420000 },
        checklist: [
          { label: 'Verificación de presión de vapor', done: false },
          { label: 'Inspección de sellos', done: false },
        ],
        events: [
          { date: '2026-07-03', description: 'Temperatura irregular detectada. Requiere revisión urgente.', user: 'Luis Herrera' },
          { date: '2026-03-15', description: 'Mantenimiento preventivo realizado.', user: 'Luis Herrera' },
        ],
      },
      {
        id: 'm5', name: 'Mezcladora Industrial', statusKey: 'operativa',
        responsable: 'Jhon Castaño',
        fields: { tipo: 'Mezcladora', operario: 'Jhon Castaño', ultimoMantenimiento: '2026-05-28', proximoMantenimiento: '2026-08-28', horasUso: 1870, ubicacion: 'Planta A - Preparación', costoMantenimiento: 380000 },
        checklist: [
          { label: 'Lubricación de rodamientos', done: true },
          { label: 'Tensión de correas', done: true },
          { label: 'Limpieza de cámara', done: true },
        ],
        events: [
          { date: '2026-05-28', description: 'Mantenimiento preventivo completo. Cambio de correas de transmisión.', user: 'Jhon Castaño' },
          { date: '2026-04-10', description: 'Lubricación de rodamientos y revisión general.', user: 'Jhon Castaño' },
        ],
      },
    ],
  },
  mockData: {
    financiero: {
      historico: [
        { mes: 'Ene', ingresos: 48500000, egresos: 32100000 },
        { mes: 'Feb', ingresos: 52300000, egresos: 33800000 },
        { mes: 'Mar', ingresos: 61200000, egresos: 38500000 },
        { mes: 'Abr', ingresos: 55800000, egresos: 35200000 },
        { mes: 'May', ingresos: 67400000, egresos: 41300000 },
        { mes: 'Jun', ingresos: 71900000, egresos: 44100000 },
      ],
      categorias_ingresos: [
        { nombre: 'Piezas moldeadas', monto: 35800000 },
        { nombre: 'Vulcanizado', monto: 22400000 },
        { nombre: 'Reparaciones', monto: 9600000 },
        { nombre: 'Otros', monto: 4100000 },
      ],
      categorias_egresos: [
        { nombre: 'Materia prima (caucho)', monto: 18200000 },
        { nombre: 'Nómina (14 op.)', monto: 15400000 },
        { nombre: 'Energía', monto: 5200000 },
        { nombre: 'Mantenimiento', monto: 3100000 },
        { nombre: 'Otros', monto: 2200000 },
      ],
    },
    clientes: [
      { id: 'c1', nombre: 'Jorge Sánchez', empresa: 'Automotores del Pacífico', telefono: '3124567890', email: 'jorge@autopac.com', ciudad: 'Cali', ultimaCompra: '2026-06-15', totalCompras: 24800000, notas: 'Compra mensual fija. Requiere factura electrónica.', interacciones: [{ fecha: '2026-06-15', tipo: 'llamada', nota: 'Confirmó pedido de junio. 400 sellos de caucho.' }, { fecha: '2026-05-20', tipo: 'whatsapp', nota: 'Consulta sobre nuevos modelos de empaque.' }] },
      { id: 'c2', nombre: 'María Fernanda Ospina', empresa: 'Industrias Ospina Hnos', telefono: '3157894561', email: 'mfernanda@ospina.co', ciudad: 'Medellín', ultimaCompra: '2026-06-28', totalCompras: 38500000, notas: 'Cliente preferencial. Descuento del 8%.', interacciones: [{ fecha: '2026-06-28', tipo: 'reunion', nota: 'Reunión presencial. Negociaron volumen para Q3 2026.' }, { fecha: '2026-05-10', tipo: 'correo', nota: 'Envío de catálogo actualizado de productos.' }] },
      { id: 'c3', nombre: 'Ricardo Peña', empresa: 'Talleres Peña & Asociados', telefono: '3209876543', email: 'rpeña@talleresp.com', ciudad: 'Bogotá', ultimaCompra: '2026-05-30', totalCompras: 12300000, interacciones: [{ fecha: '2026-05-30', tipo: 'whatsapp', nota: 'Pago recibido del pedido #P-2026-042.' }] },
      { id: 'c4', nombre: 'Claudia Ríos', empresa: 'Maquinaria Industrial del Norte', telefono: '3011234567', email: 'crios@maqnorte.com', ciudad: 'Barranquilla', ultimaCompra: '2026-06-10', totalCompras: 19600000, notas: 'Nuevos en Q1 2026. Alto potencial de crecimiento.', interacciones: [{ fecha: '2026-06-10', tipo: 'correo', nota: 'Confirmación de pedido. Requieren entrega exprés.' }, { fecha: '2026-04-05', tipo: 'llamada', nota: 'Primera compra. Muestras de empaques industriales.' }] },
      { id: 'c5', nombre: 'Andrés Castillo', empresa: 'Castillo Autopartes', telefono: '3168765432', email: 'acastillo@cautopartes.com', ciudad: 'Bucaramanga', ultimaCompra: '2026-06-22', totalCompras: 31200000, interacciones: [{ fecha: '2026-06-22', tipo: 'reunion', nota: 'Visita a planta. Quedaron satisfechos con capacidad productiva.' }, { fecha: '2026-05-15', tipo: 'llamada', nota: 'Queja por retraso en entrega. Gestionado con área logística.' }] },
    ],
    ventas: [
      { id: 'v1', numero: 'COT-2026-058', clienteId: 'c1', fecha: '2026-06-28', estado: 'pagado', items: [{ descripcion: 'Sellos de caucho 80mm', cantidad: 200, precioUnitario: 45000 }, { descripcion: 'Empaques O-Ring industriales', cantidad: 500, precioUnitario: 8500 }], total: 13250000 },
      { id: 'v2', numero: 'COT-2026-059', clienteId: 'c2', fecha: '2026-07-01', estado: 'aprobado', items: [{ descripcion: 'Piezas moldeadas custom (lote)', cantidad: 1, precioUnitario: 8500000 }, { descripcion: 'Vulcanizado de rodillos', cantidad: 12, precioUnitario: 380000 }], total: 13060000 },
      { id: 'v3', numero: 'COT-2026-060', clienteId: 'c3', fecha: '2026-07-03', estado: 'pendiente', items: [{ descripcion: 'Mangueras de caucho 1"', cantidad: 80, precioUnitario: 125000 }], total: 10000000 },
      { id: 'v4', numero: 'COT-2026-057', clienteId: 'c4', fecha: '2026-06-20', estado: 'facturado', items: [{ descripcion: 'Perfiles de caucho EPDM (m)', cantidad: 150, precioUnitario: 28000 }, { descripcion: 'Topes antivibración', cantidad: 60, precioUnitario: 42000 }], total: 6720000 },
      { id: 'v5', numero: 'COT-2026-055', clienteId: 'c5', fecha: '2026-06-10', estado: 'pagado', items: [{ descripcion: 'Kit de empaques motor', cantidad: 30, precioUnitario: 185000 }], total: 5550000 },
    ],
  },
};
