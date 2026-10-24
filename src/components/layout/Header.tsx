import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Badge } from '../ui/Badge';
import { Database } from 'lucide-react';

export interface HeaderProps {
  onOpenHelp: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenHelp }) => {
  const { user, isDemoMode } = useAuth();
  const displayName = user?.display_name || user?.email?.split('@')[0] || 'Visitante';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/85 backdrop-blur-xl border-b border-surface-container-high/60 pt-safe">
      <div className="h-16 px-margin flex items-center justify-between gap-space-sm max-w-6xl mx-auto w-full">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary font-bold text-sm shadow-sm">
            F
          </div>
          <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-semibold">
            Froid Care
          </span>

          {isDemoMode && (
            <Badge
              variant="tertiary"
              className="hidden sm:inline-flex items-center gap-1.5 py-0.5 px-2 text-[10px] ml-2"
              title="Supabase não configurado. Dados salvos localmente no navegador."
            >
              <Database className="w-3 h-3 text-tertiary" />
              <span>Modo Local</span>
            </Badge>
          )}
        </div>

        {/* Actions: SOS Pill + Profile */}
        <div className="flex items-center gap-space-sm">
          <button
            type="button"
            onClick={onOpenHelp}
            aria-label="Ajuda SOS"
            className="min-h-[40px] px-3.5 py-1.5 rounded-full bg-tertiary-container/15 text-tertiary hover:bg-tertiary-container/25 active:scale-95 transition-all flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-tertiary/40 border border-tertiary/20"
          >
            <span className="material-symbols-outlined text-[18px] text-tertiary">emergency</span>
            <span className="font-label-sm text-label-sm uppercase tracking-wider font-semibold text-tertiary">
              SOS
            </span>
          </button>

          <Link
            to="/configuracoes"
            className="w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant/60 flex items-center justify-center text-xs font-bold text-on-surface select-none shadow-sm hover:border-primary transition-colors"
            title={`Conectado como ${displayName} (Abrir Configurações)`}
            aria-label="Abrir Configurações"
          >
            {initial}
          </Link>
        </div>
      </div>
    </header>
  );
};
