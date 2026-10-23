import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { recordsService } from '../../services/recordsService';
import { pdfService } from '../../services/pdfService';
import { EmotionalRecord, ReportConfig } from '../../types';
import { getDateRangePresets, formatDatePt } from '../../lib/utils';
import { EMOTIONS } from '../../constants';
import { AlertCircle, ShieldCheck } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { user } = useAuth();
  const presets = getDateRangePresets();

  const [periodType, setPeriodType] = useState<'7d' | '30d' | 'month' | 'custom'>('30d');
  const [startDate, setStartDate] = useState(presets.last30Days.start);
  const [endDate, setEndDate] = useState(presets.last30Days.end);

  const [includeNotes, setIncludeNotes] = useState(true);
  const [includeSummary, setIncludeSummary] = useState(true);
  const [includeActivities, setIncludeActivities] = useState(true);
  const [displayName, setDisplayName] = useState(user?.display_name || '');

  const [matchingRecords, setMatchingRecords] = useState<EmotionalRecord[]>([]);
  const [loadingPreview, setLoadingPreview] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (periodType === '7d') {
      setStartDate(presets.last7Days.start);
      setEndDate(presets.last7Days.end);
    } else if (periodType === '30d') {
      setStartDate(presets.last30Days.start);
      setEndDate(presets.last30Days.end);
    } else if (periodType === 'month') {
      setStartDate(presets.thisMonth.start);
      setEndDate(presets.thisMonth.end);
    }
  }, [periodType]);

  const fetchMatching = useCallback(async () => {
    if (!user || !startDate || !endDate) return;
    setLoadingPreview(true);
    try {
      const res = await recordsService.fetchRecords(user.id, {
        startDate,
        endDate,
      });
      setMatchingRecords(res.records);
    } catch (err) {
      console.warn('Erro ao buscar registros para relatório:', err);
    } finally {
      setLoadingPreview(false);
    }
  }, [user, startDate, endDate]);

  useEffect(() => {
    fetchMatching();
  }, [fetchMatching]);

  const handleDownloadPdf = () => {
    setIsExporting(true);
    try {
      const config: ReportConfig = {
        periodType,
        startDate,
        endDate,
        includeNotes,
        includeSummary,
        includeCharts: true,
        includeActivities,
        displayName: displayName.trim() || undefined,
      };
      pdfService.downloadReport(matchingRecords, config);
    } catch (err) {
      console.error('Erro ao gerar PDF:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const total = matchingRecords.length;
  const avg =
    total > 0
      ? (matchingRecords.reduce((acc, r) => acc + r.intensity, 0) / total).toFixed(1)
      : '0.0';

  return (
    <div className="flex flex-col w-full pb-8 space-y-5">
      {/* 1. Header Contextual */}
      <div className="flex flex-col gap-1.5 pt-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              description
            </span>
          </div>
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-semibold">
            Compartilhamento Seguro
          </span>
        </div>
        <h2 className="font-headline-md text-headline-md text-on-surface font-bold">
          Relatórios em PDF
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
          Gere um documento organizado para compartilhar com seu terapeuta ou guardar para acompanhamento pessoal contínuo.
        </p>
      </div>

      {/* 2. Card Principal de Configuração do Relatório */}
      <div className="bg-surface-container rounded-2xl p-space-md flex flex-col gap-5 shadow-sm border border-outline-variant/40">
        {/* Período de Exportação */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <label className="font-label-lg text-label-lg text-on-surface flex items-center gap-1.5 font-semibold">
              <span className="material-symbols-outlined text-[18px] text-primary">calendar_month</span>
              Período de exportação
            </label>
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              {periodType === '7d' && '7 dias selecionados'}
              {periodType === '30d' && '30 dias selecionados'}
              {periodType === 'month' && 'Mês atual selecionado'}
              {periodType === 'custom' && 'Intervalo personalizado'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: '7d', label: 'Últimos 7 dias' },
              { id: '30d', label: 'Últimos 30 dias' },
              { id: 'month', label: 'Mês atual' },
              { id: 'custom', label: 'Personalizado' },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPeriodType(p.id as any)}
                className={`py-2 px-3 rounded-full text-center font-label-md text-label-md transition-all active:scale-95 flex items-center justify-center gap-1.5 font-semibold ${
                  periodType === p.id
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {periodType === p.id && (
                  <span className="material-symbols-outlined text-[16px]">check</span>
                )}
                <span>{p.label}</span>
              </button>
            ))}
          </div>

          {/* Custom Date Pickers */}
          {periodType === 'custom' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <span className="block text-xs font-semibold text-on-surface mb-1">Data de início:</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface-container-low text-on-surface border border-outline-variant/60 text-xs"
                />
              </div>
              <div>
                <span className="block text-xs font-semibold text-on-surface mb-1">Data de término:</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface-container-low text-on-surface border border-outline-variant/60 text-xs"
                />
              </div>
            </div>
          )}
        </div>

        {/* Nome de Exibição no Cabeçalho */}
        <div className="flex flex-col gap-1.5 pt-2 border-t border-surface-container-high/60">
          <label className="font-label-lg text-label-lg text-on-surface flex items-center gap-1.5 font-semibold">
            <span className="material-symbols-outlined text-[18px] text-primary">badge</span>
            Nome de exibição no cabeçalho
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Ex: Seu nome ou pseudônimo"
              className="w-full bg-surface-container-low text-on-surface font-body-md text-body-md rounded-xl px-3.5 py-2.5 focus:outline-none focus:bg-surface-container-highest transition-colors border border-outline-variant/40 placeholder:text-outline"
            />
            {displayName && (
              <button
                type="button"
                onClick={() => setDisplayName('')}
                title="Limpar para anônimo"
                className="absolute right-3 text-on-surface-variant hover:text-on-surface p-1 rounded-full text-[16px]"
              >
                <span className="material-symbols-outlined text-[18px]">backspace</span>
              </button>
            )}
          </div>
          <div className="flex items-center gap-1 text-on-surface-variant px-0.5">
            <span className="material-symbols-outlined text-[14px] text-tertiary">info</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Deixe em branco se preferir um relatório confidencial/anônimo.
            </span>
          </div>
        </div>

        {/* Seções Incluídas no Documento */}
        <div className="flex flex-col gap-2.5 pt-2 border-t border-surface-container-high/60">
          <span className="font-label-lg text-label-lg text-on-surface flex items-center gap-1.5 font-semibold">
            <span className="material-symbols-outlined text-[18px] text-primary">fact_check</span>
            Seções incluídas no documento
          </span>

          <div className="flex flex-col gap-2">
            {/* Toggle 1: Resumo */}
            <label className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low cursor-pointer hover:bg-surface-container-high transition-colors border border-outline-variant/30">
              <div className="flex items-center gap-3 pr-2 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[18px]">query_stats</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-label-md text-label-md text-on-surface truncate font-semibold">
                    Resumo e médias de intensidade
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                    Níveis emocionais, picos e oscilações
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={includeSummary}
                onChange={(e) => setIncludeSummary(e.target.checked)}
                className="w-5 h-5 rounded accent-primary cursor-pointer"
              />
            </label>

            {/* Toggle 2: Anotações */}
            <label className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low cursor-pointer hover:bg-surface-container-high transition-colors border border-outline-variant/30">
              <div className="flex items-center gap-3 pr-2 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[18px]">draw</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-label-md text-label-md text-on-surface truncate font-semibold">
                    Anotações e contextos relatados
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                    Gatilhos diários e reflexões de sessão
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={includeNotes}
                onChange={(e) => setIncludeNotes(e.target.checked)}
                className="w-5 h-5 rounded accent-primary cursor-pointer"
              />
            </label>

            {/* Toggle 3: Práticas */}
            <label className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low cursor-pointer hover:bg-surface-container-high transition-colors border border-outline-variant/30">
              <div className="flex items-center gap-3 pr-2 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-tertiary/10 text-tertiary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[18px]">self_improvement</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-label-md text-label-md text-on-surface truncate font-semibold">
                    Exercícios e práticas de acolhimento
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                    Sessões de respiração e aterramento somático
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={includeActivities}
                onChange={(e) => setIncludeActivities(e.target.checked)}
                className="w-5 h-5 rounded accent-primary cursor-pointer"
              />
            </label>
          </div>
        </div>
      </div>

      {/* 3. Ação Primária de Download */}
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={handleDownloadPdf}
          disabled={loadingPreview || total === 0 || isExporting}
          className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-[0_12px_28px_-8px_rgba(52,211,153,0.35)] active:scale-[0.98] transition-all font-semibold disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            picture_as_pdf
          </span>
          <span>{isExporting ? 'Compilando documento...' : 'Baixar Relatório em PDF'}</span>
        </button>

        <div className="flex items-center justify-center gap-1.5 text-on-surface-variant text-xs">
          <span className="material-symbols-outlined text-[14px] text-primary">lock</span>
          <span>Compilado estritamente no seu dispositivo. Não é enviado a servidores externos.</span>
        </div>
      </div>

      {/* 4. Pré-visualização do Documento */}
      <div className="bg-surface-container rounded-2xl p-space-md flex flex-col gap-4 shadow-sm border border-outline-variant/40">
        <div className="flex items-center justify-between pb-2 border-b border-surface-container-high/60">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-primary">visibility</span>
            <span className="font-label-lg text-label-lg text-on-surface font-semibold">
              Pré-visualização do Documento
            </span>
          </div>
          <span className="font-label-sm text-label-sm px-2.5 py-0.5 rounded-full bg-surface-container-high text-primary font-semibold border border-primary/20">
            {total} {total === 1 ? 'registro' : 'registros'}
          </span>
        </div>

        {loadingPreview ? (
          <div className="py-8 text-center text-xs text-on-surface-variant">
            Carregando registros do período...
          </div>
        ) : total === 0 ? (
          <div className="py-8 text-center space-y-2">
            <AlertCircle className="w-8 h-8 text-on-surface-variant mx-auto" />
            <p className="text-sm text-on-surface font-medium">
              Nenhum registro encontrado entre {formatDatePt(startDate)} e {formatDatePt(endDate)}.
            </p>
            <p className="text-xs text-on-surface-variant">
              Selecione um intervalo de tempo maior para exportar dados.
            </p>
          </div>
        ) : (
          <div className="relative bg-surface-container-lowest rounded-2xl p-4 flex flex-col gap-3 overflow-hidden shadow-inner border border-outline-variant/40">
            {/* Top decorative gradient bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary-container to-secondary" />

            <div className="flex items-start justify-between pb-2 border-b border-surface-container-high/60 pt-1">
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 text-primary">
                  <span className="material-symbols-outlined text-[16px]">health_and_safety</span>
                  <span className="font-label-sm text-label-sm font-bold uppercase tracking-wider">
                    Froid Care • Relatório Clínico
                  </span>
                </div>
                <span className="font-headline-sm text-headline-sm text-on-surface mt-1 font-semibold">
                  Paciente: {displayName || 'Confidencial / Anônimo'}
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Período: {formatDatePt(startDate)} a {formatDatePt(endDate)}
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-mono">
                  Média: {avg}/10
                </span>
              </div>
            </div>

            {/* List preview */}
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {matchingRecords.map((r) => {
                const emoDef = EMOTIONS.find((e) => e.id === r.primary_emotion);
                return (
                  <div
                    key={r.id}
                    className="p-3 rounded-xl bg-surface-container border border-outline-variant/30 text-xs flex items-center justify-between"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-on-surface">
                          {emoDef?.label || r.primary_emotion}
                        </span>
                        <span className="text-on-surface-variant">
                          (Intensidade: {r.intensity}/10)
                        </span>
                      </div>
                      {includeNotes && r.notes && (
                        <p className="text-on-surface-variant text-[11px] truncate max-w-sm">
                          "{r.notes}"
                        </p>
                      )}
                    </div>
                    <span className="text-[11px] text-outline shrink-0 font-mono">
                      {formatDatePt(r.record_timestamp)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Methodological notice */}
            <div className="p-3 rounded-xl bg-surface-container/60 border border-outline-variant/40 flex items-start gap-2.5 text-xs text-on-surface-variant">
              <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                O PDF incluirá automaticamente a nota metodológica explicando que os dados são autorrelatados
                e não constituem diagnóstico ou avaliação médica fechada.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
