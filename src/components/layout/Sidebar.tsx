import { NavLink } from 'react-router-dom';
import { BarChart3, Users, ShoppingCart, Cog, Bot, LayoutDashboard, CalendarCheck, Package, type LucideIcon } from 'lucide-react';
import { clsx } from 'clsx';
import type { ClientConfig } from '../../types/config.types';

const MODULE_ICONS: Record<string, LucideIcon> = {
  financiero: BarChart3,
  clientes: Users,
  ventas: ShoppingCart,
  industria_Cog: Cog,
  industria_CalendarCheck: CalendarCheck,
  industria_Package: Package,
  asistente: Bot,
};

const MODULE_LABELS: Record<string, string> = {
  financiero: 'Financiero',
  clientes: 'Clientes',
  ventas: 'Ventas',
  industria: 'Industria',
  asistente: 'Asistente IA',
};

const MODULE_PATHS: Record<string, string> = {
  financiero: '/financiero',
  clientes: '/clientes',
  ventas: '/ventas',
  industria: '/industria',
  asistente: '/asistente',
};

function getIndustriaIcon(iconName: string): LucideIcon {
  return MODULE_ICONS[`industria_${iconName}`] ?? Cog;
}

interface SidebarProps {
  config: ClientConfig;
}

export function Sidebar({ config }: SidebarProps) {
  const activeModules = Object.entries(config.modules)
    .filter(([, active]) => active)
    .map(([key]) => key);

  return (
    <aside className="hidden lg:flex flex-col w-60 min-h-screen bg-white border-r border-slate-200 fixed left-0 top-0 z-30">
      {/* Logo / Brand */}
      <div className="px-5 py-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--color-primary)' }}>
            <LayoutDashboard size={16} className="text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-900 truncate leading-tight">{config.clientName}</p>
            {config.clientSlogan && (
              <p className="text-xs text-slate-500 truncate leading-tight">{config.clientSlogan}</p>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest px-3 mb-2">Módulos</p>
        {activeModules.map((key) => {
          const label = key === 'industria' ? config.industria.entityNamePlural : MODULE_LABELS[key];
          const path = MODULE_PATHS[key] ?? `/${key}`;
          const Icon = key === 'industria'
            ? getIndustriaIcon(config.industria.icon)
            : (MODULE_ICONS[key] ?? LayoutDashboard);

          return (
            <NavLink
              key={key}
              to={path}
              className={({ isActive }) => clsx('sidebar-link', isActive && 'active')}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-slate-100">
        <p className="text-[10px] text-slate-400 text-center">PYMIA Dashboard v1.0</p>
      </div>
    </aside>
  );
}
