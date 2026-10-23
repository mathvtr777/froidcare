import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { usePreferences } from '../../contexts/PreferencesContext';
import { recordsService } from '../../services/recordsService';
import { EmotionalRecord } from '../../types';
import { CheckInModal } from '../../components/diary/CheckInModal';
import { OnboardingModal } from '../../components/onboarding/OnboardingModal';
import { getContextualGreeting, formatDayWeekdayPt, formatTimePt } from '../../lib/utils';
import { EMOTIONS, INTENSITY_LEVELS } from '../../constants';

export const HomePage: React.FC = () => {
  const { user } = useAuth();
  const { preferences } = usePreferences();

  const [recentRecords, setRecentRecords] = useState<EmotionalRecord[]>([]);
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [initialEmotionForCheckIn, setInitialEmotionForCheckIn] = useState('calma');
  const [onboardingOpen, setOnboardingOpen] = useState(false);

  const loadRecent = useCallback(async () => {
    if (!user) return;
    try {
      const res = await recordsService.fetchRecords(user.id, { limit: 4 });
      setRecentRecords(res.records);
    } catch (err) {
      console.warn('Erro ao buscar recentes:', err);
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

  const displayName = user?.display_name || user?.email?.split('@')[0] || 'Visitante';
  const { greeting, subtitle } = getContextualGreeting(displayName);

  const currentTimeStr = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  const handleQuickEmotionSelect = (emotionId: string) => {
    setInitialEmotionForCheckIn(emotionId);
    setCheckInOpen(true);
  };

  return (
    <div className="flex flex-col w-full pb-8 space-y-space-md">
      {/* 1. Saudação e Acolhimento Contextual */}
      <section className="flex flex-col gap-1.5 pt-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="font-label-md text-label-md text-primary tracking-wide uppercase font-semibold">
              Espaço de Cuidado
            </span>
          </div>
          <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1 font-mono">
            <span className="material-symbols-outlined text-[15px] text-tertiary">schedule</span>
            {currentTimeStr}
          </span>
        </div>
        <h1 className="font-display-lg-mobile text-display-lg-mobile text-on-surface tracking-tight font-bold">
          {greeting}
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-lg leading-relaxed">
          {subtitle}
        </p>
      </section>

      {/* 2. Botões de Ação Rápida */}
      <section className="flex items-center gap-space-sm pt-1">
        <button
          onClick={() => {
            setInitialEmotionForCheckIn('calma');
            setCheckInOpen(true);
          }}
          className="flex-1 min-h-[48px] px-space-md py-3 rounded-full bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-[0.98] transition-all"
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            add_circle
          </span>
          <span>+ Fazer Check-in</span>
        </button>

        <Link
          to="/acolhimento"
          className="min-h-[48px] px-space-md py-3 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-lg text-label-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-sm"
        >
          <span className="material-symbols-outlined text-[20px] text-primary">spa</span>
          <span>Acolhimento</span>
        </Link>
      </section>

      {/* 3. Hero Card: Modo de Acolhimento Imediato */}
      <section className="relative overflow-hidden rounded-2xl bg-surface-container-low p-space-md shadow-xl border border-outline-variant/40">
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-44 h-44 bg-secondary-container/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-full bg-tertiary-container/20 text-tertiary font-label-sm text-label-sm flex items-center gap-1.5 w-fit border border-tertiary/20 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-ping" />
              Precisa de uma pausa agora?
            </span>
            <span className="material-symbols-outlined text-primary/70 text-[24px]">self_improvement</span>
          </div>

          <div className="space-y-1">
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
              Modo de Acolhimento Imediato
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              Um refúgio com respiração compassiva, aterramento nos cinco sentidos e organização dos pensamentos
              para desacelerar o corpo e a mente.
            </p>
          </div>

          <div className="pt-2">
            <Link to="/acolhimento">
              <button
                className="w-full min-h-[46px] rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-label-lg text-label-lg flex items-center justify-center gap-2 active:scale-[0.99] transition-all shadow-md shadow-primary/25 font-semibold"
                type="button"
              >
                <span>Abrir Acolhimento</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Práticas Favoritas */}
      <section className="space-y-space-sm pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">auto_awesome</span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
              Práticas Favoritas
            </h3>
          </div>
          <Link to="/acolhimento" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors">
            Ver todas
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm">
          {/* Card 1: Respiração Guiada */}
          <Link
            to="/acolhimento"
            className="group flex items-center justify-between p-space-md rounded-2xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/40 transition-all cursor-pointer shadow-sm active:scale-[0.99]"
          >
            <div className="flex items-center gap-space-sm">
              <div className="w-12 h-12 rounded-2xl bg-surface-container-highest flex items-center justify-center text-primary group-hover:scale-105 transition-transform shadow-inner">
                <span className="material-symbols-outlined text-[26px]">air</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-lg text-label-lg text-on-surface font-semibold">
                  Respiração Guiada
                </span>
                <div className="flex items-center gap-1.5 text-on-surface-variant">
                  <span className="material-symbols-outlined text-[14px]">timer</span>
                  <span className="font-body-sm text-body-sm">Ciclo 4-4-4 • ~3 min</span>
                </div>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant group-hover:text-primary group-hover:translate-x-0.5 transition-all">
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </div>
          </Link>

          {/* Card 2: Aterramento Sensorial */}
          <Link
            to="/acolhimento"
            className="group flex items-center justify-between p-space-md rounded-2xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/40 transition-all cursor-pointer shadow-sm active:scale-[0.99]"
          >
            <div className="flex items-center gap-space-sm">
              <div className="w-12 h-12 rounded-2xl bg-surface-container-highest flex items-center justify-center text-secondary group-hover:scale-105 transition-transform shadow-inner">
                <span className="material-symbols-outlined text-[26px]">anchor</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-lg text-label-lg text-on-surface font-semibold">
                  Aterramento Sensorial
                </span>
                <div className="flex items-center gap-1.5 text-on-surface-variant">
                  <span className="material-symbols-outlined text-[14px]">psychology</span>
                  <span className="font-body-sm text-body-sm">Método 5-4-3-2-1 • ~4 min</span>
                </div>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant group-hover:text-secondary group-hover:translate-x-0.5 transition-all">
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </div>
          </Link>
        </div>
      </section>

      {/* 5. Diário Emocional e Check-in Rápido */}
      <section className="space-y-space-sm pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">history_edu</span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
              Diário Emocional
            </h3>
          </div>
          <Link to="/diario" className="font-label-sm text-label-sm text-primary hover:underline">
            Ver histórico completo
          </Link>
        </div>

        {/* Card convite / micro-registro */}
        <div className="flex flex-col p-space-md rounded-2xl bg-surface-container-low border border-outline-variant/40 shadow-md space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-secondary" />
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                  {recentRecords.length > 0 ? 'Último registro' : 'Hoje • Comece por aqui'}
                </span>
              </div>
              <h4 className="font-label-lg text-label-lg text-on-surface font-semibold">
                Como você se sentiu hoje?
              </h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                Dedique 30 segundos para nomear suas emoções e criar clareza interior.
              </p>
            </div>

            {/* Micro-gráfico de tendência */}
            <div className="flex flex-col items-end gap-1 shrink-0 bg-surface-container p-2.5 rounded-xl border border-outline-variant/40">
              <span className="font-label-sm text-[10px] text-on-surface-variant">Tendência recente</span>
              <svg className="w-20 h-9" fill="none" viewBox="0 0 80 36">
                <path d="M4 26 C 20 28, 30 14, 46 16 C 58 18, 68 8, 76 10" stroke="#5af0b3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
                <circle cx="4" cy="26" fill="#131b2e" r="3" stroke="#5af0b3" strokeWidth="2" />
                <circle cx="28" cy="19" fill="#131b2e" r="3" stroke="#5af0b3" strokeWidth="2" />
                <circle cx="52" cy="16" fill="#131b2e" r="3" stroke="#5af0b3" strokeWidth="2" />
                <circle className="animate-pulse" cx="76" cy="10" fill="#5af0b3" r="3.5" />
              </svg>
              <span className="font-label-sm text-primary text-[10px] font-semibold">Momento presente</span>
            </div>
          </div>

          {/* Quick Emotion Chips (Stitch design delight) */}
          <div className="grid grid-cols-4 gap-2 pt-1">
            {[
              { id: 'calma', emoji: '🌿', label: 'Sereno' },
              { id: 'confusao', emoji: '💭', label: 'Pensativo' },
              { id: 'cansaco', emoji: '🌧️', label: 'Cansado' },
              { id: 'gratidao', emoji: '✨', label: 'Grato' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleQuickEmotionSelect(item.id)}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-surface-container hover:bg-surface-container-highest border border-outline-variant/40 active:scale-95 transition-all text-on-surface gap-1"
              >
                <span className="text-xl">{item.emoji}</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                  {item.label}
                </span>
              </button>
            ))}
          </div>

          {/* Real Recent Records preview */}
          {recentRecords.length > 0 && (
            <div className="pt-2 border-t border-surface-container-high/60 space-y-2">
              <span className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">
                Últimas anotações salvas
              </span>
              <div className="space-y-2">
                {recentRecords.slice(0, 2).map((rec) => {
                  const emoDef = EMOTIONS.find((e) => e.id === rec.primary_emotion);
                  const intensity = INTENSITY_LEVELS[rec.intensity];
                  return (
                    <div
                      key={rec.id}
                      className="p-3 rounded-xl bg-surface-container border border-outline-variant/40 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold text-[11px]">
                          {emoDef?.label || rec.primary_emotion}
                        </span>
                        <span className="text-on-surface-variant">
                          Intensidade: {rec.intensity}/10 ({intensity?.label || ''})
                        </span>
                      </div>
                      <span className="text-outline text-[11px]">
                        {formatDayWeekdayPt(rec.record_timestamp)}, {formatTimePt(rec.record_timestamp)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 6. Mindfulness Quote Pill */}
      <section className="flex items-center gap-3 p-space-md rounded-2xl bg-surface-container-high/60 border border-outline-variant/40 backdrop-blur-sm">
        <div className="w-10 h-10 rounded-full bg-tertiary-container/20 flex items-center justify-center text-tertiary shrink-0">
          <span className="material-symbols-outlined text-[20px]">nature_people</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-body-sm text-body-sm text-on-surface italic leading-snug">
            “Respirar fundo é o jeito que o corpo tem de lembrar a si mesmo que está em segurança.”
          </p>
        </div>
      </section>

      {/* Modals */}
      <CheckInModal
        isOpen={checkInOpen}
        onClose={() => setCheckInOpen(false)}
        onRecordCreated={loadRecent}
        initialEmotion={initialEmotionForCheckIn}
      />

      <OnboardingModal
        isOpen={onboardingOpen}
        onClose={() => setOnboardingOpen(false)}
      />
    </div>
  );
};
