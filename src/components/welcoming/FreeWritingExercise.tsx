import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { Textarea } from '../ui/Textarea';
import { X, Save, Trash2 } from 'lucide-react';
import { recordsService } from '../../services/recordsService';
import { useAuth } from '../../contexts/AuthContext';

export interface FreeWritingExerciseProps {
  onFinish: (name: string, savedRecordId?: string) => void;
  onExit: () => void;
}

export const FreeWritingExercise: React.FC<FreeWritingExerciseProps> = ({
  onFinish,
  onExit,
}) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

  const wordsCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  const handleAttemptExit = () => {
    if (content.trim().length > 10) {
      setShowExitConfirm(true);
    } else {
      onExit();
    }
  };

  const handleSaveToDiary = async () => {
    if (!user || !content.trim()) return;
    setSaving(true);
    try {
      const rec = await recordsService.createRecord(user.id, {
        primary_emotion: 'alivio',
        intensity: 3,
        activity_used: 'Escrita Livre e Desabafo',
        notes: content.trim(),
        context: 'Espaço livre de escrita',
      });
      onFinish('Escrita Livre e Desabafo', rec.id);
    } catch (err) {
      console.warn('Erro ao salvar texto no diário:', err);
      onFinish('Escrita Livre e Desabafo');
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    setContent('');
    setShowDiscardConfirm(false);
    onExit();
  };

  return (
    <div className="space-y-6 text-neutral-100">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-charcoal-800">
        <div>
          <h3 className="text-base font-semibold text-neutral-100">
            Escrita Livre e Desabafo
          </h3>
          <p className="text-xs text-neutral-400">
            Espaço confidencial para colocar tudo o que vier à mente, sem julgamento ou correções.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAttemptExit}
          className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-charcoal-800"
          aria-label="Encerrar escrita"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Editor Area */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-neutral-400 px-1">
          <span>Escreva no seu próprio fluxo...</span>
          <span>{wordsCount} palavras</span>
        </div>

        <Textarea
          placeholder="O que está acontecendo dentro de você agora? Deixe as frases saírem livremente..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[220px] font-sans text-sm leading-relaxed"
          maxLength={5000}
        />
      </div>

      <div className="flex items-center justify-between pt-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            if (content.trim()) setShowDiscardConfirm(true);
            else onExit();
          }}
          className="text-neutral-400 hover:text-rose-400"
        >
          <Trash2 className="w-4 h-4 mr-1.5" />
          Descartar texto
        </Button>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onFinish('Escrita Livre (sem salvar)')}
          >
            Concluir sem salvar
          </Button>

          <Button
            size="md"
            onClick={handleSaveToDiary}
            isLoading={saving}
            disabled={!content.trim()}
            className="font-semibold"
          >
            <Save className="w-4 h-4 mr-1.5" />
            Salvar no Diário
          </Button>
        </div>
      </div>

      {/* Confirm Exit Modal */}
      <ConfirmDialog
        isOpen={showExitConfirm}
        onClose={() => setShowExitConfirm(false)}
        onConfirm={() => {
          setShowExitConfirm(false);
          onExit();
        }}
        title="Deseja sair sem salvar seu texto?"
        message="Você digitou reflexões que ainda não foram salvas no diário. Ao sair agora, o conteúdo será descartado."
        confirmLabel="Sim, descartar e sair"
        cancelLabel="Continuar escrevendo"
        isDestructive
      />

      {/* Confirm Discard Modal */}
      <ConfirmDialog
        isOpen={showDiscardConfirm}
        onClose={() => setShowDiscardConfirm(false)}
        onConfirm={handleDiscard}
        title="Descartar este texto?"
        message="Tem certeza de que deseja apagar o que escreveu? Esta ação não poderá ser desfeita."
        confirmLabel="Apagar texto"
        cancelLabel="Voltar"
        isDestructive
      />
    </div>
  );
};
