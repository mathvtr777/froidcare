import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { IntensitySlider } from '../ui/Slider';
import { EMOTIONS, COMMON_TRIGGERS, EXERCISES } from '../../constants';
import { EmotionalRecord, EmotionalRecordInput } from '../../types';
import { recordsService } from '../../services/recordsService';
import { useAuth } from '../../contexts/AuthContext';
import { format } from 'date-fns';

export interface DiaryRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  recordToEdit?: EmotionalRecord | null;
  onRecordSaved: () => void;
}

export const DiaryRecordModal: React.FC<DiaryRecordModalProps> = ({
  isOpen,
  onClose,
  recordToEdit,
  onRecordSaved,
}) => {
  const { user } = useAuth();

  // Format local date for datetime-local input: 'YYYY-MM-DDTHH:mm'
  const getInitialDateTime = (isoString?: string) => {
    const d = isoString ? new Date(isoString) : new Date();
    return format(d, "yyyy-MM-dd'T'HH:mm");
  };

  const [dateTimeLocal, setDateTimeLocal] = useState<string>(getInitialDateTime());
  const [primaryEmotion, setPrimaryEmotion] = useState<string>('calma');
  const [secondaryEmotions, setSecondaryEmotions] = useState<string[]>([]);
  const [intensity, setIntensity] = useState<number>(4);
  const [context, setContext] = useState<string>('');
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [customTriggerInput, setCustomTriggerInput] = useState<string>('');
  const [sleepQuality, setSleepQuality] = useState<number | null>(null);
  const [notes, setNotes] = useState<string>('');
  const [activityUsed, setActivityUsed] = useState<string>('');
  const [postIntensity, setPostIntensity] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (recordToEdit) {
      setDateTimeLocal(getInitialDateTime(recordToEdit.record_timestamp));
      setPrimaryEmotion(recordToEdit.primary_emotion);
      setSecondaryEmotions(recordToEdit.secondary_emotions || []);
      setIntensity(recordToEdit.intensity);
      setContext(recordToEdit.context || '');
      setSelectedTriggers(recordToEdit.triggers || []);
      setSleepQuality(recordToEdit.sleep_quality ?? null);
      setNotes(recordToEdit.notes || '');
      setActivityUsed(recordToEdit.activity_used || '');
      setPostIntensity(recordToEdit.post_intensity ?? null);
    } else {
      setDateTimeLocal(getInitialDateTime());
      setPrimaryEmotion('calma');
      setSecondaryEmotions([]);
      setIntensity(4);
      setContext('');
      setSelectedTriggers([]);
      setSleepQuality(null);
      setNotes('');
      setActivityUsed('');
      setPostIntensity(null);
    }
    setError(null);
  }, [recordToEdit, isOpen]);

  const toggleSecondaryEmotion = (emoId: string) => {
    if (emoId === primaryEmotion) return;
    setSecondaryEmotions((prev) =>
      prev.includes(emoId) ? prev.filter((id) => id !== emoId) : [...prev, emoId]
    );
  };

  const toggleTrigger = (trigger: string) => {
    setSelectedTriggers((prev) =>
      prev.includes(trigger) ? prev.filter((t) => t !== trigger) : [...prev, trigger]
    );
  };

  const handleAddCustomTrigger = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && customTriggerInput.trim()) {
      e.preventDefault();
      const val = customTriggerInput.trim();
      if (!selectedTriggers.includes(val)) {
        setSelectedTriggers((prev) => [...prev, val]);
      }
      setCustomTriggerInput('');
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setError(null);
    setLoading(true);

    try {
      // Convert datetime-local to ISO preserving local moment
      const timestampIso = new Date(dateTimeLocal).toISOString();

      const input: EmotionalRecordInput = {
        record_timestamp: timestampIso,
        primary_emotion: primaryEmotion,
        secondary_emotions: secondaryEmotions,
        intensity,
        context: context.trim() || null,
        triggers: selectedTriggers,
        sleep_quality: sleepQuality,
        notes: notes.trim() || null,
        activity_used: activityUsed.trim() || null,
        post_intensity: postIntensity,
      };

      if (recordToEdit) {
        await recordsService.updateRecord(user.id, recordToEdit.id, input);
      } else {
        await recordsService.createRecord(user.id, input);
      }

      onRecordSaved();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar registro.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={recordToEdit ? 'Editar Registro Emocional' : 'Novo Registro no Diário'}
      description="Preencha apenas o que fizer sentido para você agora. Todos os campos adicionais são opcionais."
      maxWidth="xl"
    >
      <div className="space-y-6 text-sm">
        {error && (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-900/60 text-xs text-rose-300">
            {error}
          </div>
        )}

        {/* Date and Time Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Data e Horário do Registro"
            type="datetime-local"
            value={dateTimeLocal}
            onChange={(e) => setDateTimeLocal(e.target.value)}
            required
          />

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              Atividade realizada (opcional)
            </label>
            <select
              value={activityUsed}
              onChange={(e) => setActivityUsed(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-900 border border-charcoal-700/80 text-neutral-100 text-sm focus:outline-none focus:border-sage-500"
            >
              <option value="">Nenhuma atividade específica</option>
              {EXERCISES.map((ex) => (
                <option key={ex.id} value={ex.title}>
                  {ex.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Primary Emotion Selector */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-neutral-300">
            Emoção principal <span className="text-sage-400">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {EMOTIONS.map((emo) => {
              const isSelected = primaryEmotion === emo.id;
              return (
                <button
                  type="button"
                  key={emo.id}
                  onClick={() => {
                    setPrimaryEmotion(emo.id);
                    setSecondaryEmotions((prev) => prev.filter((id) => id !== emo.id));
                  }}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    isSelected
                      ? 'border-sage-500 bg-sage-950 text-white font-medium shadow-sm'
                      : 'border-charcoal-700/80 bg-charcoal-850 hover:border-charcoal-600 text-neutral-300'
                  }`}
                >
                  <span className="text-xs block truncate">{emo.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Secondary emotions (optional) */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-neutral-400">
            Outras sensações presentes em conjunto (opcional)
          </label>
          <div className="flex flex-wrap gap-1.5">
            {EMOTIONS.filter((e) => e.id !== primaryEmotion).map((emo) => {
              const isSelected = secondaryEmotions.includes(emo.id);
              return (
                <button
                  type="button"
                  key={emo.id}
                  onClick={() => toggleSecondaryEmotion(emo.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs transition-colors border ${
                    isSelected
                      ? 'bg-charcoal-700 border-charcoal-500 text-neutral-100'
                      : 'bg-charcoal-850 border-charcoal-800 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {emo.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Intensity Slider */}
        <IntensitySlider
          value={intensity}
          onChange={setIntensity}
          label="Intensidade percebida da emoção principal (0 a 10)"
        />

        {/* Post intensity if activity was used */}
        {activityUsed && (
          <div className="p-3.5 rounded-xl bg-charcoal-850 border border-charcoal-750 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-200">
                Registrou mudança após a atividade?
              </span>
              {postIntensity !== null && (
                <button
                  type="button"
                  onClick={() => setPostIntensity(null)}
                  className="text-[11px] text-neutral-400 hover:text-neutral-200"
                >
                  Limpar
                </button>
              )}
            </div>
            <IntensitySlider
              value={postIntensity ?? intensity}
              onChange={(v) => setPostIntensity(v)}
              label="Intensidade sentida após o exercício (0 a 10)"
            />
          </div>
        )}

        {/* Context / Situation */}
        <Input
          label="Contexto ou situação do momento (opcional)"
          placeholder="Ex: Em casa antes de dormir, após conversa familiar..."
          value={context}
          onChange={(e) => setContext(e.target.value)}
        />

        {/* Triggers Tags */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-neutral-300">
            Fatores ou gatilhos identificados (opcional)
          </label>
          <div className="flex flex-wrap gap-1.5">
            {COMMON_TRIGGERS.map((trig) => {
              const active = selectedTriggers.includes(trig);
              return (
                <button
                  type="button"
                  key={trig}
                  onClick={() => toggleTrigger(trig)}
                  className={`px-2.5 py-1 rounded-lg text-xs transition-colors border ${
                    active
                      ? 'bg-sage-950 border-sage-700 text-sage-300'
                      : 'bg-charcoal-850 border-charcoal-800 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {trig}
                </button>
              );
            })}
          </div>
          <input
            type="text"
            placeholder="Adicionar outro fator (pressione Enter)"
            value={customTriggerInput}
            onChange={(e) => setCustomTriggerInput(e.target.value)}
            onKeyDown={handleAddCustomTrigger}
            className="w-full px-3 py-1.5 rounded-lg bg-charcoal-900 border border-charcoal-800 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-sage-500"
          />
        </div>

        {/* Sleep quality perception (1-5) */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-neutral-300">
            Percepção da qualidade do sono recente (opcional)
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((val) => {
              const isSelected = sleepQuality === val;
              const labels = ['Muito ruim', 'Ruim', 'Regular', 'Bom', 'Repousante'];
              return (
                <button
                  type="button"
                  key={val}
                  onClick={() => setSleepQuality(sleepQuality === val ? null : val)}
                  className={`flex-1 py-2 px-1 text-center rounded-xl border text-xs transition-colors ${
                    isSelected
                      ? 'border-sage-600 bg-sage-950/70 text-sage-300 font-semibold'
                      : 'border-charcoal-800 bg-charcoal-850 text-neutral-400 hover:text-neutral-200'
                  }`}
                  title={labels[val - 1]}
                >
                  <span className="block text-sm font-bold">{val}</span>
                  <span className="block text-[10px] truncate">{labels[val - 1]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Free notes */}
        <Textarea
          label="Anotações livres (opcional)"
          placeholder="Espaço aberto para expressar pensamentos, sensações físicas, insights..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          maxLength={3000}
        />

        {/* Footer actions */}
        <div className="pt-3 flex items-center justify-end gap-3 border-t border-charcoal-800">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button size="sm" onClick={handleSave} isLoading={loading}>
            {recordToEdit ? 'Atualizar registro' : 'Salvar no diário'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
