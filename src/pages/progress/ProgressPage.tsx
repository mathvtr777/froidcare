import React, { useState, useEffect, useCallback } from 'react';
import { EmotionalRecord } from '../../types';
import { recordsService } from '../../services/recordsService';
import { useAuth } from '../../contexts/AuthContext';
import { EMOTIONS } from '../../constants';
import { formatShortDatePt, formatDayWeekdayPt } from '../../lib/utils';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
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

  // Derive charts data strictly from real records
  const totalRecords = records.length;
  const avgIntensity =
    totalRecords > 0
      ? (records.reduce((acc, r) => acc + r.intensity, 0) / totalRecords).toFixed(1)
      : '0.0';

  // Distribution
  const emotionCountMap: Record<string, number> = {};
  records.forEach((r) => {
    emotionCountMap[r.primary_emotion] = (emotionCountMap[r.primary_emotion] || 0) + 1;
  });

  const emotionChartData = Object.entries(emotionCountMap).map(([id, count]) => {
    const def = EMOTIONS.find((e) => e.id === id);
    return {
      id,
      name: def ? def.label : id,
      count,
      color: def ? def.accentColor : '#528E75',
    };
  }).sort((a, b) => b.count - a.count);

  const topEmotion = emotionChartData.length > 0 ? emotionChartData[0] : null;

  // Timeline data: chronologically sorted
  const timelineData = [...records]
    .sort((a, b) => new Date(a.record_timestamp).getTime() - new Date(b.record_timestamp).getTime())
    .map((r) => ({
      date: formatDayWeekdayPt(r.record_timestamp),
      intensity: r.intensity,
      emotion: (EMOTIONS.find((e) => e.id === r.primary_emotion)?.label) || r.primary_emotion,
      timestamp: r.record_timestamp,
    }));

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-100">
            Meu Progresso
          </h1>
          <p className="text-sm text-neutral-400">
            Acompanhe a distribuição e as variações das suas emoções com base em dados reais.
          </p>
        </div>

        {/* Period Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-charcoal-900 border border-charcoal-800 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setPeriodPreset('7d')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              periodPreset === '7d'
                ? 'bg-sage-950 text-sage-300 border border-sage-800/80 font-semibold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Últimos 7 dias
          </button>
          <button
            type="button"
            onClick={() => setPeriodPreset('30d')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              periodPreset === '30d'
                ? 'bg-sage-950 text-sage-300 border border-sage-800/80 font-semibold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Últimos 30 dias
          </button>
          <button
            type="button"
            onClick={() => setPeriodPreset('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              periodPreset === 'all'
                ? 'bg-sage-950 text-sage-300 border border-sage-800/80 font-semibold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Todo o histórico
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-sm text-neutral-400">
          Calculando resumo a partir dos seus registros...
        </div>
      ) : totalRecords === 0 ? (
        /* Empty State */
        <div className="p-8 rounded-2xl bg-charcoal-900 border border-charcoal-800 text-center space-y-3">
          <div className="w-10 h-10 rounded-full bg-charcoal-850 text-neutral-400 mx-auto flex items-center justify-center border border-charcoal-750">
            <Calendar className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-neutral-200">
            Ainda não há registros suficientes neste período
          </h3>
          <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
            Para apresentar gráficos e resumos significativos, precisamos de registros reais.
            Faça check-ins regulares ao longo da semana para começar a visualizar seus padrões.
          </p>
        </div>
      ) : (
        <>
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-charcoal-900 border border-charcoal-800 space-y-1">
              <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">
                Total de Registros
              </span>
              <div className="text-2xl font-bold text-neutral-100">
                {totalRecords}
              </div>
              <span className="text-xs text-neutral-500">
                no período selecionado
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-charcoal-900 border border-charcoal-800 space-y-1">
              <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">
                Média de Intensidade
              </span>
              <div className="text-2xl font-bold text-sage-400">
                {avgIntensity} <span className="text-sm font-normal text-neutral-400">/ 10</span>
              </div>
              <span className="text-xs text-neutral-500">
                sensação subjetiva média
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-charcoal-900 border border-charcoal-800 space-y-1">
              <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">
                Sensação Mais Frequente
              </span>
              <div className="text-2xl font-bold text-neutral-100 truncate">
                {topEmotion ? topEmotion.name : '—'}
              </div>
              <span className="text-xs text-neutral-500">
                {topEmotion ? `${topEmotion.count} registros (${Math.round((topEmotion.count / totalRecords) * 100)}%)` : ''}
              </span>
            </div>
          </div>

          {/* Descriptive Observation Banner */}
          <div className="p-4 rounded-2xl bg-charcoal-850 border border-charcoal-750 text-xs text-neutral-300 space-y-1.5">
            <div className="font-semibold text-sage-300 flex items-center gap-1.5">
              <span>Observação descritiva dos dados</span>
            </div>
            <p className="text-neutral-400 leading-relaxed">
              No intervalo selecionado, a intensidade média relatada foi de {avgIntensity} em 10.
              A emoção mais registrada foi <strong>{topEmotion?.name}</strong>.
              Estes números descrevem exclusivamente como você se percebeu nestes momentos e não
              representam diagnósticos médicos ou estabilidade clínica fixa.
            </p>
          </div>

          {/* Chart 1: Intensity Timeline */}
          <div className="p-5 rounded-2xl bg-charcoal-900 border border-charcoal-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-neutral-100">
                  Evolução da Intensidade Percebida (0 a 10)
                </h3>
                <p className="text-xs text-neutral-400">
                  Registros cronológicos no período
                </p>
              </div>
            </div>

            {timelineData.length < 2 ? (
              <p className="text-xs text-neutral-500 py-6 text-center">
                Adicione pelo menos dois registros para traçar a linha de evolução cronológica.
              </p>
            ) : (
              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timelineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#232834" />
                    <XAxis
                      dataKey="date"
                      stroke="#6B7280"
                      tick={{ fill: '#9CA3AF', fontSize: 11 }}
                    />
                    <YAxis
                      domain={[0, 10]}
                      stroke="#6B7280"
                      tick={{ fill: '#9CA3AF', fontSize: 11 }}
                      ticks={[0, 2, 4, 6, 8, 10]}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="p-3 rounded-xl bg-charcoal-950 border border-charcoal-750 text-xs space-y-1 shadow-lg">
                              <p className="font-semibold text-neutral-200">{data.date}</p>
                              <p className="text-sage-300">Emoção: {data.emotion}</p>
                              <p className="text-neutral-300">Intensidade: {data.intensity} / 10</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="intensity"
                      stroke="#528E75"
                      strokeWidth={2.5}
                      dot={{ fill: '#528E75', stroke: '#111317', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, fill: '#76A993' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Chart 2: Emotion Distribution */}
          <div className="p-5 rounded-2xl bg-charcoal-900 border border-charcoal-800 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-neutral-100">
                Distribuição das Emoções Registradas
              </h3>
              <p className="text-xs text-neutral-400">
                Frequência de cada sensação relatada
              </p>
            </div>

            <div className="h-56 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={emotionChartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#232834" horizontal={false} />
                  <XAxis
                    type="number"
                    stroke="#6B7280"
                    tick={{ fill: '#9CA3AF', fontSize: 11 }}
                    allowDecimals={false}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    stroke="#6B7280"
                    tick={{ fill: '#D1D5DB', fontSize: 11 }}
                    width={90}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="p-2.5 rounded-xl bg-charcoal-950 border border-charcoal-750 text-xs shadow-lg">
                            <span className="font-medium text-neutral-200">
                              {data.name}: {data.count} registros
                            </span>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                    {emotionChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Accessible Data Table Alternative */}
          <div className="p-4 rounded-2xl bg-charcoal-900 border border-charcoal-800 space-y-3">
            <button
              type="button"
              onClick={() => setShowTableAlt((prev) => !prev)}
              className="w-full flex items-center justify-between text-xs font-medium text-neutral-300 hover:text-white"
            >
              <div className="flex items-center gap-2">
                <TableIcon className="w-4 h-4 text-sage-400" />
                <span>Visualizar alternativa em tabela acessível (leitores de tela)</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${showTableAlt ? 'rotate-180' : ''}`}
              />
            </button>

            {showTableAlt && (
              <div className="overflow-x-auto pt-2">
                <table className="w-full text-left text-xs text-neutral-300">
                  <thead className="border-b border-charcoal-800 text-neutral-400">
                    <tr>
                      <th className="pb-2">Data e Hora</th>
                      <th className="pb-2">Emoção</th>
                      <th className="pb-2">Intensidade</th>
                      <th className="pb-2">Atividade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-charcoal-850">
                    {records.map((r) => (
                      <tr key={r.id}>
                        <td className="py-2">{formatShortDatePt(r.record_timestamp)}</td>
                        <td className="py-2 font-medium">{r.primary_emotion}</td>
                        <td className="py-2">{r.intensity}/10</td>
                        <td className="py-2 text-neutral-400">{r.activity_used || '—'}</td>
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
