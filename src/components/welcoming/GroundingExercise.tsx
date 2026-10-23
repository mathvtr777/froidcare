import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Eye, Hand, Ear, Wind, Coffee, ChevronRight, ChevronLeft, X } from 'lucide-react';

export interface GroundingExerciseProps {
  onFinish: (name: string) => void;
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
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [notesPerStep, setNotesPerStep] = useState<Record<number, string>>({});

  const currentStep = STEPS[currentStepIndex];
  const Icon = currentStep.icon;

  const handleNext = () => {
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      onFinish('Aterramento Sensorial (5-4-3-2-1)');
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="space-y-6 text-neutral-100">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-charcoal-800">
        <div>
          <h3 className="text-base font-semibold text-neutral-100">
            Aterramento Sensorial (5-4-3-2-1)
          </h3>
          <p className="text-xs text-neutral-400">
            Conectando a atenção com os sentidos do momento presente.
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

      {/* Steps progress indicator */}
      <div className="flex items-center justify-between gap-1.5 px-2">
        {STEPS.map((step, idx) => (
          <div
            key={step.count}
            className={`flex-1 h-1.5 rounded-full transition-colors ${
              idx === currentStepIndex
                ? 'bg-sage-500'
                : idx < currentStepIndex
                ? 'bg-sage-800'
                : 'bg-charcoal-800'
            }`}
          />
        ))}
      </div>

      {/* Main step content card */}
      <div className="p-6 rounded-2xl bg-charcoal-900 border border-charcoal-800 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-sage-950/80 border border-sage-800/80 flex items-center justify-center text-sage-400">
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-sage-400">
              Etapa {currentStepIndex + 1} de {STEPS.length}
            </span>
            <h4 className="text-base font-bold text-neutral-100">
              {currentStep.title}
            </h4>
          </div>
        </div>

        <p className="text-sm text-neutral-300 leading-relaxed">
          {currentStep.instruction}
        </p>

        <p className="text-xs text-neutral-400 italic bg-charcoal-850 p-2.5 rounded-xl border border-charcoal-750">
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
            className="w-full px-3 py-2 rounded-xl bg-charcoal-950 border border-charcoal-800 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-sage-500"
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
          className="px-5 font-semibold"
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
