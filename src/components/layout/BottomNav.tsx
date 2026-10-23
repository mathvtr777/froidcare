import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, HeartHandshake, BookOpen, LineChart, FileText, Settings } from 'lucide-react';
import { cn } from '../../lib/utils';

export const bottomNavItems = [
  { path: '/', label: 'Início', icon: Home },
  { path: '/acolhimento', label: 'Acolhimento', icon: HeartHandshake },
  { path: '/diario', label: 'Diário', icon: BookOpen },
  { path: '/progresso', label: 'Progresso', icon: LineChart },
  { path: '/relatorios', label: 'Relatórios', icon: FileText },
  { path: '/configuracoes', label: 'Ajustes', icon: Settings },
];

export const BottomNav: React.FC = () => {
  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-charcoal-900/95 backdrop-blur-md border-t border-charcoal-800 px-2 py-1.5 flex items-center justify-around safe-area-bottom select-none"
      aria-label="Navegação móvel"
    >
      {bottomNavItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-medium transition-colors',
                isActive
                  ? 'text-sage-400 font-semibold'
                  : 'text-neutral-400 hover:text-neutral-200'
              )
            }
          >
            <Icon className="w-5 h-5 mb-0.5" />
            <span className="truncate max-w-[54px]">{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};
