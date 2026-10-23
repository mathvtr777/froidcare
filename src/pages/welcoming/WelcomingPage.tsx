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
import { Wind, Anchor, Sparkles, Brain, Feather, Star, Clock, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const WelcomingPage: React.FC = () => {
  const { favorites, toggleFavorite } = usePreferences();
  const [activeExercise, setActiveExercise] = useState<ExerciseId | null>(null);

  // Completion state
  const [completionModalOpen, setCompletionModalOpen] = useState(false);
  const [completedExerciseTitle, setCompletedExerciseTitle] = useState('');
  const [savedRecordId, setSavedRecordId] = useState<string | undefined>();

  const getExerciseIcon = (id: ExerciseId) => {
    switch (id) {
      case 'breathing':
        return Wind;
      case 'grounding':
        return Anchor;
      case 'relaxation':
        return Sparkles;
      case 'thought_organizer':
        return Brain;
      case 'free_writing':
        return Feather;
    }
  };

  const handleFinishExercise = (title: string, recId?: string) => {
    setCompletedExerciseTitle(title);
    setSavedRecordId(recId);
    setActiveExercise(null);
    setCompletionModalOpen(true);
  };

  const handleExitExercise = () => {
    setActiveExercise(null);
  };

  return (
    <div className="space-y-6">
      {/* If an exercise is active, render its dedicated full-screen interface */}
      {activeExercise ? (
        <div className="rounded-2xl bg-charcoal-900 border border-charcoal-800 p-6 shadow-xl">
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
          {/* Welcome Intro Header */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-100">
              Modo de Acolhimento
            </h1>
            <p className="text-sm text-neutral-400 max-w-2xl leading-relaxed">
              Vamos por partes. Escolha o que parece mais útil ou confortável para você agora.
              Todas as práticas são opcionais e respeitam o seu próprio ritmo.
            </p>
          </div>

          {/* Exercises Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {EXERCISES.map((ex) => {
              const Icon = getExerciseIcon(ex.id);
              const isFav = favorites.includes(ex.id);

              return (
                <div
                  key={ex.id}
                  className="group relative rounded-2xl bg-charcoal-900 border border-charcoal-800/90 hover:border-charcoal-700 p-5 transition-all shadow-sm hover:shadow-md flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="w-10 h-10 rounded-xl bg-sage-950/80 border border-sage-800/80 flex items-center justify-center text-sage-400 shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(ex.id);
                        }}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isFav
                            ? 'text-amber-400 hover:text-amber-300'
                            : 'text-neutral-500 hover:text-neutral-300 hover:bg-charcoal-800'
                        }`}
                        title={isFav ? 'Remover dos favoritos' : 'Favoritar atividade'}
                        aria-label={isFav ? 'Remover dos favoritos' : 'Favoritar atividade'}
                      >
                        <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400' : ''}`} />
                      </button>
                    </div>

                    <div>
                      <h3 className="text-base font-semibold text-neutral-100 group-hover:text-sage-300 transition-colors">
                        {ex.title}
                      </h3>
                      <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                        {ex.shortDescription}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-2 border-t border-charcoal-800 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-[11px] text-neutral-400">
                      <Clock className="w-3.5 h-3.5" />
                      Aprox. {ex.durationMinutes} min
                    </span>

                    <Button
                      size="sm"
                      onClick={() => setActiveExercise(ex.id)}
                      className="font-medium text-xs px-3"
                    >
                      Iniciar
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
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
