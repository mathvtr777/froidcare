import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  HeartHandshake,
  BookOpen,
  LineChart,
  FileText,
  Settings,
  LifeBuoy,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '../../lib/utils';

export interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  onOpenHelp: () => void;
}

export const navItems = [
  { path: '/', label: 'Início', icon: Home },
  { path: '/acolhimento', label: 'Acolhimento', icon: HeartHandshake },
  { path: '/diario', label: 'Diário', icon: BookOpen },
  { path: '/progresso', label: 'Meu progresso', icon: LineChart },
  { path: '/relatorios', label: 'Relatórios', icon: FileText },
  { path: '/configuracoes', label: 'Configurações', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggleCollapse,
  onOpenHelp,
}) => {
  return (
    <aside
      className={cn(
        'hidden md:flex flex-col justify-between border-r border-charcoal-800 bg-charcoal-900/95 transition-all duration-200 z-30 select-none',
        collapsed ? 'w-20' : 'w-64'
      )}
      aria-label="Navegação principal"
    >
      {/* Top brand header */}
      <div>
        <div className="h-16 px-4 flex items-center justify-between border-b border-charcoal-800/80">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-sage-950 border border-sage-800/80 flex items-center justify-center shrink-0">
              <span className="text-sage-400 font-bold text-base">F</span>
            </div>
            {!collapsed && (
              <div className="truncate">
                <span className="font-semibold text-neutral-100 text-base tracking-tight block">
                  Froid Care
                </span>
                <span className="text-[11px] text-neutral-400 block -mt-0.5">
                  Bem-estar emocional
                </span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={collapsed ? 'Expandir barra lateral' : 'Recolher barra lateral'}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-charcoal-800 transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation links */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group',
                    isActive
                      ? 'bg-sage-950/80 text-sage-300 border border-sage-800/60 font-semibold'
                      : 'text-neutral-300 hover:text-white hover:bg-charcoal-800/80'
                  )
                }
                title={collapsed ? item.label : undefined}
              >
                <Icon className="w-5 h-5 shrink-0 transition-transform group-hover:scale-105" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Emergency Button */}
      <div className="p-3 border-t border-charcoal-800/80 space-y-2">
        <button
          type="button"
          onClick={onOpenHelp}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-amber-300/90 hover:text-amber-200 bg-amber-950/30 hover:bg-amber-950/50 border border-amber-900/40 transition-colors',
            collapsed && 'justify-center px-0'
          )}
          title="Precisa de ajuda agora? Contatos de emergência"
        >
          <LifeBuoy className="w-4 h-4 shrink-0 text-amber-400" />
          {!collapsed && <span className="truncate">Ajuda e Emergência</span>}
        </button>
      </div>
    </aside>
  );
};
