import React, { useState, useEffect, useCallback } from 'react';
import { EmotionalRecord } from '../../types';
import { recordsService } from '../../services/recordsService';
import { useAuth } from '../../contexts/AuthContext';
import { EMOTIONS } from '../../constants';
import { formatShortDatePt, formatDayWeekdayPt } from '../../lib/utils';
import {
  Calendar,
  Table as TableIcon,
  ChevronDown,
} from 'lucide-react';

export const ProgressPage: React.FC = () => {
  const { user } = useAuth();
  const [periodPreset, setPeriodPreset] = useState<'7d' | '30d' | 'all'>('7d');
  const [records, setRecords] = useState<EmotionalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTableAlt, setShowTableAlt] = useState(false);

  const loadData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const now = new Date();
      let start: string | undefined;

      if (periodPreset === '7d') {
        const d = new Date();
        d.setDate(now.getDate() - 6);
        start = d.toISOString().split('T')[0];
      } else if (periodPreset === '30d') {
        const d = new Date();
        d.setDate(now.getDate() - 29);
        start = d.toISOString().split('T')[0];
      }

      const res = await recordsService.fetchRecords(user.id, {
        startDate: start,
        endDate: now.toISOString().split('T')[0],
      });
      setRecords(res.records);
    } catch (err) {
      console.warn('Erro ao carregar progresso:', err);
    } finally {
      setLoading(false);
    }
  }, [user, periodPreset]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Derived metrics from real user records
  const totalRecords = records.length;
  const avgIntensity =
    totalRecords > 0
      ? (records.reduce((acc, r) => acc + r.intensity, 0) / totalRecords).toFixed(1)
      : '0.0';

  const emotionCountMap: Record<string, number> = {};
  records.forEach((r) => {
    emotionCountMap[r.primary_emotion] = (emotionCountMap[r.primary_emotion] || 0) + 1;
  });

  const emotionChartData = Object.entries(emotionCountMap)
    .map(([id, count]) => {
      const def = EMOTIONS.find((e) => e.id === id);
      return {
        id,
        name: def ? def.label : id,
        count,
        color: def ? def.accentColor : '#5af0b3',
      };
    })
    .sort((a, b) => b.count - a.count);

  const topEmotion = emotionChartData.length > 0 ? emotionChartData[0] : null;
  const topEmotionPercent = topEmotion && totalRecords > 0 ? Math.round((topEmotion.count / totalRecords) * 100) : 0;

  // Activities completed count
  const activitiesCompletedCount = records.filter((r) => Boolean(r.activity_used)).length;

  // Chronologically sorted timeline points
  const timelineRecords = [...records].sort(
    (a, b) => new Date(a.record_timestamp).getTime() - new Date(b.record_timestamp).getTime()
  );

  return (
    <div className="flex flex-col w-full pb-8 space-y-space-md">
      {/* 1. Header Section */}
      <section className="flex flex-col space-y-1 pt-1">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              insights
            </span>
          </span>
          <h2 className="font-headline-md text-headline-md text-on-surface tracking-tight font-bold">
            Meu Progresso
          </h2>
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
          Acompanhe a distribuição e as variações das suas emoções com base em dados reais.
        </p>
      </section>

      {/* 2. Segmented Time Period Selector */}
      <div className="w-full bg-surface-container-lowest/80 p-1 rounded-full flex items-center justify-between shadow-inner border border-outline-variant/30">
        <button
          type="button"
          onClick={() => setPeriodPreset('7d')}
          className={`flex-1 py-1.5 px-3 rounded-full font-label-md text-label-md transition-all duration-300 text-center font-semibold ${
            periodPreset === '7d'
              ? 'text-on-primary bg-primary shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          7 dias
        </button>
        <button
          type="button"
          onClick={() => setPeriodPreset('30d')}
          className={`flex-1 py-1.5 px-3 rounded-full font-label-md text-label-md transition-all duration-300 text-center font-semibold ${
            periodPreset === '30d'
              ? 'text-on-primary bg-primary shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          30 dias
        </button>
        <button
          type="button"
          onClick={() => setPeriodPreset('all')}
          className={`flex-1 py-1.5 px-3 rounded-full font-label-md text-label-md transition-all duration-300 text-center font-semibold ${
            periodPreset === 'all'
              ? 'text-on-primary bg-primary shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Todo o histórico
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-sm text-on-surface-variant">
          Calculando resumo a partir dos seus registros...
        </div>
      ) : totalRecords === 0 ? (
        /* Empty State */
        <div className="p-8 rounded-2xl bg-surface-container-low border border-outline-variant/40 text-center space-y-3">
          <div className="w-10 h-10 rounded-full bg-surface-container text-on-surface-variant mx-auto flex items-center justify-center border border-outline-variant/40">
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-base font-semibold text-on-surface">
            Ainda não há registros suficientes neste período
          </h3>
          <p className="text-xs text-on-surface-variant max-w-md mx-auto leading-relaxed">
            Para apresentar gráficos e resumos significativos, precisamos de registros reais.
            Faça check-ins regulares ao longo da semana para começar a visualizar seus padrões.
          </p>
        </div>
      ) : (
        <>
          {/* 3. Hero Mood Spline Card: Curva de Serenidade */}
          <div className="relative w-full rounded-2xl bg-surface-container-low/90 backdrop-blur-md p-space-md overflow-hidden shadow-lg flex flex-col space-y-space-sm border border-outline-variant/40">
            <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-secondary-container/20 blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between relative z-10">
              <div>
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-semibold">
                  Acompanhamento
                </span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Curva de Serenidade e Intensidade
                </h3>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high/80 text-on-surface text-label-sm font-label-sm border border-outline-variant/30">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Média: <span className="font-semibold text-primary">{avgIntensity} / 10</span>
              </div>
            </div>

            {/* SVG Trendline Graphic */}
            <div className="w-full relative pt-2 z-10">
              <svg className="w-full h-36 overflow-visible" fill="none" viewBox="0 0 340 140" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="splineGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#5af0b3" stopOpacity="0.32" />
                    <stop offset="65%" stopColor="#5af0b3" stopOpacity="0.08" />
                    <stop offset="100%" stopColor="#5af0b3" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="lineGlow" x1="0%" x2="100%" y1="0%" y2="0%">
                    <stop offset="0%" stopColor="#34d399" />
                    <stop offset="45%" stopColor="#ffcf96" />
                    <stop offset="75%" stopColor="#5af0b3" />
                    <stop offset="100%" stopColor="#68fcbf" />
                  </linearGradient>
                </defs>

                {/* Horizontal reference guides */}
                <line stroke="#222a3d" strokeDasharray="3 4" strokeWidth="1" x1="0" x2="340" y1="25" y2="25" />
                <line stroke="#222a3d" strokeDasharray="3 4" strokeWidth="1" x1="0" x2="340" y1="70" y2="70" />
                <line stroke="#222a3d" strokeDasharray="3 4" strokeWidth="1" x1="0" x2="340" y1="115" y2="115" />

                {/* SVG Path computed from timeline records */}
                {(() => {
                  const points = timelineRecords.map((r, i) => {
                    const x = 15 + (i / Math.max(1, timelineRecords.length - 1)) * 310;
                    // Invert y: intensity 10 is near y=15, intensity 0 is near y=120
                    const y = 120 - (r.intensity / 10) * 100;
                    return { x, y, record: r };
                  });

                  if (points.length === 1) {
                    return (
                      <g>
                        <circle cx={points[0].x} cy={points[0].y} fill="#5af0b3" r="6" />
                      </g>
                    );
                  }

                  const pathStr = points.reduce((acc, p, i) => {
                    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
                  }, '');

                  const areaStr = `${pathStr} L ${points[points.length - 1].x} 130 L ${points[0].x} 130 Z`;

                  return (
                    <g>
                      <path d={areaStr} fill="url(#splineGradient)" />
                      <path d={pathStr} stroke="url(#lineGlow)" strokeLinecap="round" strokeWidth="3" />
                      {points.map((p, idx) => (
                        <circle
                          key={idx}
                          cx={p.x}
                          cy={p.y}
                          fill="#131b2e"
                          r="4.5"
                          stroke="#5af0b3"
                          strokeWidth="2.5"
                        />
                      ))}
                    </g>
                  );
                })()}
              </svg>

              {/* Day labels footer */}
              <div className="flex justify-between items-center px-1 pt-1 text-on-surface-variant font-label-sm text-label-sm font-mono">
                {timelineRecords.slice(0, 6).map((r, i) => (
                  <span key={i} className="text-[11px]">
                    {formatDayWeekdayPt(r.record_timestamp)}
                  </span>
                ))}
              </div>
            </div>

            {/* Footnote banner */}
            <div className="relative z-10 mt-1 px-3.5 py-2.5 rounded-xl bg-surface-container-high/60 flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm border border-outline-variant/30">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-tertiary">flare</span>
                <span>
                  {topEmotion
                    ? `A sensação mais presente foi ${topEmotion.name} (${topEmotionPercent}% dos registros).`
                    : 'Registros calculados a partir das suas anotações reais.'}
                </span>
              </div>
            </div>
          </div>

          {/* 4. KPI Grid */}
          <section className="grid grid-cols-2 gap-space-sm w-full">
            {/* KPI 1: Total Registros */}
            <div className="col-span-1 rounded-2xl bg-surface-container-low/80 backdrop-blur-md p-space-md flex flex-col justify-between shadow-md relative overflow-hidden border border-outline-variant/40">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[18px]">self_improvement</span>
                </div>
                <span className="flex items-center text-label-sm font-label-sm text-primary px-2 py-0.5 rounded-full bg-primary/10 font-semibold">
                  Média: {avgIntensity}
                </span>
              </div>
              <div>
                <span className="font-label-sm text-label-sm text-on-surface-variant block">Total de Registros</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="font-display-lg-mobile text-display-lg-mobile text-on-surface font-bold tracking-tight">
                    {totalRecords}
                  </span>
                </div>
                <span className="font-body-sm text-body-sm text-on-surface-variant text-[11px] block mt-1">
                  no período selecionado
                </span>
              </div>
            </div>

            {/* KPI 2: Práticas Concluídas */}
            <div className="col-span-1 rounded-2xl bg-surface-container-low/80 backdrop-blur-md p-space-md flex flex-col justify-between shadow-md relative overflow-hidden border border-outline-variant/40">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-full bg-secondary-container/30 flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                </div>
                <span className="text-label-sm font-label-sm text-secondary px-2 py-0.5 rounded-full bg-secondary-container/20 font-semibold">
                  Acolhimento
                </span>
              </div>
              <div>
                <span className="font-label-sm text-label-sm text-on-surface-variant block">Práticas Realizadas</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="font-display-lg-mobile text-display-lg-mobile text-on-surface font-bold tracking-tight">
                    {activitiesCompletedCount}
                  </span>
                  <span className="font-label-md text-label-md text-on-surface-variant font-medium">sessões</span>
                </div>
                <span className="font-body-sm text-body-sm text-on-surface-variant text-[11px] block mt-1">
                  exercícios concluídos
                </span>
              </div>
            </div>

            {/* KPI 3: Emoção Predominante (Full Width) */}
            <div className="col-span-2 rounded-2xl bg-surface-container-low/80 backdrop-blur-md p-space-md flex items-center justify-between shadow-md border border-outline-variant/40">
              <div className="flex items-center gap-space-sm">
                <div className="relative w-12 h-12 rounded-2xl bg-tertiary-container/20 flex items-center justify-center text-tertiary shadow-inner">
                  <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    spa
                  </span>
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-primary rounded-full ring-2 ring-surface" />
                </div>
                <div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block font-semibold">
                    Sensação Mais Frequente
                  </span>
                  <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                    {topEmotion ? topEmotion.name : '—'}
                  </span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    {topEmotion
                      ? `Presente em ${topEmotionPercent}% dos seus registros de humor`
                      : 'Registre check-ins para ver sua sensação mais frequente'}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 5. Accessible Data Table Alternative */}
          <div className="p-4 rounded-2xl bg-surface-container border border-outline-variant/40 space-y-3">
            <button
              type="button"
              onClick={() => setShowTableAlt((prev) => !prev)}
              className="w-full flex items-center justify-between text-xs font-semibold text-on-surface hover:text-primary transition-colors"
            >
              <div className="flex items-center gap-2">
                <TableIcon className="w-4 h-4 text-primary" />
                <span>Visualizar alternativa em tabela acessível (leitores de tela)</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${showTableAlt ? 'rotate-180' : ''}`}
              />
            </button>

            {showTableAlt && (
              <div className="overflow-x-auto pt-2">
                <table className="w-full text-left text-xs text-on-surface">
                  <thead className="border-b border-surface-container-high text-on-surface-variant font-semibold">
                    <tr>
                      <th className="pb-2">Data e Hora</th>
                      <th className="pb-2">Emoção</th>
                      <th className="pb-2">Intensidade</th>
                      <th className="pb-2">Atividade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container-high/60">
                    {records.map((r) => (
                      <tr key={r.id}>
                        <td className="py-2 font-mono">{formatShortDatePt(r.record_timestamp)}</td>
                        <td className="py-2 font-medium">{r.primary_emotion}</td>
                        <td className="py-2">{r.intensity}/10</td>
                        <td className="py-2 text-on-surface-variant">{r.activity_used || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
