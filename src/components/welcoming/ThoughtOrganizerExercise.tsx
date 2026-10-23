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
    <div className="space-y-6 text-neutral-100">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-charcoal-800">
        <div>
          <h3 className="text-base font-semibold text-neutral-100">
            Organizando os Pensamentos
          </h3>
          <p className="text-xs text-neutral-400">
            Perguntas estruturadas para criar clareza e acolher incertezas.
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

      {/* Steps dots */}
      <div className="flex items-center gap-1.5 px-2">
        {QUESTIONS.map((_, idx) => (
          <div
            key={idx}
            className={`flex-1 h-1.5 rounded-full transition-colors ${
              idx === step
                ? 'bg-sage-500'
                : idx < step
                ? 'bg-sage-800'
                : 'bg-charcoal-800'
            }`}
          />
        ))}
      </div>

      {/* Question Card */}
      <div className="p-6 rounded-2xl bg-charcoal-900 border border-charcoal-800 space-y-4">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-sage-400">
          Reflexão {step + 1} de {QUESTIONS.length}
        </span>
        <h4 className="text-base font-bold text-neutral-100">{currentQ.title}</h4>
        <p className="text-xs text-neutral-300 leading-relaxed">{currentQ.prompt}</p>

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
        <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer p-2 rounded-xl bg-charcoal-850 border border-charcoal-800">
          <input
            type="checkbox"
            checked={saveToDiary}
            onChange={(e) => setSaveToDiary(e.target.checked)}
            className="rounded accent-sage-500 w-4 h-4"
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

        <Button size="md" onClick={handleNext} isLoading={saving} className="px-5 font-semibold">
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
