import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Eye, Hand, Ear, Wind, Coffee, ChevronRight, ChevronLeft, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { recordsService } from '../../services/recordsService';

export interface GroundingExerciseProps {
  onFinish: (name: string, savedRecordId?: string) => void;
  onExit: () => void;
}

const STEPS = [
  {
    count: 5,
    title: '5 coisas que você consegue VER',
    icon: Eye,
    instruction:
      'Olhe ao redor com calma. Não precisa ser nada especial: pode ser um reflexo de luz, a textura de uma parede, um objeto sobre a mesa ou a cor de uma peça de roupa.',
    examples: 'Ex: um livro na estante, a borda da janela, uma sombra no chão...',
  },
  {
    count: 4,
    title: '4 coisas que você consegue TOCAR ou SENTIR na pele',
    icon: Hand,
    instruction:
      'Perceba os pontos de contato físico do momento. A textura da roupa que está vestindo, a sola dos pés encostando no chão, a temperatura do ar nas mãos ou o apoio da cadeira nas costas.',
    examples: 'Ex: o tecido macio da manga, o chão firme sob os pés, a superfície lisa da mesa...',
  },
  {
    count: 3,
    title: '3 coisas que você consegue OUVIR',
    icon: Ear,
    instruction:
      'Foque a atenção nos sons do ambiente imediato ou distante. Pode ser o barulho suave de um ventilador, o trânsito lá fora, passos ao longe ou até a própria respiração.',
    examples: 'Ex: vento lá fora, zumbido sutil do computador, pessoas conversando ao longe...',
  },
  {
    count: 2,
    title: '2 coisas que você consegue CHEIRAR',
    icon: Wind,
    instruction:
      'Observe os aromas ao seu redor. Pode ser o cheiro do ambiente, de café fresco, do sabonete nas mãos ou simplesmente o ar fresco de uma janela aberta.',
    examples: 'Se não sentir cheiros óbvios, apenas observe o ar neutro que entra pelo nariz.',
  },
  {
    count: 1,
    title: '1 coisa que você consegue SABOREAR',
    icon: Coffee,
    instruction:
      'Perceba o sabor atual na sua boca. Pode ser o resquício de um café, da pasta de dente, de um gole de água ou simplesmente a sensação neutra da boca relaxada.',
    examples: 'Ex: resquício de chá, água fresca, menta...',
  },
];

export const GroundingExercise: React.FC<GroundingExerciseProps> = ({
  onFinish,
  onExit,
}) => {
  const { user } = useAuth();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [notesPerStep, setNotesPerStep] = useState<Record<number, string>>({});
  const [isFinishing, setIsFinishing] = useState(false);

  const currentStep = STEPS[currentStepIndex];
  const Icon = currentStep.icon;

  const handleNext = async () => {
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      setIsFinishing(true);
      const hasNotes = Object.values(notesPerStep).some((v) => v.trim().length > 0);
      let recId: string | undefined;

      if (hasNotes && user) {
        try {
          const formattedNotes = STEPS.map(
            (step, idx) => `• ${step.title}\n${notesPerStep[idx] || '—'}`
          ).join('\n\n');

          const rec = await recordsService.createRecord(user.id, {
            primary_emotion: 'calma',
            intensity: 3,
            activity_used: 'Aterramento Sensorial (5-4-3-2-1)',
            notes: formattedNotes,
            context: 'Exercício de presença somática 5-4-3-2-1',
          });
          recId = rec.id;
        } catch (err) {
          console.warn('Erro ao salvar aterramento:', err);
        }
      }
      setIsFinishing(false);
      onFinish('Aterramento Sensorial (5-4-3-2-1)', recId);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="space-y-6 text-on-surface">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-outline-variant/40">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-primary text-xl">self_improvement</span>
            <h3 className="text-base font-semibold text-on-surface">
              Aterramento Sensorial (5-4-3-2-1)
            </h3>
          </div>
          <p className="text-xs text-on-surface-variant">
            Conectando a atenção com os sentidos do momento presente.
          </p>
        </div>
        <button
          type="button"
          onClick={onExit}
          className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
          aria-label="Encerrar exercício"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Steps progress indicator */}
      <div className="flex items-center justify-between gap-1.5 px-1">
        {STEPS.map((step, idx) => (
          <div
            key={step.count}
            className={`flex-1 h-1.5 rounded-full transition-all ${
              idx === currentStepIndex
                ? 'bg-primary shadow-[0_0_8px_rgba(90,240,179,0.5)]'
                : idx < currentStepIndex
                ? 'bg-primary/40'
                : 'bg-surface-container-high'
            }`}
          />
        ))}
      </div>

      {/* Main step content card */}
      <div className="p-6 rounded-3xl bg-surface-container-low border border-outline-variant/40 space-y-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
              Etapa {currentStepIndex + 1} de {STEPS.length}
            </span>
            <h4 className="text-base font-bold text-on-surface">
              {currentStep.title}
            </h4>
          </div>
        </div>

        <p className="text-sm text-on-surface-variant leading-relaxed">
          {currentStep.instruction}
        </p>

        <p className="text-xs text-secondary italic bg-surface-container p-3 rounded-2xl border border-outline-variant/30">
          {currentStep.examples}
        </p>

        {/* Optional note input for this step */}
        <div>
          <input
            type="text"
            placeholder="Se quiser, anote o que percebeu aqui (opcional)"
            value={notesPerStep[currentStepIndex] || ''}
            onChange={(e) =>
              setNotesPerStep({ ...notesPerStep, [currentStepIndex]: e.target.value })
            }
            className="w-full px-4 py-2.5 rounded-2xl bg-surface-container border border-outline-variant/60 text-xs text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:border-primary focus:bg-surface-container-high transition-colors"
          />
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between pt-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePrev}
          disabled={currentStepIndex === 0}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Etapa anterior
        </Button>

        <Button
          size="md"
          onClick={handleNext}
          isLoading={isFinishing}
          className="px-6 font-semibold"
        >
          {currentStepIndex === STEPS.length - 1 ? (
            'Finalizar exercício'
          ) : (
            <>
              Próxima etapa
              <ChevronRight className="w-4 h-4 ml-1" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
