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
    <div className="space-y-6 text-on-surface">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-outline-variant/40">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-primary text-xl">stylus_note</span>
            <h3 className="text-base font-semibold text-on-surface">
              Escrita Livre e Desabafo
            </h3>
          </div>
          <p className="text-xs text-on-surface-variant">
            Espaço confidencial para colocar tudo o que vier à mente, sem julgamento ou correções.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAttemptExit}
          className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
          aria-label="Encerrar escrita"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Editor Area */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-on-surface-variant px-1">
          <span>Escreva no seu próprio fluxo...</span>
          <span className="font-mono text-primary">{wordsCount} palavras</span>
        </div>

        <Textarea
          placeholder="O que está acontecendo dentro de você agora? Deixe as frases saírem livremente..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[220px] font-sans text-sm leading-relaxed"
          maxLength={5000}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            if (content.trim()) setShowDiscardConfirm(true);
            else onExit();
          }}
          className="text-on-surface-variant hover:text-error"
        >
          <Trash2 className="w-4 h-4 mr-1.5" />
          Descartar texto
        </Button>

        <div className="flex items-center gap-2.5">
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
            className="font-semibold px-6"
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
