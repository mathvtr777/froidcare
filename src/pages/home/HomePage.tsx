import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { usePreferences } from '../../contexts/PreferencesContext';
import { recordsService } from '../../services/recordsService';
import { EmotionalRecord } from '../../types';
import { CheckInModal } from '../../components/diary/CheckInModal';
import { OnboardingModal } from '../../components/onboarding/OnboardingModal';
import { getContextualGreeting, formatDayWeekdayPt, formatTimePt } from '../../lib/utils';
import { EMOTIONS, EXERCISES, INTENSITY_LEVELS } from '../../constants';
import { Button } from '../../components/ui/Button';
import {
  HeartHandshake,
  Plus,
  BookOpen,
  ArrowRight,
  Wind,
  Anchor,
  Sparkles,
  Brain,
  Feather,
  ChevronRight,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { user } = useAuth();
  const { preferences, favorites } = usePreferences();

  const [recentRecords, setRecentRecords] = useState<EmotionalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);

  const loadRecent = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await recordsService.fetchRecords(user.id, { limit: 4 });
      setRecentRecords(res.records);
    } catch (err) {
      console.warn('Erro ao buscar recentes:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadRecent();
  }, [loadRecent]);

  // Open onboarding on first access if not completed
  useEffect(() => {
    if (preferences && !preferences.onboarding_completed) {
      setOnboardingOpen(true);
    }
  }, [preferences]);

  const displayName = user?.display_name || user?.email?.split('@')[0] || '';
  const { greeting, subtitle } = getContextualGreeting(displayName);

  const getExerciseIcon = (id: string) => {
    switch (id) {
      case 'breathing':
        return Wind;
      case 'grounding':
        return Anchor;
      case 'relaxation':
        return Sparkles;
      case 'thought_organizer':
        return Brain;
      default:
        return Feather;
    }
  };

  const favoriteExercises = EXERCISES.filter((ex) => favorites.includes(ex.id));

  return (
    <div className="space-y-7">
      {/* 1. Contextual Greeting & Quick Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-100">
            {greeting}
          </h1>
          <p className="text-sm text-neutral-400 max-w-lg">{subtitle}</p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setCheckInOpen(true)}
            size="md"
            className="shadow-md"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Fazer Check-in
          </Button>

          <Link to="/acolhimento">
            <Button
              variant="secondary"
              size="md"
              className="text-sage-300 border-sage-800/80 hover:bg-sage-950/40"
            >
              <HeartHandshake className="w-4 h-4 mr-1.5 text-sage-400" />
              Acolhimento
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Prominent Quick Access to Welcoming Banner */}
      <div className="p-5 md:p-6 rounded-2xl bg-gradient-to-r from-charcoal-900 via-charcoal-900 to-sage-950/40 border border-charcoal-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sage-950/90 text-sage-300 text-xs font-semibold border border-sage-800/60">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Precisa de uma pausa agora?</span>
          </div>
          <h2 className="text-base font-bold text-neutral-100">
            Modo de Acolhimento Imediato
          </h2>
          <p className="text-xs text-neutral-400 max-w-xl leading-relaxed">
            Exercícios guiados de respiração suave, aterramento nos cinco sentidos e organização
            de pensamentos para desacelerar o corpo e a mente.
          </p>
        </div>

        <Link to="/acolhimento" className="shrink-0">
          <Button size="md" className="font-semibold px-4 w-full sm:w-auto">
            Abrir Acolhimento
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </Link>
      </div>

      {/* 3. Favorite Activities Shortcuts */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-400">
            Práticas Favoritas
          </h3>
          <Link
            to="/acolhimento"
            className="text-xs text-sage-400 hover:text-sage-300 flex items-center gap-1"
          >
            Ver todas as práticas
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {favoriteExercises.slice(0, 3).map((ex) => {
            const Icon = getExerciseIcon(ex.id);
            return (
              <Link
                key={ex.id}
                to="/acolhimento"
                className="p-4 rounded-xl bg-charcoal-900 border border-charcoal-800 hover:border-charcoal-700 hover:bg-charcoal-850 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-sage-950 border border-sage-800/70 flex items-center justify-center text-sage-400 group-hover:scale-105 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-neutral-200 group-hover:text-white">
                      {ex.title}
                    </h4>
                    <span className="text-[11px] text-neutral-500">
                      ~{ex.durationMinutes} minutos
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-sage-400 transition-colors" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* 4. Real Personal Summary / Recent Records */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-400">
            Registros Recentes
          </h3>
          {recentRecords.length > 0 && (
            <Link
              to="/diario"
              className="text-xs text-sage-400 hover:text-sage-300 flex items-center gap-1"
            >
              Abrir diário completo
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {loading ? (
          <div className="py-8 text-center text-xs text-neutral-500">
            Carregando seus registros...
          </div>
        ) : recentRecords.length === 0 ? (
          /* Welcoming useful empty state */
          <div className="p-8 rounded-2xl bg-charcoal-900 border border-charcoal-800 text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-sage-950 text-sage-400 mx-auto flex items-center justify-center border border-sage-800/80">
              <BookOpen className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-semibold text-neutral-200">
              Nenhum registro emocional ainda
            </h4>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
              O diário é o seu refúgio pessoal para entender como as suas emoções variam ao longo
              dos dias. Comece com um check-in simples de 30 segundos.
            </p>
            <Button size="sm" onClick={() => setCheckInOpen(true)}>
              Fazer meu primeiro check-in
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recentRecords.map((rec) => {
              const emoDef = EMOTIONS.find((e) => e.id === rec.primary_emotion);
              const emoLabel = emoDef ? emoDef.label : rec.primary_emotion;
              const intensity = INTENSITY_LEVELS[rec.intensity] || { label: `${rec.intensity}/10` };

              return (
                <div
                  key={rec.id}
                  className="p-4 rounded-xl bg-charcoal-900 border border-charcoal-800/90 hover:border-charcoal-700 transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-neutral-300">
                      {formatDayWeekdayPt(rec.record_timestamp)}, {formatTimePt(rec.record_timestamp)}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-sage-950/80 text-sage-300 border border-sage-800/60">
                      {emoLabel}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-neutral-400">
                    <span>Intensidade: {rec.intensity}/10</span>
                    <span className="text-neutral-500 text-[11px]">{intensity.label}</span>
                  </div>

                  {rec.notes && (
                    <p className="text-xs text-neutral-300 line-clamp-2 italic pt-1 border-t border-charcoal-800/60">
                      "{rec.notes}"
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Check-In Modal */}
      <CheckInModal
        isOpen={checkInOpen}
        onClose={() => setCheckInOpen(false)}
        onRecordCreated={loadRecent}
      />

      {/* Onboarding Modal */}
      <OnboardingModal
        isOpen={onboardingOpen}
        onClose={() => setOnboardingOpen(false)}
      />
    </div>
  );
};
