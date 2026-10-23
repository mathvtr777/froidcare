import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../lib/utils';

export const bottomNavItems = [
  { path: '/', label: 'Início', icon: 'home' },
  { path: '/acolhimento', label: 'Acolhimento', icon: 'spa' },
  { path: '/diario', label: 'Diário', icon: 'edit_note' },
  { path: '/progresso', label: 'Progresso', icon: 'insights' },
  { path: '/relatorios', label: 'Relatórios', icon: 'clinical_notes' },
  { path: '/configuracoes', label: 'Ajustes', icon: 'settings' },
];

export const BottomNav: React.FC = () => {
  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 pb-safe bg-surface-container-lowest/90 backdrop-blur-xl border-t border-surface-container-high/60 shadow-[0_-2px_16px_rgba(0,0,0,0.35)]"
      aria-label="Navegação móvel"
    >
      <div className="h-16 px-gutter flex items-center justify-around">
        {bottomNavItems.map((item) => {
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'min-w-[44px] min-h-[44px] py-1 px-1.5 flex flex-col items-center justify-center gap-0.5 rounded-xl transition-all',
                  isActive
                    ? 'text-primary font-semibold scale-105'
                    : 'text-on-surface-variant hover:text-on-surface'
                )
              }
            >
              <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
              <span className="font-label-sm text-[10px] leading-tight">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
