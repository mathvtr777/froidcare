import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { X, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';

export interface RelaxationExerciseProps {
  onFinish: (name: string) => void;
  onExit: () => void;
}

const BODY_REGIONS = [
  {
    region: 'Ombros e Pescoço',
    cue: 'Perceba a posição dos seus ombros.',
    guidance:
      'Geralmente carregamos tensões sem notar. Apenas observe se os ombros estão erguidos ou contraídos. Sem forçar, permita que eles desçam um centímetro, soltando o peso suavemente em direção ao chão.',
  },
  {
    region: 'Mandíbula e Rosto',
    cue: 'Observe os dentes e a testa.',
    guidance:
      'Veja se os dentes estão travados ou a mandíbula cerrada. Deixe um pequeno espaço entre os dentes superiores e inferiores. Solte o ponto entre as sobrancelhas e deixe a língua repousar solta na boca.',
  },
  {
    region: 'Mãos e Braços',
    cue: 'Perceba as palmas e os dedos das mãos.',
    guidance:
      'Se as mãos estiverem fechadas em punho ou segurando algo com força, abra os dedos devagar. Sinta o calor ou a temperatura do ar nas palmas e deixe os braços descansarem pesados.',
  },
  {
    region: 'Abdômen e Peito',
    cue: 'Observe a movimentação ao respirar.',
    guidance:
      'Sem tentar mudar ou corrigir sua postura de forma rígida, permita que a barriga se mova naturalmente ao respirar. Deixe de lado a preocupação de "segurar" o abdômen por alguns instantes.',
  },
  {
    region: 'Pernas e Pés',
    cue: 'Sinta o contato firme com a superfície.',
    guidance:
      'Perceba as coxas apoiadas na cadeira ou cama, e a sola dos pés no chão. Deixe o peso das pernas ser totalmente sustentado pelo que está embaixo de você. Você não precisa segurar nada agora.',
  },
];

export const RelaxationExercise: React.FC<RelaxationExerciseProps> = ({
  onFinish,
  onExit,
}) => {
  const [index, setIndex] = useState(0);
  const current = BODY_REGIONS[index];

  const handleNext = () => {
    if (index < BODY_REGIONS.length - 1) {
      setIndex((i) => i + 1);
    } else {
      onFinish('Relaxamento Corporal');
    }
  };

  const handlePrev = () => {
    if (index > 0) {
      setIndex((i) => i - 1);
    }
  };

  return (
    <div className="space-y-6 text-neutral-100">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-charcoal-800">
        <div>
          <h3 className="text-base font-semibold text-neutral-100">
            Relaxamento Corporal
          </h3>
          <p className="text-xs text-neutral-400">
            Pausa suave para soltar tensões acumuladas, sem cobrança de relaxamento perfeito.
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

      {/* Progress pill indicator */}
      <div className="flex justify-between items-center text-xs text-neutral-400 px-1">
        <span>Região {index + 1} de {BODY_REGIONS.length}</span>
        <span className="text-sage-400 font-medium">{current.region}</span>
      </div>

      {/* Content box */}
      <div className="p-6 rounded-2xl bg-charcoal-900 border border-charcoal-800 space-y-4">
        <h4 className="text-lg font-bold text-neutral-100 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-sage-400" />
          {current.region}
        </h4>

        <div className="p-3 rounded-xl bg-sage-950/50 border border-sage-800/60 text-xs text-sage-300 font-medium">
          {current.cue}
        </div>

        <p className="text-sm text-neutral-300 leading-relaxed">
          {current.guidance}
        </p>

        <p className="text-[11px] text-neutral-400 border-t border-charcoal-800/80 pt-3">
          Nota: Se qualquer região estiver dolorida ou causar desconforto, pule-a imediatamente.
          Não force nenhuma postura que cause dor.
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between pt-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePrev}
          disabled={index === 0}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Região anterior
        </Button>

        <Button size="md" onClick={handleNext} className="px-5 font-semibold">
          {index === BODY_REGIONS.length - 1 ? (
            'Finalizar relaxamento'
          ) : (
            <>
              Próxima região
              <ChevronRight className="w-4 h-4 ml-1" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
