import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';
import { IntensitySlider } from '../ui/Slider';
import { EMOTIONS } from '../../constants';
import { EmotionalRecordInput } from '../../types';
import { recordsService } from '../../services/recordsService';
import { useAuth } from '../../contexts/AuthContext';
import { Check } from 'lucide-react';

export interface CheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRecordCreated?: () => void;
}

export const CheckInModal: React.FC<CheckInModalProps> = ({
  isOpen,
  onClose,
  onRecordCreated,
}) => {
  const { user } = useAuth();
  const [selectedEmotion, setSelectedEmotion] = useState<string>('calma');
  const [intensity, setIntensity] = useState<number>(3);
  const [notes, setNotes] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!user) return;
    setError(null);
    setLoading(true);

    try {
      const input: EmotionalRecordInput = {
        primary_emotion: selectedEmotion,
        intensity,
        notes: notes.trim() || null,
        record_timestamp: new Date().toISOString(),
      };

      await recordsService.createRecord(user.id, input);
      setNotes('');
      onRecordCreated?.();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar check-in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Como você está agora?"
      description="Um registro breve para ouvir seu próprio estado, sem julgamentos."
      maxWidth="md"
    >
      <div className="space-y-5">
        {error && (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-900/60 text-xs text-rose-300">
            {error}
          </div>
        )}

        {/* Emotion Selector Grid */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-neutral-300">
            Qual emoção melhor descreve este momento?
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {EMOTIONS.slice(0, 6).map((emo) => {
              const isSelected = selectedEmotion === emo.id;
              return (
                <button
                  type="button"
                  key={emo.id}
                  onClick={() => setSelectedEmotion(emo.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                    isSelected
                      ? 'border-sage-500 bg-sage-950/70 text-white font-medium'
                      : 'border-charcoal-700/80 bg-charcoal-850 hover:border-charcoal-600 text-neutral-300'
                  }`}
                >
                  <span className="text-xs truncate">{emo.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-sage-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Intensity slider */}
        <IntensitySlider
          value={intensity}
          onChange={setIntensity}
          label="Intensidade percebida da emoção"
        />

        {/* Optional Note */}
        <Textarea
          label="Quer acrescentar alguma reflexão ou contexto? (opcional)"
          placeholder="Ex: Tive uma reunião densa agora há pouco, percebi os ombros tensos..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          maxLength={1000}
        />

        {/* Action buttons */}
        <div className="pt-2 flex items-center justify-end gap-3 border-t border-charcoal-800">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button size="sm" onClick={handleSave} isLoading={loading}>
            Salvar check-in
          </Button>
        </div>
      </div>
    </Modal>
  );
};
