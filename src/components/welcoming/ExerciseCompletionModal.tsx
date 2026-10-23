import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { IntensitySlider } from '../ui/Slider';
import { recordsService } from '../../services/recordsService';
import { useAuth } from '../../contexts/AuthContext';
import { Sparkles } from 'lucide-react';

export interface ExerciseCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  activityName: string;
  savedRecordId?: string;
  initialIntensity?: number;
}

export const ExerciseCompletionModal: React.FC<ExerciseCompletionModalProps> = ({
  isOpen,
  onClose,
  activityName,
  savedRecordId,
  initialIntensity,
}) => {
  const { user } = useAuth();
  const [postIntensity, setPostIntensity] = useState<number>(initialIntensity !== undefined ? Math.max(0, initialIntensity - 1) : 3);
  const [saving, setSaving] = useState(false);
  const [hasCompared, setHasCompared] = useState(false);

  const handleSavePostIntensity = async () => {
    if (savedRecordId && user) {
      setSaving(true);
      try {
        await recordsService.updateRecord(user.id, savedRecordId, {
          intensity: initialIntensity ?? 4,
          primary_emotion: 'alivio',
          post_intensity: postIntensity,
        });
      } catch (err) {
        console.warn('Erro ao atualizar intensidade posterior:', err);
      } finally {
        setSaving(false);
      }
    }
    setHasCompared(true);
  };

  const getDescriptiveComparison = () => {
    if (initialIntensity === undefined) return null;
    if (postIntensity < initialIntensity) {
      return `Você registrou uma diminuição na intensidade percebida (de ${initialIntensity} para ${postIntensity}). Lembre-se de que cada momento tem seu próprio ritmo e variações são naturais.`;
    }
    if (postIntensity === initialIntensity) {
      return `A intensidade relatada permaneceu no mesmo nível (${postIntensity}). Fazer uma pausa e acolher o momento já é um passo valioso de cuidado com você mesmo(a).`;
    }
    return `Você percebeu uma intensidade maior após a atividade (de ${initialIntensity} para ${postIntensity}). Às vezes, desacelerar traz à tona sensações que estavam abafadas pela correria. Isso não significa que o exercício falhou.`;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Atividade concluída"
      description={`Você finalizou: ${activityName}`}
      maxWidth="md"
    >
      <div className="space-y-5 text-sm">
        {!hasCompared ? (
          <>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Como você está se percebendo após esta prática? Se desejar, registre a intensidade atual.
              Este passo é opcional e serve apenas para acompanhar suas percepções.
            </p>

            <IntensitySlider
              value={postIntensity}
              onChange={setPostIntensity}
              label="Intensidade percebida agora (0 a 10)"
            />

            <div className="pt-3 flex items-center justify-between border-t border-charcoal-800">
              <Button variant="ghost" size="sm" onClick={onClose}>
                Pular registro
              </Button>
              <Button size="sm" onClick={handleSavePostIntensity} isLoading={saving}>
                Salvar percepção
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="p-4 rounded-xl bg-charcoal-850 border border-charcoal-750 space-y-2">
              <div className="flex items-center gap-2 text-sage-400 font-semibold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Observação descritiva</span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                {getDescriptiveComparison() || 'Sua percepção foi registrada com sucesso.'}
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <Button size="sm" onClick={onClose}>
                Fechar e voltar
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};
