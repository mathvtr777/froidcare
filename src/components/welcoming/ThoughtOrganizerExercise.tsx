import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';
import { recordsService } from '../../services/recordsService';
import { useAuth } from '../../contexts/AuthContext';

export interface ThoughtOrganizerExerciseProps {
  onFinish: (name: string, savedRecordId?: string) => void;
  onExit: () => void;
}

const QUESTIONS = [
  {
    title: '1. O que está passando pela minha mente agora?',
    prompt:
      'Coloque em palavras os pensamentos soltos, preocupações ou diálogos internos. Apenas observe-os como pensamentos, sem julgá-los como certos ou errados.',
    placeholder: 'Ex: Estou preocupado com o prazo de amanhã e com o que as pessoas vão achar...',
  },
  {
    title: '2. O que estou sentindo no corpo e nas emoções neste momento?',
    prompt:
      'Reconheça o que está presente em você agora (tensão, cansaço, agitação, dúvida). Seus sentimentos são válidos e não precisam ser escondidos.',
    placeholder: 'Ex: Sinto o peito apertado e uma sensação de pressa interna...',
  },
  {
    title: '3. O que sei de FATO sobre esta situação?',
    prompt:
      'Quais são os dados concretos e objetivos que existem hoje, separando fatos verificáveis de previsões ou suposições da mente?',
    placeholder: 'Ex: O fato concreto é que tenho que entregar uma tarefa até às 17h...',
  },
  {
    title: '4. O que ainda NÃO tenho como saber com certeza?',
    prompt:
      'Muitas vezes sofremos antecipando cenários incertos. O que foge do seu controle imediato ou ainda é apenas uma possibilidade hipotética?',
    placeholder: 'Ex: Não tenho como prever exatamente a reação do cliente antes da reunião...',
  },
  {
    title: '5. Qual é um pequeno passo simples que posso escolher agora?',
    prompt:
      'Não precisa ser uma solução grandiosa. Pode ser tomar um copo d’água, organizar uma lista de prioridades ou respirar por dois minutos.',
    placeholder: 'Ex: Fazer uma pausa de 5 minutos e depois focar apenas no primeiro item da lista...',
  },
];

export const ThoughtOrganizerExercise: React.FC<ThoughtOrganizerExerciseProps> = ({
  onFinish,
  onExit,
}) => {
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>(['', '', '', '', '']);
  const [saveToDiary, setSaveToDiary] = useState(true);
  const [saving, setSaving] = useState(false);

  const currentQ = QUESTIONS[step];

  const handleNext = () => {
    if (step < QUESTIONS.length - 1) {
      setStep((s) => s + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep((s) => s - 1);
    }
  };

  const handleComplete = async () => {
    if (saveToDiary && user) {
      setSaving(true);
      try {
        const formattedNotes = QUESTIONS.map(
          (q, idx) => `• ${q.title}\n${answers[idx] || '—'}`
        ).join('\n\n');

        const rec = await recordsService.createRecord(user.id, {
          primary_emotion: 'confusao',
          intensity: 4,
          activity_used: 'Organizando os Pensamentos',
          notes: formattedNotes,
          context: 'Exercício de reflexão guiada',
        });
        onFinish('Organizando os Pensamentos', rec.id);
      } catch (err) {
        console.warn('Erro ao salvar no diário:', err);
        onFinish('Organizando os Pensamentos');
      } finally {
        setSaving(false);
      }
    } else {
      onFinish('Organizando os Pensamentos');
    }
  };

  return (
    <div className="space-y-6 text-on-surface">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-outline-variant/40">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-primary text-xl">psychology</span>
            <h3 className="text-base font-semibold text-on-surface">
              Organizando os Pensamentos
            </h3>
          </div>
          <p className="text-xs text-on-surface-variant">
            Perguntas estruturadas para criar clareza e acolher incertezas.
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

      {/* Steps dots */}
      <div className="flex items-center gap-1.5 px-1">
        {QUESTIONS.map((_, idx) => (
          <div
            key={idx}
            className={`flex-1 h-1.5 rounded-full transition-all ${
              idx === step
                ? 'bg-primary shadow-[0_0_8px_rgba(90,240,179,0.5)]'
                : idx < step
                ? 'bg-primary/40'
                : 'bg-surface-container-high'
            }`}
          />
        ))}
      </div>

      {/* Question Card */}
      <div className="p-6 rounded-3xl bg-surface-container-low border border-outline-variant/40 space-y-4">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
          Reflexão {step + 1} de {QUESTIONS.length}
        </span>
        <h4 className="text-base font-bold text-on-surface">{currentQ.title}</h4>
        <p className="text-xs text-on-surface-variant leading-relaxed">{currentQ.prompt}</p>

        <Textarea
          placeholder={currentQ.placeholder}
          value={answers[step]}
          onChange={(e) => {
            const val = e.target.value;
            setAnswers((prev) => {
              const updated = [...prev];
              updated[step] = val;
              return updated;
            });
          }}
          className="min-h-[110px]"
        />
      </div>

      {/* Save to diary option at final step */}
      {step === QUESTIONS.length - 1 && (
        <label className="flex items-center gap-2.5 text-xs text-on-surface cursor-pointer p-3.5 rounded-2xl bg-surface-container border border-outline-variant/50">
          <input
            type="checkbox"
            checked={saveToDiary}
            onChange={(e) => setSaveToDiary(e.target.checked)}
            className="rounded accent-primary w-4 h-4"
          />
          <span>Salvar minhas reflexões com segurança no Diário Emocional</span>
        </label>
      )}

      {/* Buttons */}
      <div className="flex items-center justify-between pt-2">
        <Button variant="ghost" size="sm" onClick={handlePrev} disabled={step === 0}>
          <ChevronLeft className="w-4 h-4 mr-1" />
          Pergunta anterior
        </Button>

        <Button size="md" onClick={handleNext} isLoading={saving} className="px-6 font-semibold">
          {step === QUESTIONS.length - 1 ? (
            'Finalizar e concluir'
          ) : (
            <>
              Próxima pergunta
              <ChevronRight className="w-4 h-4 ml-1" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
