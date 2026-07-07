import { NavLink } from 'react-router-dom';
import { BarChart3, Users, ShoppingCart, Cog, Bot, CalendarCheck, Package, type LucideIcon } from 'lucide-react';
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

const MODULE_LABELS_SHORT: Record<string, string> = {
  financiero: 'Finanzas',
  clientes: 'Clientes',
  ventas: 'Ventas',
  industria: 'Industria',
  asistente: 'IA',
};

const MODULE_PATHS: Record<string, string> = {
  financiero: '/financiero',
  clientes: '/clientes',
  ventas: '/ventas',
  industria: '/industria',
  asistente: '/asistente',
};

interface BottomNavProps {
  config: ClientConfig;
}

export function BottomNav({ config }: BottomNavProps) {
  const activeModules = Object.entries(config.modules)
    .filter(([, active]) => active)
    .map(([key]) => key)
    .slice(0, 5); // max 5 items in bottom nav

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 safe-area-inset-bottom">
      <div className="flex items-stretch">
        {activeModules.map((key) => {
          const label = key === 'industria' ? config.industria.entityNamePlural : (MODULE_LABELS_SHORT[key] ?? key);
          const path = MODULE_PATHS[key] ?? `/${key}`;
          const Icon = key === 'industria'
            ? (MODULE_ICONS[`industria_${config.industria.icon}`] ?? Cog)
            : (MODULE_ICONS[key] ?? BarChart3);

          return (
            <NavLink
              key={key}
              to={path}
              className={({ isActive }) =>
                clsx(
                  'flex-1 flex flex-col items-center justify-center gap-0.5 py-2 px-1 text-xs font-medium transition-colors',
                  isActive ? 'text-primary' : 'text-slate-500'
                )
              }
              style={({ isActive }) => isActive ? { color: 'var(--color-primary)' } : {}}
            >
              <Icon size={20} />
              <span className="text-[10px] leading-tight truncate w-full text-center">{label}</span>
            </NavLink>
          );
        })}
      </div>
      <div className="h-safe-area-inset-bottom" />
    </nav>
  );
}
