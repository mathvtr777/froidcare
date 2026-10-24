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
    if (user) {
      setSaving(true);
      try {
        if (savedRecordId) {
          await recordsService.updateRecord(user.id, savedRecordId, {
            intensity: initialIntensity ?? 4,
            primary_emotion: 'alivio',
            post_intensity: postIntensity,
          });
        } else {
          await recordsService.createRecord(user.id, {
            primary_emotion: 'alivio',
            intensity: initialIntensity ?? 4,
            post_intensity: postIntensity,
            activity_used: activityName,
            context: 'Prática de acolhimento concluída',
          });
        }
      } catch (err) {
        console.warn('Erro ao registrar percepção pós-atividade:', err);
      } finally {
        setSaving(false);
      }
    }
    setHasCompared(true);
  };

  const handleSkip = async () => {
    if (!savedRecordId && user) {
      try {
        await recordsService.createRecord(user.id, {
          primary_emotion: 'calma',
          intensity: initialIntensity ?? 3,
          activity_used: activityName,
          context: 'Prática de acolhimento concluída',
        });
      } catch (err) {
        console.warn('Erro ao salvar prática:', err);
      }
    }
    onClose();
  };

  const getDescriptiveComparison = () => {
    if (initialIntensity === undefined) {
      return `Você registrou uma percepção atual de nível ${postIntensity}/10. Fazer uma pausa e acolher este momento já é um passo valioso de autocuidado e autorregulação.`;
    }
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
      <div className="space-y-5 text-sm text-on-surface">
        {!hasCompared ? (
          <>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Como você está se percebendo após esta prática? Se desejar, registre a intensidade atual.
              Este passo é opcional e serve apenas para acompanhar suas percepções.
            </p>

            <IntensitySlider
              value={postIntensity}
              onChange={setPostIntensity}
              label="Intensidade percebida agora (0 a 10)"
            />

            <div className="pt-3 flex items-center justify-between border-t border-outline-variant/40">
              <Button variant="ghost" size="sm" onClick={handleSkip}>
                Pular registro
              </Button>
              <Button size="sm" onClick={handleSavePostIntensity} isLoading={saving} className="px-5">
                Salvar percepção
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="p-4 rounded-2xl bg-surface-container border border-outline-variant/50 space-y-2">
              <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Observação descritiva</span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                {getDescriptiveComparison() || 'Sua percepção foi registrada com sucesso.'}
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <Button size="sm" onClick={onClose} className="px-5">
                Fechar e voltar
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};
