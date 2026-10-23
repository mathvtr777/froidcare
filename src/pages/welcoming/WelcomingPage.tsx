import React, { useState } from 'react';
import { EXERCISES } from '../../constants';
import { usePreferences } from '../../contexts/PreferencesContext';
import { ExerciseId } from '../../types';
import { BreathingExercise } from '../../components/welcoming/BreathingExercise';
import { GroundingExercise } from '../../components/welcoming/GroundingExercise';
import { RelaxationExercise } from '../../components/welcoming/RelaxationExercise';
import { ThoughtOrganizerExercise } from '../../components/welcoming/ThoughtOrganizerExercise';
import { FreeWritingExercise } from '../../components/welcoming/FreeWritingExercise';
import { ExerciseCompletionModal } from '../../components/welcoming/ExerciseCompletionModal';

export const WelcomingPage: React.FC = () => {
  const { favorites, toggleFavorite } = usePreferences();
  const [activeExercise, setActiveExercise] = useState<ExerciseId | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [showGentleReminder, setShowGentleReminder] = useState<boolean>(true);

  // Completion modal state
  const [completionModalOpen, setCompletionModalOpen] = useState(false);
  const [completedExerciseTitle, setCompletedExerciseTitle] = useState('');
  const [savedRecordId, setSavedRecordId] = useState<string | undefined>();

  const handleFinishExercise = (title: string, recId?: string) => {
    setCompletedExerciseTitle(title);
    setSavedRecordId(recId);
    setActiveExercise(null);
    setCompletionModalOpen(true);
  };

  const handleExitExercise = () => {
    setActiveExercise(null);
  };

  const filterCategories: Record<string, string[]> = {
    ansiedade: ['breathing', 'grounding', 'thought_organizer', 'free_writing'],
    panico: ['grounding', 'breathing'],
    respiracao: ['breathing'],
    sono: ['relaxation', 'breathing'],
    foco: ['thought_organizer', 'grounding'],
  };

  const filteredExercises = EXERCISES.filter((ex) => {
    if (activeFilter === 'all') return true;
    const allowed = filterCategories[activeFilter];
    return allowed ? allowed.includes(ex.id) : true;
  });

  return (
    <div className="flex flex-col w-full pb-8">
      {/* If an exercise is active, render its dedicated interface */}
      {activeExercise ? (
        <div className="rounded-2xl bg-surface-container-low border border-outline-variant/50 p-space-md shadow-2xl">
          {activeExercise === 'breathing' && (
            <BreathingExercise
              onFinish={handleFinishExercise}
              onExit={handleExitExercise}
              onSwitchActivity={() => setActiveExercise('grounding')}
            />
          )}
          {activeExercise === 'grounding' && (
            <GroundingExercise
              onFinish={handleFinishExercise}
              onExit={handleExitExercise}
            />
          )}
          {activeExercise === 'relaxation' && (
            <RelaxationExercise
              onFinish={handleFinishExercise}
              onExit={handleExitExercise}
            />
          )}
          {activeExercise === 'thought_organizer' && (
            <ThoughtOrganizerExercise
              onFinish={handleFinishExercise}
              onExit={handleExitExercise}
            />
          )}
          {activeExercise === 'free_writing' && (
            <FreeWritingExercise
              onFinish={handleFinishExercise}
              onExit={handleExitExercise}
            />
          )}
        </div>
      ) : (
        <>
          {/* Header Contextual */}
          <section className="flex flex-col gap-space-xs mt-1 mb-space-md">
            <div className="inline-flex items-center gap-1.5 self-start px-3 py-1 rounded-full bg-surface-container-high text-primary border border-primary/20">
              <span className="material-symbols-outlined text-[16px]">spa</span>
              <span className="font-label-sm text-label-sm uppercase tracking-wider font-semibold">
                Espaço Seguro
              </span>
            </div>
            <h1 className="font-display-lg-mobile text-display-lg-mobile text-on-surface tracking-tight font-bold mt-1">
              Modo de Acolhimento
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Vamos por partes. Escolha o que parece mais útil ou confortável para você agora.
              Todas as práticas são opcionais e respeitam o seu próprio ritmo.
            </p>
          </section>

          {/* Interactive Grounding Affirmation Banner */}
          {showGentleReminder && (
            <div className="relative overflow-hidden rounded-2xl bg-surface-container-low p-space-md mb-space-lg flex items-center justify-between gap-space-sm shadow-md border border-outline-variant/40">
              <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
              <div className="flex items-start gap-3 relative z-10">
                <div className="w-9 h-9 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[20px]">self_improvement</span>
                </div>
                <div>
                  <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider font-semibold block">
                    Lembrete Gentil
                  </span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                    Não há jeito errado de respirar ou sentir. Você está seguro aqui.
                  </p>
                </div>
              </div>
              <button
                aria-label="Dispensar aviso"
                className="text-on-surface-variant hover:text-on-surface p-1 rounded-full transition-colors shrink-0"
                onClick={() => setShowGentleReminder(false)}
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
          )}

          {/* Filter Pills */}
          <section className="flex flex-col gap-space-xs mb-space-lg">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-on-surface font-semibold tracking-wide">
                Filtrar por intenção
              </span>
              <span className="font-label-sm text-label-sm text-primary font-medium">
                Exibindo {filteredExercises.length} de {EXERCISES.length}
              </span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto py-1.5 no-scrollbar">
              {[
                { id: 'all', label: 'Todos' },
                { id: 'ansiedade', label: 'Ansiedade' },
                { id: 'panico', label: 'Pânico' },
                { id: 'respiracao', label: 'Respiração' },
                { id: 'sono', label: 'Sono' },
                { id: 'foco', label: 'Foco' },
              ].map((pill) => (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => setActiveFilter(pill.id)}
                  className={`shrink-0 min-h-[38px] px-4 py-1.5 rounded-full font-label-md text-label-md font-semibold transition-all active:scale-95 flex items-center gap-1.5 ${
                    activeFilter === pill.id
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span>{pill.label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Practice Cards List */}
          <section className="flex flex-col gap-space-md">
            {filteredExercises.map((ex) => {
              const isFav = favorites.includes(ex.id);

              return (
                <article
                  key={ex.id}
                  className="group relative overflow-hidden rounded-2xl bg-surface-container p-space-md shadow-lg border border-outline-variant/40 transition-all duration-300 hover:shadow-xl hover:bg-surface-container-high"
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      {isFav && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-tertiary-container/20 text-tertiary font-label-sm text-label-sm font-semibold border border-tertiary/20">
                          <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                            star
                          </span>
                          Favorito
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-lowest text-on-surface-variant font-label-sm text-label-sm border border-outline-variant/30">
                        <span className="material-symbols-outlined text-[14px]">schedule</span>
                        Aprox. {ex.durationMinutes} min
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleFavorite(ex.id)}
                      aria-label={`Favoritar ${ex.title}`}
                      className="w-9 h-9 rounded-full bg-surface-container-low text-tertiary flex items-center justify-center transition-transform active:scale-75"
                    >
                      <span
                        className="material-symbols-outlined text-[20px]"
                        style={{ fontVariationSettings: isFav ? "'FILL' 1" : "'FILL' 0" }}
                      >
                        star
                      </span>
                    </button>
                  </div>

                  <div className="flex items-start gap-space-sm mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/15 text-primary flex items-center justify-center shrink-0 shadow-inner">
                      <span className="material-symbols-outlined text-[26px]">
                        {ex.id === 'breathing' && 'air'}
                        {ex.id === 'grounding' && 'anchor'}
                        {ex.id === 'relaxation' && 'self_improvement'}
                        {ex.id === 'thought_organizer' && 'psychology_alt'}
                        {ex.id === 'free_writing' && 'edit_note'}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold truncate">
                        {ex.title}
                      </h2>
                      <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2 mt-0.5 leading-relaxed">
                        {ex.shortDescription}
                      </p>
                    </div>
                  </div>

                  {/* Micro Visualizer representation for Grounding 5-4-3-2-1 */}
                  {ex.id === 'grounding' && (
                    <div className="grid grid-cols-5 gap-1.5 p-2 rounded-xl bg-surface-container-lowest mb-4 border border-outline-variant/30">
                      {[
                        { count: 5, label: 'Olhos' },
                        { count: 4, label: 'Toque' },
                        { count: 3, label: 'Sons' },
                        { count: 2, label: 'Odor' },
                        { count: 1, label: 'Sabor' },
                      ].map((s) => (
                        <div key={s.count} className="flex flex-col items-center py-1 rounded bg-surface-container text-on-surface">
                          <span className="font-headline-sm text-[13px] font-bold text-secondary">{s.count}</span>
                          <span className="font-label-sm text-[10px] text-on-surface-variant">{s.label}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Micro Visualizer for Breathing */}
                  {ex.id === 'breathing' && (
                    <div className="relative w-full h-16 rounded-xl bg-surface-container-lowest overflow-hidden flex items-center justify-center mb-4 border border-outline-variant/30">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-primary/40 animate-ping" />
                        <span className="w-3.5 h-3.5 rounded-full bg-primary/70" />
                        <span className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center text-[10px] font-bold">
                          In
                        </span>
                        <span className="w-3.5 h-3.5 rounded-full bg-primary/70" />
                        <span className="w-2.5 h-2.5 rounded-full bg-primary/40" />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-3 pt-1 border-t border-surface-container-high/60">
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      Prática guiada sem esforço forçado
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveExercise(ex.id)}
                      className="min-h-[44px] px-space-md py-2 rounded-full bg-primary text-on-primary font-label-lg text-label-lg font-semibold flex items-center gap-1.5 shadow-md active:scale-95 transition-all hover:bg-primary-container"
                    >
                      <span>Iniciar</span>
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </section>
        </>
      )}

      {/* Completion Modal */}
      <ExerciseCompletionModal
        isOpen={completionModalOpen}
        onClose={() => setCompletionModalOpen(false)}
        activityName={completedExerciseTitle}
        savedRecordId={savedRecordId}
      />
    </div>
  );
};
