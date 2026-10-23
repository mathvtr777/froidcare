import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../ui/Button';
import { Play, Pause, RotateCcw, X } from 'lucide-react';
import { usePreferences } from '../../contexts/PreferencesContext';

export interface BreathingExerciseProps {
  onFinish: (exerciseName: string) => void;
  onExit: () => void;
  onSwitchActivity: () => void;
}

type BreathingMode = 'box' | 'gentle'; // box (4-4-4-2) or gentle (4-6 without hold)
type BreathPhase = 'inhale' | 'hold1' | 'exhale' | 'hold2';

export const BreathingExercise: React.FC<BreathingExerciseProps> = ({
  onFinish,
  onExit,
  onSwitchActivity,
}) => {
  const { reducedMotion } = usePreferences();
  const [mode, setMode] = useState<BreathingMode>('box');
  const [isActive, setIsActive] = useState<boolean>(false);
  const [phase, setPhase] = useState<BreathPhase>('inhale');
  const [secondsRemaining, setSecondsRemaining] = useState<number>(4);
  const [completedCycles, setCompletedCycles] = useState<number>(0);
  const [durationInExercise, setDurationInExercise] = useState<number>(0);

  const timerRef = useRef<number | null>(null);

  // Phase durations
  const phaseDurations = {
    box: {
      inhale: 4,
      hold1: 4,
      exhale: 4,
      hold2: 2,
    },
    gentle: {
      inhale: 4,
      hold1: 0,
      exhale: 6,
      hold2: 0,
    },
  };

  const getPhaseText = (p: BreathPhase) => {
    switch (p) {
      case 'inhale':
        return { label: 'Inspire suavemente', hint: 'Puxe o ar pelo nariz, sem pressa' };
      case 'hold1':
        return { label: 'Pausa tranquila', hint: 'Apenas sustente o ar, sem forçar' };
      case 'exhale':
        return { label: 'Solte o ar', hint: 'Deixe o ar sair pela boca ou nariz devagar' };
      case 'hold2':
        return { label: 'Pausa breve', hint: 'Espere um momento antes de recomeçar' };
    }
  };

  // Timer loop
  useEffect(() => {
    if (!isActive) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = window.setInterval(() => {
      setDurationInExercise((d) => d + 1);

      setSecondsRemaining((prev) => {
        if (prev > 1) {
          return prev - 1;
        }

        // Transition to next phase
        if (mode === 'box') {
          if (phase === 'inhale') {
            setPhase('hold1');
            return phaseDurations.box.hold1;
          } else if (phase === 'hold1') {
            setPhase('exhale');
            return phaseDurations.box.exhale;
          } else if (phase === 'exhale') {
            setPhase('hold2');
            return phaseDurations.box.hold2;
          } else {
            setPhase('inhale');
            setCompletedCycles((c) => c + 1);
            return phaseDurations.box.inhale;
          }
        } else {
          // Gentle mode
          if (phase === 'inhale') {
            setPhase('exhale');
            return phaseDurations.gentle.exhale;
          } else {
            setPhase('inhale');
            setCompletedCycles((c) => c + 1);
            return phaseDurations.gentle.inhale;
          }
        }
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, phase, mode]);

  const handleTogglePlay = () => {
    setIsActive((prev) => !prev);
  };

  const handleReset = () => {
    setIsActive(false);
    setPhase('inhale');
    setSecondsRemaining(mode === 'box' ? phaseDurations.box.inhale : phaseDurations.gentle.inhale);
  };

  const handleSwitchMode = (newMode: BreathingMode) => {
    setMode(newMode);
    setPhase('inhale');
    setSecondsRemaining(newMode === 'box' ? 4 : 4);
  };

  const phaseDetails = getPhaseText(phase);

  // Visual size of circle based on phase
  const getScaleClass = () => {
    if (reducedMotion) return 'scale-100';
    if (phase === 'inhale') return 'scale-125 transition-transform duration-[4000ms] ease-out';
    if (phase === 'hold1') return 'scale-125';
    if (phase === 'exhale') return 'scale-90 transition-transform duration-[4000ms] ease-in';
    return 'scale-90';
  };

  return (
    <div className="space-y-6 text-neutral-100">
      {/* Top action bar */}
      <div className="flex items-center justify-between pb-3 border-b border-charcoal-800">
        <div>
          <h3 className="text-base font-semibold text-neutral-100">Respiração Guiada</h3>
          <p className="text-xs text-neutral-400">
            Ajuste o ritmo como for mais confortável para o seu corpo agora.
          </p>
        </div>
        <button
          type="button"
          onClick={onExit}
          className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-charcoal-800"
          aria-label="Encerrar exercício"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Mode selection buttons */}
      <div className="flex justify-center gap-2">
        <button
          type="button"
          onClick={() => handleSwitchMode('box')}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
            mode === 'box'
              ? 'bg-sage-950/80 border-sage-700 text-sage-300'
              : 'bg-charcoal-850 border-charcoal-800 text-neutral-400 hover:text-neutral-200'
          }`}
        >
          Ritmo 4-4-4 (com pausas)
        </button>
        <button
          type="button"
          onClick={() => handleSwitchMode('gentle')}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
            mode === 'gentle'
              ? 'bg-sage-950/80 border-sage-700 text-sage-300'
              : 'bg-charcoal-850 border-charcoal-800 text-neutral-400 hover:text-neutral-200'
          }`}
        >
          Ritmo Suave 4-6 (sem prender o ar)
        </button>
      </div>

      {/* Breathing Visual Guide */}
      <div className="py-8 flex flex-col items-center justify-center min-h-[260px] relative">
        <div
          className={`w-44 h-44 rounded-full border-2 border-sage-500/40 bg-sage-950/40 flex flex-col items-center justify-center p-4 text-center shadow-inner ${getScaleClass()}`}
        >
          <span className="text-xs font-medium text-sage-300 uppercase tracking-wider block">
            {phaseDetails.label}
          </span>
          <span className="text-4xl font-extrabold text-neutral-100 my-1 font-mono">
            {secondsRemaining}
          </span>
          <span className="text-[11px] text-neutral-400 max-w-[120px] leading-tight block">
            {phaseDetails.hint}
          </span>
        </div>

        {completedCycles > 0 && (
          <span className="text-xs text-neutral-500 mt-6">
            Ciclos completos: {completedCycles}
          </span>
        )}
      </div>

      {/* Primary Play/Pause Controls */}
      <div className="flex items-center justify-center gap-3">
        <Button
          variant="secondary"
          size="sm"
          onClick={handleReset}
          aria-label="Reiniciar respiração"
          disabled={!isActive && durationInExercise === 0}
        >
          <RotateCcw className="w-4 h-4 mr-1.5" />
          Reiniciar
        </Button>

        <Button
          size="lg"
          onClick={handleTogglePlay}
          className="px-8 font-semibold shadow-md"
        >
          {isActive ? (
            <>
              <Pause className="w-5 h-5 mr-2" />
              Pausar
            </>
          ) : (
            <>
              <Play className="w-5 h-5 mr-2" />
              {durationInExercise > 0 ? 'Continuar' : 'Começar'}
            </>
          )}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onFinish('Respiração Guiada')}
          disabled={durationInExercise < 10}
        >
          Concluir
        </Button>
      </div>

      {/* Gentle Exit / Switch Option */}
      <div className="pt-4 border-t border-charcoal-800 text-center space-y-2">
        <p className="text-xs text-neutral-400">
          Sentiu algum desconforto ou sensação de falta de ar ao focar na respiração?
        </p>
        <button
          type="button"
          onClick={onSwitchActivity}
          className="text-xs text-sage-400 hover:text-sage-300 font-medium underline inline-block"
        >
          Interromper e experimentar outra técnica (como aterramento sensorial ou escrita)
        </button>
      </div>
    </div>
  );
};
