import type { ClientConfig } from '../types/config.types';

export const turismoConfig: ClientConfig = {
  clientName: 'Posada El Peñón',
  clientSlogan: 'Hospedaje & ecoturismo en Guatapé',
  colors: {
    primary: '#0D9488',
    secondary: '#6B7280',
    bg: '#F0FDFA',
  },
  modules: {
    financiero: true,
    clientes: true,
    ventas: false,
    industria: true,
    asistente: true,
  },
  industria: {
    entityName: 'Reserva',
    entityNamePlural: 'Reservas',
    icon: 'CalendarCheck',
    defaultView: 'table',
    hasChecklist: true,
    fields: [
      { key: 'checkIn', label: 'Check-in', type: 'date', alertDaysThreshold: 2, showInCard: true, showInTable: true },
      { key: 'checkOut', label: 'Check-out', type: 'date', showInCard: true, showInTable: true },
      { key: 'huespedes', label: 'Huéspedes', type: 'number', showInCard: true, showInTable: true },
      { key: 'habitacion', label: 'Habitación / Cabaña', type: 'select', options: ['Habitación Estándar', 'Habitación Deluxe', 'Cabaña Familiar', 'Cabaña Vista Lago', 'Suite El Peñón'], showInCard: true, showInTable: true },
      { key: 'plan', label: 'Plan', type: 'select', options: ['Solo alojamiento', '2D1N Todo incluido', '3D2N Todo incluido', 'Semana completa'], showInCard: true, showInTable: true },
      { key: 'valorTotal', label: 'Valor total', type: 'currency', showInCard: true, showInTable: true },
      { key: 'anticipo', label: 'Anticipo recibido', type: 'currency', showInCard: false, showInTable: true },
      { key: 'origen', label: 'Medio de reserva', type: 'select', options: ['Directo / WhatsApp', 'Booking.com', 'Instagram', 'Airbnb', 'Referido'], showInCard: false, showInTable: true },
    ],
    statuses: [
      { key: 'confirmada', label: 'Confirmada', color: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
      { key: 'encurso', label: 'En curso', color: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
      { key: 'finalizada', label: 'Finalizada', color: 'bg-slate-100 text-slate-600', dot: 'bg-slate-400' },
      { key: 'cancelada', label: 'Cancelada', color: 'bg-red-100 text-red-700', dot: 'bg-red-500' },
    ],
    entities: [
      {
        id: 'r1', name: 'Familia Rodríguez', statusKey: 'confirmada',
        responsable: 'Marcela (recepción)',
        fields: { checkIn: '2026-07-12', checkOut: '2026-07-14', huespedes: 4, habitacion: 'Cabaña Familiar', plan: '2D1N Todo incluido', valorTotal: 980000, anticipo: 294000, origen: 'Directo / WhatsApp' },
        checklist: [{ label: 'Anticipo recibido (30%)', done: true }, { label: 'Confirmación enviada por WhatsApp', done: true }, { label: 'Habitación asignada', done: true }, { label: 'Kit bienvenida preparado', done: false }],
        events: [{ date: '2026-07-04', description: 'Reserva confirmada. Anticipo recibido $294.000 vía Nequi.', user: 'Marcela' }, { date: '2026-07-05', description: 'Enviado mensaje de bienvenida con indicaciones de llegada.', user: 'Marcela' }],
      },
      {
        id: 'r2', name: 'Laura Jiménez + pareja', statusKey: 'encurso',
        responsable: 'Tomás (anfitrión)',
        fields: { checkIn: '2026-07-05', checkOut: '2026-07-07', huespedes: 2, habitacion: 'Cabaña Vista Lago', plan: '2D1N Todo incluido', valorTotal: 760000, anticipo: 760000, origen: 'Instagram' },
        checklist: [{ label: 'Check-in realizado', done: true }, { label: 'Tour al Peñón agendado', done: true }, { label: 'Cena romántica confirmada', done: true }, { label: 'Check-out y encuesta enviada', done: false }],
        events: [{ date: '2026-07-05', description: 'Check-in a las 3:20pm. Huéspedes muy satisfechos con la vista.', user: 'Tomás' }, { date: '2026-07-06', description: 'Tour al Peñón completado. Almuerzo incluido en plan.', user: 'Tomás' }],
      },
      {
        id: 'r3', name: 'Empresa Tech Solutions', statusKey: 'confirmada',
        responsable: 'Marcela (recepción)',
        fields: { checkIn: '2026-07-18', checkOut: '2026-07-21', huespedes: 12, habitacion: 'Habitación Estándar', plan: '3D2N Todo incluido', valorTotal: 4800000, anticipo: 1440000, origen: 'Directo / WhatsApp' },
        checklist: [{ label: 'Anticipo recibido', done: true }, { label: 'Sala de reuniones confirmada', done: true }, { label: 'Menú corporativo acordado', done: false }, { label: 'Transporte desde Medellín', done: false }],
        events: [{ date: '2026-06-28', description: 'Reserva grupal. Retiro corporativo para 12 personas.', user: 'Marcela' }],
      },
      {
        id: 'r4', name: 'Familia Vargas', statusKey: 'finalizada',
        responsable: 'Tomás (anfitrión)',
        fields: { checkIn: '2026-06-28', checkOut: '2026-06-30', huespedes: 3, habitacion: 'Habitación Deluxe', plan: '2D1N Todo incluido', valorTotal: 620000, anticipo: 620000, origen: 'Booking.com' },
        checklist: [{ label: 'Check-in realizado', done: true }, { label: 'Actividades acuáticas completadas', done: true }, { label: 'Check-out OK', done: true }, { label: 'Reseña solicitada', done: true }],
        events: [{ date: '2026-06-30', description: 'Check-out sin novedad. Dejaron reseña 5 estrellas en Booking.', user: 'Tomás' }, { date: '2026-06-28', description: 'Check-in exitoso. Upgrade a habitación deluxe por disponibilidad.', user: 'Tomás' }],
      },
      {
        id: 'r5', name: 'Pareja aniversario', statusKey: 'cancelada',
        responsable: 'Marcela (recepción)',
        fields: { checkIn: '2026-07-10', checkOut: '2026-07-12', huespedes: 2, habitacion: 'Suite El Peñón', plan: '2D1N Todo incluido', valorTotal: 980000, anticipo: 294000, origen: 'Referido' },
        checklist: [{ label: 'Anticipo devuelto', done: true }, { label: 'Fecha de reagendamiento ofrecida', done: true }],
        events: [{ date: '2026-07-03', description: 'Cancelación por emergencia médica. Anticipo devuelto según política.', user: 'Marcela' }],
      },
    ],
  },
  mockData: {
    financiero: {
      historico: [
        { mes: 'Ene', ingresos: 12400000, egresos: 7800000 },
        { mes: 'Feb', ingresos: 18200000, egresos: 9100000 },
        { mes: 'Mar', ingresos: 22800000, egresos: 10200000 },
        { mes: 'Abr', ingresos: 16500000, egresos: 8600000 },
        { mes: 'May', ingresos: 28400000, egresos: 11800000 },
        { mes: 'Jun', ingresos: 34100000, egresos: 13500000 },
      ],
      categorias_ingresos: [
        { nombre: 'Alojamiento', monto: 19800000 },
        { nombre: 'Planes todo incluido', monto: 8400000 },
        { nombre: 'Actividades', monto: 4200000 },
        { nombre: 'Restaurante', monto: 1700000 },
      ],
      categorias_egresos: [
        { nombre: 'Nómina', monto: 6200000 },
        { nombre: 'Alimentos y bebidas', monto: 3400000 },
        { nombre: 'Servicios públicos', monto: 1800000 },
        { nombre: 'Mantenimiento', monto: 1300000 },
        { nombre: 'Marketing', monto: 800000 },
      ],
    },
    clientes: [
      { id: 'c1', nombre: 'Laura Jiménez', telefono: '3142561890', email: 'lauraji@gmail.com', ciudad: 'Medellín', ultimaCompra: '2026-07-05', totalCompras: 1380000, interacciones: [{ fecha: '2026-07-05', tipo: 'whatsapp', nota: 'Check-in exitoso. Subió fotos a Instagram mencionando la posada.' }] },
      { id: 'c2', nombre: 'Carlos Vargas', telefono: '3209871234', email: 'cvargas@hotmail.com', ciudad: 'Bogotá', ultimaCompra: '2026-06-30', totalCompras: 620000, interacciones: [{ fecha: '2026-06-30', tipo: 'visita', nota: 'Check-out. Dejó reseña 5★ en Booking y Google.' }] },
      { id: 'c3', nombre: 'Tech Solutions S.A.S', empresa: 'Tech Solutions', telefono: '6014567890', email: 'eventos@techsolutions.co', ciudad: 'Bogotá', ultimaCompra: '2026-07-18', totalCompras: 4800000, notas: 'Empresa corporativa. Retiro anual. Gran potencial.', interacciones: [{ fecha: '2026-06-28', tipo: 'correo', nota: 'Cotización enviada para retiro de 12 personas.' }] },
    ],
    ventas: [],
  },
};
