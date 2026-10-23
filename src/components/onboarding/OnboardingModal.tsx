import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { usePreferences } from '../../contexts/PreferencesContext';
import { useAuth } from '../../contexts/AuthContext';
import { Check } from 'lucide-react';

export interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const { preferences, updatePreferences } = usePreferences();
  const { user, updateDisplayName } = useAuth();

  const [name, setName] = useState(user?.display_name || '');
  const [exerciseMode, setExerciseMode] = useState<'all' | 'calm' | 'somatic' | 'cognitive'>(
    preferences?.preferred_exercise_mode || 'all'
  );
  const [reducedMotion, setReducedMotion] = useState(preferences?.reduced_motion || false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (name.trim() && name !== user?.display_name) {
        await updateDisplayName(name.trim());
      }
      await updatePreferences({
        preferred_exercise_mode: exerciseMode,
        reduced_motion: reducedMotion,
        onboarding_completed: true,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const handleSkip = async () => {
    setSaving(true);
    try {
      await updatePreferences({ onboarding_completed: true });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleSkip}
      title="Boas-vindas ao Froid Care"
      description="Um momento curto e opcional para adaptar o espaço ao seu ritmo."
      maxWidth="md"
    >
      <div className="space-y-5 text-sm">
        {/* Name Input */}
        <Input
          label="Como você prefere ser chamado(a)?"
          placeholder="Ex: Matheus ou apelido"
          value={name}
          onChange={(e) => setName(e.target.value)}
          helperText="Usado apenas na saudação da sua tela inicial."
        />

        {/* Exercise Preferences */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-neutral-300">
            Quais tipos de apoio você prefere encontrar?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { id: 'all', label: 'Todos os tipos', desc: 'Respiração, sentidos, corpo e reflexão' },
              { id: 'calm', label: 'Mais respiratórios', desc: 'Foco no ritmo e pausas suaves' },
              { id: 'somatic', label: 'Sensoriais e corporais', desc: 'Aterramento 5-4-3-2-1 e relaxamento' },
              { id: 'cognitive', label: 'Organização mental', desc: 'Perguntas guiadas e escrita livre' },
            ].map((opt) => (
              <button
                type="button"
                key={opt.id}
                onClick={() => setExerciseMode(opt.id as any)}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  exerciseMode === opt.id
                    ? 'border-sage-600 bg-sage-950/60 text-white'
                    : 'border-charcoal-700/80 bg-charcoal-850 hover:border-charcoal-600 text-neutral-300'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-medium text-xs text-neutral-200">{opt.label}</span>
                  {exerciseMode === opt.id && <Check className="w-3.5 h-3.5 text-sage-400" />}
                </div>
                <span className="text-[11px] text-neutral-400 mt-1">{opt.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Accessibility: Reduced motion toggle */}
        <div className="p-3 rounded-xl bg-charcoal-850 border border-charcoal-700/80 flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-xs font-medium text-neutral-200 block">
              Reduzir animações visuais
            </span>
            <span className="text-[11px] text-neutral-400 block">
              Ideal para quem prefere transições instantâneas sem movimento.
            </span>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={reducedMotion}
            onClick={() => setReducedMotion((prev) => !prev)}
            className={`w-11 h-6 rounded-full transition-colors p-0.5 focus:outline-none ${
              reducedMotion ? 'bg-sage-600' : 'bg-charcoal-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                reducedMotion ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Actions */}
        <div className="pt-2 flex items-center justify-between border-t border-charcoal-800">
          <Button variant="ghost" size="sm" onClick={handleSkip} disabled={saving}>
            Pular por enquanto
          </Button>
          <Button size="sm" onClick={handleSave} isLoading={saving}>
            Concluir e iniciar
          </Button>
        </div>
      </div>
    </Modal>
  );
};
