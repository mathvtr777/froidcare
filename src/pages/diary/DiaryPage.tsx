import React, { useState, useEffect, useCallback } from 'react';
import { EmotionalRecord } from '../../types';
import { recordsService, RecordsFilter } from '../../services/recordsService';
import { useAuth } from '../../contexts/AuthContext';
import { DiaryRecordModal } from '../../components/diary/DiaryRecordModal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Button } from '../../components/ui/Button';
import { EMOTIONS } from '../../constants';
import { formatDayWeekdayPt, formatTimePt } from '../../lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const DiaryPage: React.FC = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState<EmotionalRecord[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedEmotion, setSelectedEmotion] = useState<string>('all');
  const [periodPreset, setPeriodPreset] = useState<'all' | '7d' | '30d'>('all');
  const [showEmotionFilter, setShowEmotionFilter] = useState<boolean>(true);
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
      }

      const res = await recordsService.fetchRecords(user.id, filter);
      setRecords(res.records);
      setTotalCount(res.total);
    } catch (err) {
      console.warn('Erro ao carregar diário:', err);
    } finally {
      setLoading(false);
    }
  }, [user, selectedEmotion, searchQuery, periodPreset, page]);

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
    <div className="flex flex-col w-full gap-space-lg pb-8">
      {/* 1. Header Contextual */}
      <header className="flex flex-col gap-1 pt-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-primary text-[22px]">auto_stories</span>
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-semibold">
              Reflexão Guiada
            </span>
          </div>
          <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Sincronizado
          </span>
        </div>
        <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
          Diário Emocional
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
          Seu histórico de registros, contextos e percepções ao longo do tempo.
        </p>
      </header>

      {/* 2. CTA Principal com Gradiente Terapêutico */}
      <section>
        <button
          onClick={handleOpenCreate}
          className="w-full min-h-[56px] py-space-sm px-space-md rounded-2xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-label-lg text-label-lg flex items-center justify-center gap-space-xs shadow-[0_12px_28px_-6px_rgba(90,240,179,0.28)] hover:opacity-95 active:scale-[0.98] transition-all font-semibold"
          type="button"
        >
          <span className="material-symbols-outlined text-[24px]">add_circle</span>
          <span>Novo Registro Emocional</span>
        </button>
      </section>

      {/* 3. Busca e Filtros */}
      <section className="flex flex-col gap-space-sm">
        {/* Search Input */}
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-space-sm flex items-center pointer-events-none text-outline">
            <span className="material-symbols-outlined text-[22px]">search</span>
          </div>
          <input
            type="text"
            placeholder="Buscar em anotações ou situações..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(0);
            }}
            className="w-full min-h-[48px] pl-11 pr-space-md rounded-2xl bg-surface-container text-on-surface placeholder:text-outline text-body-md font-body-md focus:outline-none focus:bg-surface-container-high border border-outline-variant/40 transition-colors"
          />
        </div>

        {/* Filtros de Período & Toggle Emoções */}
        <div className="flex items-center justify-between gap-space-xs">
          <div className="flex items-center gap-space-xs overflow-x-auto py-1 no-scrollbar">
            <button
              type="button"
              onClick={() => {
                setPeriodPreset('7d');
                setPage(0);
              }}
              className={`px-space-sm py-1.5 rounded-full font-label-sm text-label-sm flex items-center gap-1 active:scale-95 transition-all font-semibold ${
                periodPreset === '7d'
                  ? 'bg-surface-container-highest text-primary border border-primary/30'
                  : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">calendar_today</span>
              <span>Últimos 7 dias</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setPeriodPreset('30d');
                setPage(0);
              }}
              className={`px-space-sm py-1.5 rounded-full font-label-sm text-label-sm active:scale-95 transition-all font-semibold ${
                periodPreset === '30d'
                  ? 'bg-surface-container-highest text-primary border border-primary/30'
                  : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span>Últimos 30 dias</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setPeriodPreset('all');
                setPage(0);
              }}
              className={`px-space-sm py-1.5 rounded-full font-label-sm text-label-sm active:scale-95 transition-all font-semibold ${
                periodPreset === 'all'
                  ? 'bg-surface-container-highest text-primary border border-primary/30'
                  : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span>Todo o histórico</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowEmotionFilter(!showEmotionFilter)}
            className="min-h-[36px] px-3 py-1 rounded-full bg-surface-container text-outline hover:text-on-surface font-label-sm text-label-sm flex items-center gap-1 transition-colors border border-outline-variant/40 shrink-0 font-medium"
          >
            <span className="material-symbols-outlined text-[18px]">tune</span>
            <span>Emoções</span>
          </button>
        </div>

        {/* Emotion Filter Chips */}
        {showEmotionFilter && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            <button
              type="button"
              onClick={() => {
                setSelectedEmotion('all');
                setPage(0);
              }}
              className={`px-space-sm py-1 rounded-full font-label-sm text-label-sm flex items-center gap-1 transition-colors ${
                selectedEmotion === 'all'
                  ? 'bg-primary text-on-primary font-semibold'
                  : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span>Todas</span>
            </button>

            {EMOTIONS.slice(0, 6).map((emo) => {
              const active = selectedEmotion === emo.id;
              return (
                <button
                  key={emo.id}
                  type="button"
                  onClick={() => {
                    setSelectedEmotion(emo.id);
                    setPage(0);
                  }}
                  className={`px-space-sm py-1 rounded-full font-label-sm text-label-sm flex items-center gap-1.5 transition-colors border border-outline-variant/30 ${
                    active
                      ? 'bg-surface-container-highest text-primary font-semibold border-primary/40'
                      : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: emo.accentColor }}
                  />
                  <span>{emo.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. Feed de Registros Emocionais */}
      <section className="flex flex-col gap-space-md">
        <div className="flex items-center justify-between">
          <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
            Registros
          </span>
          <span className="font-label-sm text-label-sm text-outline">
            {totalCount} {totalCount === 1 ? 'registro' : 'registros'}
          </span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm text-on-surface-variant">
            Carregando registros do diário...
          </div>
        ) : records.length === 0 ? (
          <div className="p-8 rounded-2xl bg-surface-container border border-outline-variant/40 text-center space-y-3">
            <p className="text-sm text-on-surface font-medium">
              Nenhum registro encontrado para os filtros selecionados.
            </p>
            <p className="text-xs text-on-surface-variant">
              Gostaria de registrar como você está se sentindo agora?
            </p>
            <Button size="sm" onClick={handleOpenCreate}>
              Criar primeiro registro
            </Button>
          </div>
        ) : (
          records.map((rec) => {
            const emoDef = EMOTIONS.find((e) => e.id === rec.primary_emotion);
            const emoLabel = emoDef ? emoDef.label : rec.primary_emotion;

            return (
              <article
                key={rec.id}
                className="p-space-md rounded-2xl bg-surface-container border border-outline-variant/40 flex flex-col gap-space-sm shadow-md transition-all hover:bg-surface-container-high"
              >
                <div className="flex items-start justify-between gap-space-sm">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-3 py-1 rounded-full bg-primary-container/20 text-primary font-label-sm text-label-sm font-semibold flex items-center gap-1.5 border border-primary/20">
                      <span className="material-symbols-outlined text-[16px]">spa</span>
                      <span>{emoLabel} (Nível {rec.intensity}/10)</span>
                    </span>

                    {rec.context && (
                      <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">apartment</span>
                        <span>{rec.context}</span>
                      </span>
                    )}
                  </div>

                  <span className="font-body-sm text-body-sm text-outline shrink-0 font-mono">
                    {formatDayWeekdayPt(rec.record_timestamp)}, {formatTimePt(rec.record_timestamp)}
                  </span>
                </div>

                {rec.notes && (
                  <p className="font-body-md text-body-md text-on-surface leading-relaxed whitespace-pre-line">
                    “{rec.notes}”
                  </p>
                )}

                {/* Prática Realizada de Descompressão */}
                {rec.activity_used && (
                  <div className="p-space-xs px-space-sm rounded-xl bg-surface-container-low flex items-center justify-between border border-outline-variant/30">
                    <div className="flex items-center gap-space-xs min-w-0">
                      <span className="material-symbols-outlined text-primary text-[20px] shrink-0">air</span>
                      <span className="font-body-sm text-body-sm text-on-surface truncate">
                        Prática realizada: <span className="text-primary font-semibold">{rec.activity_used}</span>
                      </span>
                    </div>
                    {rec.post_intensity !== null && rec.post_intensity !== undefined && (
                      <span className="font-label-sm text-label-sm text-primary-fixed-dim shrink-0">
                        Após: {rec.post_intensity}/10
                      </span>
                    )}
                  </div>
                )}

                {/* Footer with actions */}
                <div className="pt-1 flex items-center justify-between text-outline border-t border-surface-container-high/60">
                  <div className="flex items-center gap-space-sm">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(rec)}
                      aria-label="Editar"
                      className="flex items-center gap-1 hover:text-on-surface transition-colors font-body-sm text-body-sm"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                      <span>Editar</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRecordToDelete(rec)}
                      aria-label="Excluir"
                      className="flex items-center gap-1 hover:text-error transition-colors font-body-sm text-body-sm"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                      <span>Excluir</span>
                    </button>
                  </div>

                  <span className="font-body-sm text-body-sm text-outline flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">lock</span>
                    Privado
                  </span>
                </div>
              </article>
            );
          })
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4">
            <span className="text-xs text-on-surface-variant font-mono">
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
      </section>

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
