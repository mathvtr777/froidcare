import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { recordsService } from '../../services/recordsService';
import { pdfService } from '../../services/pdfService';
import { EmotionalRecord, ReportConfig } from '../../types';
import { getDateRangePresets, formatDatePt } from '../../lib/utils';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { EMOTIONS } from '../../constants';
import {
  Download,
  AlertCircle,
  Eye,
  ShieldCheck,
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { user } = useAuth();
  const presets = getDateRangePresets();

  const [periodType, setPeriodType] = useState<'7d' | '30d' | 'month' | 'custom'>('7d');
  const [startDate, setStartDate] = useState(presets.last7Days.start);
  const [endDate, setEndDate] = useState(presets.last7Days.end);

  const [includeNotes, setIncludeNotes] = useState(true);
  const [includeSummary, setIncludeSummary] = useState(true);
  const [includeActivities, setIncludeActivities] = useState(true);
  const [displayName, setDisplayName] = useState(user?.display_name || '');

  const [matchingRecords, setMatchingRecords] = useState<EmotionalRecord[]>([]);
  const [loadingPreview, setLoadingPreview] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  // Update dates when preset changes
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

  // Preview stats
  const total = matchingRecords.length;
  const avg =
    total > 0
      ? (matchingRecords.reduce((acc, r) => acc + r.intensity, 0) / total).toFixed(1)
      : '0.0';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-100">
          Relatórios em PDF
        </h1>
        <p className="text-sm text-neutral-400">
          Gere um documento organizado para compartilhar com seu terapeuta ou guardar para acompanhamento.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Configuration Form */}
        <div className="lg:col-span-1 p-5 rounded-2xl bg-charcoal-900 border border-charcoal-800 space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-400">
            Configurar Relatório
          </h2>

          {/* Period Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-neutral-300">
              Período de exportação
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: '7d', label: 'Últimos 7 dias' },
                { id: '30d', label: 'Últimos 30 dias' },
                { id: 'month', label: 'Mês atual' },
                { id: 'custom', label: 'Personalizado' },
              ].map((p) => (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => setPeriodType(p.id as any)}
                  className={`p-2 rounded-xl text-xs font-medium border text-center transition-colors ${
                    periodType === p.id
                      ? 'border-sage-600 bg-sage-950/80 text-sage-300 font-semibold'
                      : 'border-charcoal-800 bg-charcoal-850 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Custom Dates Inputs */}
            {periodType === 'custom' && (
              <div className="space-y-2 pt-2">
                <Input
                  label="Data de início"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <Input
                  label="Data de término"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Optional Display Name */}
          <Input
            label="Nome de exibição no cabeçalho (opcional)"
            placeholder="Ex: Matheus ou Deixar em branco"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            helperText="Deixe em branco se preferir um relatório anônimo."
          />

          {/* Section Inclusions */}
          <div className="space-y-2 pt-2 border-t border-charcoal-800">
            <label className="block text-xs font-medium text-neutral-300">
              Seções incluídas no documento
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeSummary}
                  onChange={(e) => setIncludeSummary(e.target.checked)}
                  className="rounded accent-sage-500 w-4 h-4"
                />
                <span>Resumo descritivo e médias de intensidade</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeNotes}
                  onChange={(e) => setIncludeNotes(e.target.checked)}
                  className="rounded accent-sage-500 w-4 h-4"
                />
                <span>Anotações pessoais e contextos relatados</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeActivities}
                  onChange={(e) => setIncludeActivities(e.target.checked)}
                  className="rounded accent-sage-500 w-4 h-4"
                />
                <span>Exercícios e práticas de acolhimento realizadas</span>
              </label>
            </div>
          </div>

          {/* Download Action */}
          <div className="pt-2">
            <Button
              className="w-full shadow-md font-semibold"
              onClick={handleDownloadPdf}
              isLoading={isExporting}
              disabled={loadingPreview || total === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              Baixar Relatório em PDF
            </Button>
            {total === 0 && !loadingPreview && (
              <p className="text-[11px] text-neutral-500 text-center mt-2">
                Não há registros no período para exportar.
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Interactive Document Preview */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-5 md:p-6 rounded-2xl bg-charcoal-900 border border-charcoal-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-charcoal-800">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-sage-400" />
                <h3 className="text-sm font-semibold text-neutral-100">
                  Pré-visualização do Conteúdo
                </h3>
              </div>
              <span className="text-xs text-neutral-400">
                {total} {total === 1 ? 'registro encontrado' : 'registros encontrados'}
              </span>
            </div>

            {loadingPreview ? (
              <div className="py-12 text-center text-xs text-neutral-400">
                Carregando registros do período...
              </div>
            ) : total === 0 ? (
              <div className="py-12 text-center space-y-2">
                <AlertCircle className="w-8 h-8 text-neutral-500 mx-auto" />
                <p className="text-sm text-neutral-300">
                  Nenhum registro encontrado entre {formatDatePt(startDate)} e {formatDatePt(endDate)}.
                </p>
                <p className="text-xs text-neutral-500">
                  Experimente selecionar um intervalo maior de datas.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Simulated Document Header */}
                <div className="p-4 rounded-xl bg-charcoal-950 border border-charcoal-800 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-bold text-neutral-100">
                        Relatório de Registros Emocionais
                      </h4>
                      <p className="text-xs text-neutral-400">
                        {displayName ? `Usuário: ${displayName}` : 'Documento Pessoal'}
                      </p>
                    </div>
                    <span className="text-[11px] text-neutral-500">
                      {formatDatePt(startDate)} a {formatDatePt(endDate)}
                    </span>
                  </div>

                  <div className="pt-2 flex items-center gap-4 text-xs text-neutral-300 border-t border-charcoal-850">
                    <span>Média de intensidade: <strong>{avg}/10</strong></span>
                    <span>Registros: <strong>{total}</strong></span>
                  </div>
                </div>

                {/* Simulated Records Table */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    Registros que serão impressos:
                  </h4>
                  <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                    {matchingRecords.map((r) => {
                      const emoDef = EMOTIONS.find((e) => e.id === r.primary_emotion);
                      return (
                        <div
                          key={r.id}
                          className="p-3 rounded-xl bg-charcoal-850 border border-charcoal-800 text-xs flex items-center justify-between gap-2"
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-neutral-200">
                                {emoDef?.label || r.primary_emotion}
                              </span>
                              <span className="text-neutral-400">
                                (Intensidade: {r.intensity}/10)
                              </span>
                            </div>
                            {includeNotes && r.notes && (
                              <p className="text-neutral-400 text-[11px] truncate max-w-md">
                                "{r.notes}"
                              </p>
                            )}
                          </div>
                          <span className="text-[11px] text-neutral-500 shrink-0">
                            {formatDatePt(r.record_timestamp)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Methodological Notice */}
                <div className="p-3 rounded-xl bg-charcoal-950/80 border border-charcoal-800 flex items-start gap-2.5 text-xs text-neutral-400">
                  <ShieldCheck className="w-4 h-4 text-sage-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    O PDF incluirá automaticamente a nota metodológica explicando que os dados
                    são autorrelatados e não constituem diagnóstico ou avaliação clínica fechada.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
