import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LifeBuoy, Database } from 'lucide-react';
import { Badge } from '../ui/Badge';

export interface HeaderProps {
  onOpenHelp: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenHelp }) => {
  const { user, isDemoMode } = useAuth();
  const displayName = user?.display_name || user?.email?.split('@')[0] || 'Visitante';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="h-16 border-b border-charcoal-800 bg-charcoal-900/60 backdrop-blur-md px-4 md:px-6 flex items-center justify-between z-20 shrink-0">
      <div className="flex items-center gap-3">
        {/* Mobile brand indicator */}
        <div className="md:hidden flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sage-950 border border-sage-800 flex items-center justify-center">
            <span className="text-sage-400 font-bold text-sm">F</span>
          </div>
          <span className="font-semibold text-neutral-100 text-sm">Froid Care</span>
        </div>

        {isDemoMode && (
          <Badge
            variant="subtle"
            className="hidden sm:inline-flex items-center gap-1.5 py-1 px-2.5 text-[11px] text-amber-300 bg-amber-950/40 border border-amber-900/50"
            title="Supabase não configurado no .env. Dados persistidos localmente no navegador."
          >
            <Database className="w-3 h-3 text-amber-400" />
            <span>Modo Local / Demo</span>
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Urgent Help button */}
        <button
          type="button"
          onClick={onOpenHelp}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-amber-300 hover:text-amber-200 bg-amber-950/30 hover:bg-amber-950/60 border border-amber-900/40 transition-colors"
          aria-label="Contatos de emergência e apoio imediato"
        >
          <LifeBuoy className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Ajuda Imediata</span>
          <span className="sm:hidden">Ajuda</span>
        </button>

        {/* User initials pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-charcoal-800">
          <div
            className="w-8 h-8 rounded-full bg-charcoal-800 border border-charcoal-700 flex items-center justify-center text-xs font-semibold text-neutral-200 select-none"
            title={`Conectado como ${displayName}`}
          >
            {initial}
          </div>
          <span className="hidden lg:inline text-xs font-medium text-neutral-300 truncate max-w-[120px]">
            {displayName}
          </span>
        </div>
      </div>
    </header>
  );
};
