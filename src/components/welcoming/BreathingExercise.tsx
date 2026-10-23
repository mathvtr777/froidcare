import React, { useState, useEffect, useRef } from 'react';
import { usePreferences } from '../../contexts/PreferencesContext';

export interface BreathingExerciseProps {
  onFinish: (exerciseName: string) => void;
  onExit: () => void;
  onSwitchActivity: () => void;
}

type BreathingMode = 'square' | 'gentle'; // 'square' (4-4-4) or 'gentle' (4-6)

const SOUNDS = [
  { name: 'Chuva Suave · 432Hz', icon: 'water_drop' },
  { name: 'Sons da Floresta · Zen', icon: 'forest' },
  { name: 'Ondas do Oceano', icon: 'waves' },
  { name: 'Silêncio Puro', icon: 'volume_off' },
];

export const BreathingExercise: React.FC<BreathingExerciseProps> = ({
  onFinish,
  onExit,
  onSwitchActivity,
}) => {
  const { reducedMotion } = usePreferences();
  const [currentMode, setCurrentMode] = useState<BreathingMode>('square');
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const totalSeconds = 180; // 3 minutes
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [cycleTimer, setCycleTimer] = useState<number>(4);
  const [phaseIndex, setPhaseIndex] = useState<number>(0);
  const [soundIndex, setSoundIndex] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const timerRef = useRef<number | null>(null);

  const modes = {
    square: {
      phases: [
        { name: 'INSPIRE SUAVEMENTE', tip: 'Puxe o ar pelo nariz, sem pressa', duration: 4, scale: 'scale-125' },
        { name: 'RETENHA O AR', tip: 'Mantenha o ar nos pulmões com serenidade', duration: 4, scale: 'scale-125' },
        { name: 'EXPIRE LENTAMENTE', tip: 'Solte o ar suavemente pela boca', duration: 4, scale: 'scale-90' },
      ],
    },
    gentle: {
      phases: [
        { name: 'INSPIRE SUAVEMENTE', tip: 'Encha o peito de ar com calma', duration: 4, scale: 'scale-125' },
        { name: 'EXPIRE PROFUNDAMENTE', tip: 'Esvazie devagar, liberando qualquer tensão', duration: 6, scale: 'scale-85' },
      ],
    },
  };

  const activePhases = modes[currentMode].phases;
  const currentPhase = activePhases[phaseIndex] || activePhases[0];

  useEffect(() => {
    if (!isRunning) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = window.setInterval(() => {
      setElapsedSeconds((prev) => {
        if (prev < totalSeconds) {
          return prev + 1;
        }
        return prev;
      });

      setCycleTimer((prev) => {
        if (prev > 1) {
          return prev - 1;
        }

        // Advance to next phase
        setPhaseIndex((currPhaseIdx) => {
          const nextIdx = (currPhaseIdx + 1) % modes[currentMode].phases.length;
          return nextIdx;
        });

        // Set duration of the new phase
        const nextPhaseIdx = (phaseIndex + 1) % modes[currentMode].phases.length;
        return modes[currentMode].phases[nextPhaseIdx].duration;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, currentMode, phaseIndex, totalSeconds]);

  const togglePlay = () => {
    setIsRunning((prev) => !prev);
  };

  const resetSession = () => {
    setIsRunning(false);
    setElapsedSeconds(0);
    setPhaseIndex(0);
    setCycleTimer(modes[currentMode].phases[0].duration);
  };

  const switchMode = (mode: BreathingMode) => {
    setCurrentMode(mode);
    setPhaseIndex(0);
    setCycleTimer(modes[mode].phases[0].duration);
  };

  const cycleSound = () => {
    setSoundIndex((prev) => (prev + 1) % SOUNDS.length);
  };

  const remainingSeconds = Math.max(0, totalSeconds - elapsedSeconds);
  const minutesStr = String(Math.floor(remainingSeconds / 60)).padStart(2, '0');
  const secondsStr = String(remainingSeconds % 60).padStart(2, '0');
  const progressPercent = (elapsedSeconds / totalSeconds) * 100;

  const currentScale = reducedMotion ? 'scale-100' : currentPhase.scale;

  return (
    <div className="flex flex-col w-full pb-6 text-on-surface">
      {/* Top Bar with Session info & exit */}
      <div className="flex flex-col gap-space-sm pt-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onExit}
              className="p-1 -ml-1 text-on-surface-variant hover:text-on-surface rounded-full transition-colors mr-1"
              aria-label="Voltar"
            >
              <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            </button>
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="font-label-md text-label-md text-on-surface-variant">
              Sessão Zen Ativa
            </span>
          </div>

          <div className="flex items-center gap-1 bg-surface-container-high px-2.5 py-1 rounded-full text-on-surface-variant border border-outline-variant/40">
            <span className="material-symbols-outlined text-[16px] text-primary">timer</span>
            <span className="font-label-sm text-label-sm font-semibold tracking-wider text-on-surface font-mono">
              {minutesStr}:{secondsStr}
            </span>
          </div>
        </div>

        {/* Seletor de Ritmo */}
        <div className="flex items-center gap-2 p-1 bg-surface-container-low rounded-full border border-outline-variant/40">
          <button
            type="button"
            onClick={() => switchMode('square')}
            className={`flex-1 py-2 px-3 rounded-full font-label-md text-label-md font-semibold transition-all flex items-center justify-center gap-1.5 ${
              currentMode === 'square'
                ? 'bg-primary-container text-on-primary-container shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">crop_square</span>
            <span>Ritmo 4-4-4</span>
          </button>

          <button
            type="button"
            onClick={() => switchMode('gentle')}
            className={`flex-1 py-2 px-3 rounded-full font-label-md text-label-md font-semibold transition-all flex items-center justify-center gap-1.5 ${
              currentMode === 'gentle'
                ? 'bg-primary-container text-on-primary-container shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">air</span>
            <span>Suave 4-6</span>
          </button>
        </div>
      </div>

      {/* Barra Linear de Progresso da Sessão */}
      <div className="w-full bg-surface-container-high h-1.5 rounded-full mt-4 overflow-hidden">
        <div
          className="bg-primary h-full rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Orbe Central Hipnótico e Respiração */}
      <div className="relative flex flex-col items-center justify-center my-6 min-h-[320px] select-none">
        {/* Aura de fundo bioluminescente */}
        <div className="absolute w-72 h-72 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="absolute w-56 h-56 rounded-full bg-secondary-container/20 blur-2xl pointer-events-none" />

        {/* Anéis concêntricos */}
        <div className="relative flex items-center justify-center w-64 h-64">
          <div
            className={`absolute w-64 h-64 rounded-full bg-primary/5 transition-transform duration-1000 ease-in-out ${currentScale}`}
          />
          <div
            className={`absolute w-52 h-52 rounded-full bg-primary/10 transition-transform duration-1000 ease-in-out ${currentScale}`}
          />
          <div
            className={`absolute w-40 h-40 rounded-full bg-gradient-to-tr from-surface-container-highest via-primary-container/20 to-primary/30 backdrop-blur-md shadow-xl flex flex-col items-center justify-center transition-transform duration-1000 ease-in-out ${currentScale}`}
          >
            <span className="font-display-lg text-display-lg text-primary tracking-tight font-bold font-mono">
              {cycleTimer}
            </span>
          </div>
        </div>

        {/* Feedback e Guia da Fase */}
        <div className="text-center mt-6 flex flex-col items-center max-w-xs">
          <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-semibold px-3 py-1 rounded-full bg-primary-container/15 mb-2 border border-primary/20">
            {currentPhase.name}
          </span>
          <p className="font-body-md text-body-md text-on-surface-variant transition-opacity duration-300">
            {currentPhase.tip}
          </p>
        </div>
      </div>

      {/* Trilha Sonora / Ambient Sound Card */}
      <div className="bg-surface-container-low rounded-xl p-space-sm mb-5 flex items-center justify-between shadow-sm border border-outline-variant/40">
        <div className="flex items-center gap-space-sm">
          <div className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[20px]">{SOUNDS[soundIndex].icon}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-label-md text-label-md font-semibold text-on-surface">Trilha Sonora</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              {isMuted ? 'Silenciado' : SOUNDS[soundIndex].name}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={cycleSound}
            className="h-8 px-3 rounded-full bg-surface-container-high hover:bg-surface-container text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm font-semibold flex items-center gap-1 transition-colors"
          >
            <span className="material-symbols-outlined text-[15px]">swap_horiz</span>
            Mudar
          </button>
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className="w-8 h-8 rounded-full bg-primary-container/20 text-primary flex items-center justify-center transition-colors"
            aria-label={isMuted ? 'Desmutar' : 'Silenciar'}
          >
            <span className="material-symbols-outlined text-[18px]">
              {isMuted ? 'volume_off' : 'volume_up'}
            </span>
          </button>
        </div>
      </div>

      {/* Cartão de Apoio Terapêutico */}
      <div className="bg-surface-container rounded-xl p-space-sm mb-6 flex items-start gap-space-sm border border-outline-variant/40">
        <span className="material-symbols-outlined text-tertiary text-[22px] mt-0.5">spa</span>
        <div className="flex flex-col">
          <span className="font-label-md text-label-md font-semibold text-tertiary">Ancoragem Somática</span>
          <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
            Mantenha os ombros relaxados e permita que o abdômen se expanda suavemente a cada inspiração.
          </p>
        </div>
      </div>

      {/* Controles Inferiores do Player */}
      <div className="flex items-center justify-between gap-space-sm mt-auto pt-2">
        {/* Reiniciar */}
        <button
          type="button"
          onClick={resetSession}
          className="flex-1 py-3 px-3 rounded-2xl bg-surface-container-low text-on-surface-variant hover:text-on-surface flex flex-col items-center justify-center gap-1 active:scale-95 transition-all border border-outline-variant/40"
        >
          <span className="material-symbols-outlined text-[20px]">restart_alt</span>
          <span className="font-label-sm text-label-sm font-medium">Reiniciar</span>
        </button>

        {/* Botão Central Play / Pausa */}
        <button
          type="button"
          onClick={togglePlay}
          className="flex-[1.5] py-3.5 px-4 rounded-2xl bg-primary text-on-primary font-headline-sm text-headline-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:opacity-95 active:scale-95 transition-all font-semibold"
        >
          <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            {isRunning ? 'pause' : 'play_arrow'}
          </span>
          <span className="font-label-lg text-label-lg">
            {isRunning ? 'Pausar' : 'Retomar'}
          </span>
        </button>

        {/* Concluir */}
        <button
          type="button"
          onClick={() => onFinish('Respiração Guiada')}
          className="flex-1 py-3 px-3 rounded-2xl bg-surface-container-low text-on-surface-variant hover:text-on-surface flex flex-col items-center justify-center gap-1 active:scale-95 transition-all border border-outline-variant/40"
        >
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          <span className="font-label-sm text-label-sm font-medium">Concluir</span>
        </button>
      </div>

      {/* Switch link if breathless */}
      <div className="text-center pt-4">
        <button
          type="button"
          onClick={onSwitchActivity}
          className="text-xs text-on-surface-variant hover:text-primary underline transition-colors"
        >
          Sentiu desconforto? Clique aqui para experimentar aterramento sensorial.
        </button>
      </div>
    </div>
  );
};
