import React, { useState, useEffect, useCallback } from 'react';
import { EmotionalRecord } from '../../types';
import { recordsService, RecordsFilter } from '../../services/recordsService';
import { useAuth } from '../../contexts/AuthContext';
import { DiaryRecordModal } from '../../components/diary/DiaryRecordModal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Button } from '../../components/ui/Button';
import { EMOTIONS, INTENSITY_LEVELS } from '../../constants';
import { formatDayWeekdayPt, formatTimePt } from '../../lib/utils';
import {
  Plus,
  Search,
  Trash2,
  Edit2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Moon,
  Tag,
} from 'lucide-react';

export const DiaryPage: React.FC = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState<EmotionalRecord[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedEmotion, setSelectedEmotion] = useState<string>('all');
  const [periodPreset, setPeriodPreset] = useState<'all' | '7d' | '30d' | 'custom'>('all');
  const [customStart, setCustomStart] = useState<string>('');
  const [customEnd, setCustomEnd] = useState<string>('');
  const [page, setPage] = useState<number>(0);
  const pageSize = 15;

  // Modals state
  const [recordModalOpen, setRecordModalOpen] = useState(false);
  const [recordToEdit, setRecordToEdit] = useState<EmotionalRecord | null>(null);
  const [recordToDelete, setRecordToDelete] = useState<EmotionalRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadRecords = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    try {
      const filter: RecordsFilter = {
        emotion: selectedEmotion !== 'all' ? selectedEmotion : undefined,
        search: searchQuery.trim() || undefined,
        limit: pageSize,
        offset: page * pageSize,
      };

      const now = new Date();
      if (periodPreset === '7d') {
        const d = new Date();
        d.setDate(now.getDate() - 6);
        filter.startDate = d.toISOString().split('T')[0];
        filter.endDate = now.toISOString().split('T')[0];
      } else if (periodPreset === '30d') {
        const d = new Date();
        d.setDate(now.getDate() - 29);
        filter.startDate = d.toISOString().split('T')[0];
        filter.endDate = now.toISOString().split('T')[0];
      } else if (periodPreset === 'custom' && customStart && customEnd) {
        filter.startDate = customStart;
        filter.endDate = customEnd;
      }

      const res = await recordsService.fetchRecords(user.id, filter);
      setRecords(res.records);
      setTotalCount(res.total);
    } catch (err) {
      console.warn('Erro ao carregar diário:', err);
    } finally {
      setLoading(false);
    }
  }, [user, selectedEmotion, searchQuery, periodPreset, customStart, customEnd, page]);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  const handleOpenCreate = () => {
    setRecordToEdit(null);
    setRecordModalOpen(true);
  };

  const handleOpenEdit = (rec: EmotionalRecord) => {
    setRecordToEdit(rec);
    setRecordModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!recordToDelete || !user) return;
    setIsDeleting(true);
    try {
      await recordsService.deleteRecord(user.id, recordToDelete.id);
      setRecordToDelete(null);
      loadRecords();
    } catch (err) {
      console.error('Erro ao excluir:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-100">
            Diário Emocional
          </h1>
          <p className="text-sm text-neutral-400">
            Seu histórico de registros, contextos e percepções ao longo do tempo.
          </p>
        </div>

        <Button onClick={handleOpenCreate} className="self-start sm:self-auto shadow-md">
          <Plus className="w-4 h-4 mr-1.5" />
          Novo Registro
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-2xl bg-charcoal-900 border border-charcoal-800 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar em anotações ou situações..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(0);
              }}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-charcoal-950 border border-charcoal-800 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-sage-500"
            />
          </div>

          {/* Emotion filter */}
          <div>
            <select
              value={selectedEmotion}
              onChange={(e) => {
                setSelectedEmotion(e.target.value);
                setPage(0);
              }}
              className="w-full px-3 py-2 rounded-xl bg-charcoal-950 border border-charcoal-800 text-xs text-neutral-200 focus:outline-none focus:border-sage-500"
            >
              <option value="all">Todas as emoções</option>
              {EMOTIONS.map((emo) => (
                <option key={emo.id} value={emo.id}>
                  {emo.label}
                </option>
              ))}
            </select>
          </div>

          {/* Period filter preset */}
          <div>
            <select
              value={periodPreset}
              onChange={(e) => {
                setPeriodPreset(e.target.value as any);
                setPage(0);
              }}
              className="w-full px-3 py-2 rounded-xl bg-charcoal-950 border border-charcoal-800 text-xs text-neutral-200 focus:outline-none focus:border-sage-500"
            >
              <option value="all">Todo o período</option>
              <option value="7d">Últimos 7 dias</option>
              <option value="30d">Últimos 30 dias</option>
              <option value="custom">Intervalo personalizado...</option>
            </select>
          </div>
        </div>

        {/* Custom Date Inputs if custom is selected */}
        {periodPreset === 'custom' && (
          <div className="flex items-center gap-2 pt-2 border-t border-charcoal-800">
            <span className="text-xs text-neutral-400">De:</span>
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-charcoal-950 border border-charcoal-800 text-xs text-neutral-200"
            />
            <span className="text-xs text-neutral-400">Até:</span>
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-charcoal-950 border border-charcoal-800 text-xs text-neutral-200"
            />
          </div>
        )}
      </div>

      {/* Records List */}
      {loading ? (
        <div className="py-12 text-center text-sm text-neutral-400">
          Carregando registros do diário...
        </div>
      ) : records.length === 0 ? (
        <div className="p-8 rounded-2xl bg-charcoal-900 border border-charcoal-800 text-center space-y-3">
          <p className="text-sm text-neutral-300">
            Nenhum registro encontrado para os filtros selecionados.
          </p>
          <p className="text-xs text-neutral-500">
            Que tal registrar como você está se sentindo agora?
          </p>
          <Button size="sm" onClick={handleOpenCreate}>
            Criar primeiro registro
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {records.map((rec) => {
            const emoDef = EMOTIONS.find((e) => e.id === rec.primary_emotion);
            const emoLabel = emoDef ? emoDef.label : rec.primary_emotion;
            const intensityInfo = INTENSITY_LEVELS[rec.intensity] || { label: `${rec.intensity}/10` };

            return (
              <div
                key={rec.id}
                className="p-4 md:p-5 rounded-2xl bg-charcoal-900 border border-charcoal-800 hover:border-charcoal-700 transition-all space-y-3"
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-xs font-semibold text-neutral-300">
                      {formatDayWeekdayPt(rec.record_timestamp)}
                    </span>
                    <span className="text-xs text-neutral-500">
                      {formatTimePt(rec.record_timestamp)}
                    </span>

                    <span className="inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-semibold bg-sage-950/80 text-sage-300 border border-sage-800/60">
                      {emoLabel}
                    </span>

                    <span className="text-xs font-medium text-neutral-300 bg-charcoal-850 px-2 py-0.5 rounded-lg border border-charcoal-800">
                      Intensidade: {rec.intensity}/10 ({intensityInfo.label})
                    </span>

                    {rec.post_intensity !== null && rec.post_intensity !== undefined && (
                      <span className="text-xs text-neutral-400 bg-charcoal-850 px-2 py-0.5 rounded-lg">
                        Após atividade: {rec.post_intensity}/10
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(rec)}
                      aria-label="Editar registro"
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-charcoal-800 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setRecordToDelete(rec)}
                      aria-label="Excluir registro"
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-charcoal-800 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Secondary emotions */}
                {rec.secondary_emotions && rec.secondary_emotions.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap text-xs text-neutral-400">
                    <span className="text-[11px] text-neutral-500">Também presente:</span>
                    {rec.secondary_emotions.map((secId) => {
                      const def = EMOTIONS.find((e) => e.id === secId);
                      return (
                        <span
                          key={secId}
                          className="px-2 py-0.5 rounded-md bg-charcoal-850 text-neutral-300 text-[11px]"
                        >
                          {def ? def.label : secId}
                        </span>
                      );
                    })}
                  </div>
                )}

                {/* Context and Triggers */}
                {(rec.context || (rec.triggers && rec.triggers.length > 0)) && (
                  <div className="text-xs text-neutral-300 space-y-1">
                    {rec.context && (
                      <p>
                        <strong className="text-neutral-400 font-medium">Situação:</strong>{' '}
                        {rec.context}
                      </p>
                    )}
                    {rec.triggers && rec.triggers.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <strong className="text-neutral-400 font-medium">Gatilhos:</strong>
                        {rec.triggers.map((t, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-charcoal-850 text-[11px] text-neutral-300"
                          >
                            <Tag className="w-2.5 h-2.5 text-sage-400" />
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Notes */}
                {rec.notes && (
                  <div className="p-3 rounded-xl bg-charcoal-950/70 border border-charcoal-850 text-xs text-neutral-300 leading-relaxed whitespace-pre-line">
                    {rec.notes}
                  </div>
                )}

                {/* Activity and Sleep footer badges */}
                <div className="flex items-center gap-3 text-[11px] text-neutral-500 pt-1">
                  {rec.activity_used && (
                    <span className="flex items-center gap-1 text-sage-400/90">
                      <Sparkles className="w-3 h-3" />
                      {rec.activity_used}
                    </span>
                  )}
                  {rec.sleep_quality && (
                    <span className="flex items-center gap-1 text-neutral-400">
                      <Moon className="w-3 h-3" />
                      Sono nível {rec.sleep_quality}/5
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <span className="text-xs text-neutral-400">
                Página {page + 1} de {totalPages} ({totalCount} registros)
              </span>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={page === 0}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Anterior
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Próxima
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Record Creation / Edit Modal */}
      <DiaryRecordModal
        isOpen={recordModalOpen}
        onClose={() => setRecordModalOpen(false)}
        recordToEdit={recordToEdit}
        onRecordSaved={loadRecords}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={recordToDelete !== null}
        onClose={() => setRecordToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Excluir este registro?"
        message="O registro selecionado será removido permanentemente do seu histórico. Esta operação não pode ser revertida."
        confirmLabel="Sim, excluir registro"
        cancelLabel="Cancelar e manter"
        isDestructive
        isLoading={isDeleting}
      />
    </div>
  );
};
