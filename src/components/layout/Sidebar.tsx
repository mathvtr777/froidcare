import React from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  onOpenHelp: () => void;
}

export const navItems = [
  { path: '/', label: 'Início', icon: 'home' },
  { path: '/acolhimento', label: 'Acolhimento', icon: 'spa' },
  { path: '/diario', label: 'Diário', icon: 'edit_note' },
  { path: '/progresso', label: 'Progresso', icon: 'insights' },
  { path: '/relatorios', label: 'Relatórios', icon: 'clinical_notes' },
  { path: '/configuracoes', label: 'Configurações', icon: 'settings' },
];

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggleCollapse,
  onOpenHelp,
}) => {
  return (
    <aside
      className={cn(
        'hidden md:flex flex-col justify-between border-r border-surface-container-high bg-surface-container-lowest/90 backdrop-blur-xl transition-all duration-200 z-30 select-none pt-16',
        collapsed ? 'w-20' : 'w-64'
      )}
      aria-label="Navegação principal"
    >
      <div>
        {/* Collapse toggle */}
        <div className="h-12 px-4 flex items-center justify-end border-b border-surface-container-high/60">
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={collapsed ? 'Expandir barra lateral' : 'Recolher barra lateral'}
            className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Nav Links */}
        <nav className="p-3 space-y-1.5">
          {navItems.map((item) => {
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-medium transition-all group',
                    isActive
                      ? 'bg-primary/10 text-primary border border-primary/25 font-semibold shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                  )
                }
                title={collapsed ? item.label : undefined}
              >
                <span className="material-symbols-outlined text-[22px] shrink-0 group-hover:scale-105 transition-transform">
                  {item.icon}
                </span>
                {!collapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* SOS Button at bottom of sidebar */}
      <div className="p-3 border-t border-surface-container-high/60">
        <button
          type="button"
          onClick={onOpenHelp}
          className={cn(
            'w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-tertiary bg-tertiary-container/15 hover:bg-tertiary-container/25 border border-tertiary/20 transition-all active:scale-95',
            collapsed && 'justify-center px-0'
          )}
          title="Precisa de ajuda agora? Contatos de emergência"
        >
          <span className="material-symbols-outlined text-[18px]">emergency</span>
          {!collapsed && <span>Apoio SOS / Urgência</span>}
        </button>
      </div>
    </aside>
  );
};
