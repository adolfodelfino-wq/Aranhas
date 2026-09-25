import React, { useState } from 'react';
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Area,
  AreaChart,
} from 'recharts';
import { ScaleResult, PatientSession } from '../types';
import { DEMO_SCALE_HISTORY } from '../data/demoPatientData';
import { getRadarProfile, RADAR_PROFILES } from '../data/radarDomainsData';
import {
  TrendingDown,
  Activity,
  Sparkles,
  Layers,
  ShieldCheck,
  FileCheck,
  AlertCircle,
  Info,
} from 'lucide-react';

interface EvolutionChartsViewProps {
  patient: PatientSession;
  scaleHistory: ScaleResult[];
  activeScaleId?: string;
  onImportToSoap?: (text: string, title: string) => void;
  onLoadDemoHistory?: () => void;
}

export const EvolutionChartsView: React.FC<EvolutionChartsViewProps> = ({
  patient,
  scaleHistory = [],
  activeScaleId = 'phq-9',
  onImportToSoap,
  onLoadDemoHistory,
}) => {
  const [selectedScale, setSelectedScale] = useState<string>(activeScaleId);
  const [chartType, setChartType] = useState<'line' | 'radar'>('line');

  // Retrieve scale-specific radar & longitudinal profile
  const profile = getRadarProfile(selectedScale);

  // Filter patient history for selected scale
  const patientHistoryForScale = Array.isArray(scaleHistory)
    ? scaleHistory.filter(
        (h) => h?.scaleId === selectedScale || (selectedScale === 'phq-9' && (h?.scaleId || '').includes('phq'))
      )
    : [];

  const isUsingDemoPreview = patientHistoryForScale.length === 0;

  // Synthesize or retrieve multi-session data
  let effectiveData: ScaleResult[] = [];
  if (patientHistoryForScale.length > 0) {
    effectiveData = patientHistoryForScale;
  } else {
    // Check if DEMO_SCALE_HISTORY has entries for this scale
    const demoEntries = DEMO_SCALE_HISTORY.filter((h) => h.scaleId === selectedScale);
    if (demoEntries.length > 0) {
      effectiveData = demoEntries;
    } else {
      // Build standard 5-session evolution curve from profile for preview
      const initialScore = profile.demoInitialAnswers.reduce((a, b) => a + b, 0);
      const currentScore = profile.demoCurrentAnswers.reduce((a, b) => a + b, 0);
      const s2 = Math.round(initialScore * 0.8);
      const s3 = Math.round(initialScore * 0.6);
      const s4 = Math.round(initialScore * 0.45);

      effectiveData = [
        {
          id: `${selectedScale}-c1`,
          scaleId: selectedScale,
          scaleTitle: profile.scaleTitle,
          date: '15/04/2026',
          consultationNumber: 1,
          totalScore: initialScore,
          maxScore: profile.maxScore,
          classification: 'Sintomatologia inicial / Linha de base',
          severityLevel: 'high',
          interpretation: `Avaliação inicial de base com ${initialScore} pontos.`,
          recommendations: ['Plano de intervenção psicossocial e acompanhamento longitudinal'],
          soapText: `${profile.acronym}: ${initialScore}/${profile.maxScore} pts (Linha de base)`,
          answersArray: profile.demoInitialAnswers,
        },
        {
          id: `${selectedScale}-c2`,
          scaleId: selectedScale,
          scaleTitle: profile.scaleTitle,
          date: '15/05/2026',
          consultationNumber: 2,
          totalScore: s2,
          maxScore: profile.maxScore,
          classification: 'Evolução intermediária',
          severityLevel: 'moderate',
          interpretation: `Segunda consulta: ${s2} pontos.`,
          recommendations: ['Manter plano acordado'],
          soapText: `${profile.acronym}: ${s2}/${profile.maxScore} pts`,
          answersArray: profile.demoInitialAnswers.map((v) => Math.max(0, Math.round(v * 0.8))),
        },
        {
          id: `${selectedScale}-c3`,
          scaleId: selectedScale,
          scaleTitle: profile.scaleTitle,
          date: '15/06/2026',
          consultationNumber: 3,
          totalScore: s3,
          maxScore: profile.maxScore,
          classification: 'Resposta moderada em curso',
          severityLevel: 'moderate',
          interpretation: `Terceira consulta: ${s3} pontos.`,
          recommendations: ['Reforço de psicoeducação'],
          soapText: `${profile.acronym}: ${s3}/${profile.maxScore} pts`,
          answersArray: profile.demoInitialAnswers.map((v) => Math.max(0, Math.round(v * 0.6))),
        },
        {
          id: `${selectedScale}-c4`,
          scaleId: selectedScale,
          scaleTitle: profile.scaleTitle,
          date: '15/07/2026',
          consultationNumber: 4,
          totalScore: s4,
          maxScore: profile.maxScore,
          classification: 'Melhora clínica sustentada',
          severityLevel: 'low',
          interpretation: `Quarta consulta: ${s4} pontos.`,
          recommendations: ['Consolidação do plano'],
          soapText: `${profile.acronym}: ${s4}/${profile.maxScore} pts`,
          answersArray: profile.demoInitialAnswers.map((v) => Math.max(0, Math.round(v * 0.45))),
        },
        {
          id: `${selectedScale}-c5`,
          scaleId: selectedScale,
          scaleTitle: profile.scaleTitle,
          date: '12/08/2026',
          consultationNumber: 5,
          totalScore: currentScore,
          maxScore: profile.maxScore,
          classification: 'Sintomas mínimos / Resposta favorável',
          severityLevel: 'low',
          interpretation: `Quinta consulta: ${currentScore} pontos.`,
          recommendations: ['Acompanhamento de rotina na APS'],
          soapText: `${profile.acronym}: ${currentScore}/${profile.maxScore} pts (Consulta recente)`,
          answersArray: profile.demoCurrentAnswers,
        },
      ];
    }
  }

  // Prepare data for Longitudinal Line Chart
  const lineChartData = effectiveData.map((item, idx) => ({
    name: `Consulta ${item.consultationNumber || idx + 1}`,
    data: item.date,
    score: item.totalScore,
    maxScore: item.maxScore || profile.maxScore,
    classification: item.classification,
    severity: item.severityLevel,
  }));

  // Prepare data for Spider / Radar Chart (Specific to the active scale profile)
  const firstConsult = effectiveData[0];
  const lastConsult = effectiveData[effectiveData.length - 1];

  const maxDomainMark = Math.max(...profile.domains.map((d) => d.fullMark), 1);

  const radarData = profile.domains.map((item) => {
    const valBaseline =
      firstConsult?.answersArray?.[item.keyIdx] ??
      profile.demoInitialAnswers[item.keyIdx] ??
      Math.round(item.fullMark * 0.75);

    const valCurrent =
      lastConsult?.answersArray?.[item.keyIdx] ??
      profile.demoCurrentAnswers[item.keyIdx] ??
      Math.round(item.fullMark * 0.25);

    return {
      domain: item.domain,
      description: item.description,
      'Consulta Inicial (C1)': valBaseline,
      'Consulta Atual (C5)': valCurrent,
      fullMark: item.fullMark,
    };
  });

  // Calculate clinical response percentage
  const baselineScore = firstConsult ? firstConsult.totalScore : profile.demoInitialAnswers.reduce((a, b) => a + b, 0);
  const currentScore = lastConsult ? lastConsult.totalScore : profile.demoCurrentAnswers.reduce((a, b) => a + b, 0);
  const percentChange = Math.round(((currentScore - baselineScore) / (baselineScore || 1)) * 100);
  const isRemission = profile.remissionThreshold !== undefined ? currentScore <= profile.remissionThreshold : currentScore < profile.maxScore * 0.25;
  const isClinicalResponse = percentChange <= -50;

  const handleExportChartSummary = () => {
    if (!onImportToSoap) return;
    if (profile.scaleId === 'meem') {
      const summaryText = `[EVOLUÇÃO LONGITUDINAL - MEEM]\n• Instrumento: ${profile.scaleTitle}\n• Escore Inicial (C1): ${baselineScore}/${profile.maxScore} pts (${firstConsult?.date || 'Inicial'})\n• Escore Atual (C5): ${currentScore}/${profile.maxScore} pts (${lastConsult?.date || 'Atual'})\n• Variação Cognitiva: ${currentScore >= baselineScore ? `Estabilidade / Ganho (+${currentScore - baselineScore} pts)` : `Declínio cognitivo (${currentScore - baselineScore} pts)`}`;
      onImportToSoap(summaryText, `Evolução Longitudinal (${profile.acronym})`);
      return;
    }

    const summaryText = `[EVOLUÇÃO LONGITUDINAL - ${profile.acronym}]\n• Instrumento: ${profile.scaleTitle}\n• Escore Inicial (C1): ${baselineScore}/${profile.maxScore} pts (${firstConsult?.date || 'Inicial'})\n• Escore Atual (C5): ${currentScore}/${profile.maxScore} pts (${lastConsult?.date || 'Atual'})\n• Variação Sintomática: ${percentChange > 0 ? `+${percentChange}` : percentChange}% de redução de sintomas\n• Status da Evolução: ${isRemission ? 'Critério de Remissão / Controle Sintomático Atingido' : isClinicalResponse ? 'Resposta Terapêutica Significativa (≥ 50% de redução)' : 'Em Acompanhamento e Ajuste Terapêutico'}\n• Nota de Segurança: O escore psicométrico mensura a evolução sintomática e não substitui a reavaliação diagnóstica e clínica integral.`;
    onImportToSoap(summaryText, `Evolução Longitudinal de Escores (${profile.acronym})`);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-blue-50 text-[#0A3B74] rounded border border-blue-200">
                <Activity className="w-5 h-5" />
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Evolução Clínica Longitudinal & Gráficos Psicométricos
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Acompanhamento temporal da evolução sintomática e visualização multidimensional adaptada às dimensões específicas de cada instrumento.
            </p>
          </div>

          {/* Scale & Chart Type Switchers */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-md border border-slate-200 p-0.5 bg-slate-50">
              <button
                type="button"
                onClick={() => setChartType('line')}
                className={`px-3 py-1.5 text-xs font-mono font-bold rounded transition-colors cursor-pointer ${
                  chartType === 'line'
                    ? 'bg-[#0A3B74] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                📈 Tendência (Linha)
              </button>
              <button
                type="button"
                onClick={() => setChartType('radar')}
                className={`px-3 py-1.5 text-xs font-mono font-bold rounded transition-colors cursor-pointer ${
                  chartType === 'radar'
                    ? 'bg-[#0A3B74] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🕸️ Teia de Aranha (Radar)
              </button>
            </div>

            <select
              aria-label="Selecionar instrumento clínico para visualização psicométrica"
              value={selectedScale}
              onChange={(e) => setSelectedScale(e.target.value)}
              className="text-xs font-sans font-semibold bg-white border border-slate-300 rounded-md px-3 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0A3B74] shadow-2xs"
            >
              {Object.values(RADAR_PROFILES).map((p) => (
                <option key={p.scaleId} value={p.scaleId}>
                  {p.acronym} — {p.scaleTitle.replace(/\(.*?\)/, '').trim()}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Demo Notification Notice if no actual records for current patient */}
        {isUsingDemoPreview && (
          <div className="mt-4 p-3 bg-blue-50/70 border border-blue-200 rounded-md flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-blue-900">
              <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
              <span>
                <strong>Curva Sintética Demonstrativa:</strong> Exibindo perfil longitudinal de 5 consultas para a escala <strong>{profile.acronym}</strong> com dimensões clínicas estruturadas.
              </span>
            </div>
            {onLoadDemoHistory && (
              <button
                onClick={onLoadDemoHistory}
                className="px-2.5 py-1 bg-white hover:bg-blue-100 text-blue-800 border border-blue-300 rounded text-[11px] font-mono font-bold self-start sm:self-auto cursor-pointer"
              >
                Vincular ao Prontuário
              </button>
            )}
          </div>
        )}

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-4">
          <div className="bg-slate-50 border border-slate-200 p-3 rounded">
            <span className="font-mono text-[10px] uppercase font-bold text-slate-500 block">
              Escore Inicial (C1)
            </span>
            <div className="text-xl font-bold font-mono text-slate-800">
              {baselineScore} <span className="text-xs text-slate-400 font-normal">/ {profile.maxScore} pts</span>
            </div>
            <span className="text-[10px] text-slate-500 truncate block">
              {firstConsult?.classification || 'Linha de base inicial'}
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-3 rounded">
            <span className="font-mono text-[10px] uppercase font-bold text-slate-500 block">
              Escore Atual (C5)
            </span>
            <div className="text-xl font-bold font-mono text-[#0A3B74]">
              {currentScore} <span className="text-xs text-slate-400 font-normal">/ {profile.maxScore} pts</span>
            </div>
            <span className="text-[10px] text-emerald-700 font-medium truncate block">
              {lastConsult?.classification || 'Consulta recente'}
            </span>
          </div>

          <div className="bg-emerald-50/70 border border-emerald-200 p-3 rounded">
            <span className="font-mono text-[10px] uppercase font-bold text-emerald-800 block">
              {profile.scaleId === 'meem' ? 'Variação Cognitiva' : 'Variação Sintomática'}
            </span>
            <div className="text-xl font-bold font-mono text-emerald-700">
              {profile.scaleId === 'meem'
                ? `${currentScore >= baselineScore ? `+${currentScore - baselineScore}` : currentScore - baselineScore} pts`
                : `${percentChange > 0 ? `+${percentChange}` : percentChange}%`}
            </div>
            <span className="text-[10px] text-emerald-800 font-semibold truncate block">
              {profile.scaleId === 'meem'
                ? currentScore >= baselineScore
                  ? '✓ Estabilidade / Ganho Cognitivo'
                  : '⚠️ Declínio Cognitivo'
                : isClinicalResponse
                ? '✓ Resposta Clínica (≥ 50%)'
                : 'Em acompanhamento'}
            </span>
          </div>

          <div className="bg-blue-50/70 border border-blue-200 p-3 rounded">
            <span className="font-mono text-[10px] uppercase font-bold text-blue-800 block">
              {profile.scaleId === 'meem' ? 'Ponto de Corte Cognitivo' : 'Meta de Controle'}
            </span>
            <div className="text-sm font-bold text-blue-900 mt-1 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                {profile.scaleId === 'meem'
                  ? currentScore >= 27
                    ? 'Desempenho Preservado'
                    : 'Abaixo do Corte Geral'
                  : isRemission
                  ? 'Controle / Remissão Atingida'
                  : 'Ajuste / Manutenção'}
              </span>
            </div>
            <span className="text-[10px] text-blue-700 font-mono">
              {profile.scaleId === 'meem'
                ? 'Norma Brucki: ≥ 27 pts (ou por escolaridade)'
                : profile.remissionThreshold !== undefined
                ? `Corte remissão: ≤ ${profile.remissionThreshold} pts`
                : `Corte esperado: < ${Math.round(profile.maxScore * 0.3)} pts`}
            </span>
          </div>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="font-sans font-bold text-sm text-slate-900 flex items-center gap-2">
            {chartType === 'line' ? (
              <>
                <TrendingDown className="w-4 h-4 text-teal-600" />
                <span>Curva de Evolução Longitudinal — {profile.scaleTitle}</span>
              </>
            ) : (
              <>
                <Layers className="w-4 h-4 text-teal-600" />
                <span>Perfil Sintomático Multidimensional (Radar) — {profile.acronym}</span>
              </>
            )}
          </h3>

          <span className="text-[11px] font-mono text-slate-500">
            {chartType === 'line'
              ? `Eixo Y: ${profile.scoreLabel}`
              : `${profile.radialAxisLabel} (${profile.domains.length} dimensões)`}
          </span>
        </div>

        {chartType === 'line' ? (
          <div className="w-full h-72 sm:h-80 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={lineChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0A3B74" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#0A3B74" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#64748B"
                  fontSize={11}
                  domain={[0, profile.maxScore]}
                  tickLine={false}
                  label={{ value: 'Pontos', angle: -90, position: 'insideLeft', fill: '#94A3B8', fontSize: 10 }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-3 rounded text-xs shadow-lg space-y-1 font-sans">
                          <div className="font-bold font-mono text-blue-300">{data.name} ({data.data})</div>
                          <div className="text-sm font-bold">{data.score} / {data.maxScore} pontos</div>
                          <div className="text-slate-300 text-[11px]">{data.classification}</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                {profile.remissionThreshold !== undefined && (
                  <ReferenceLine
                    y={profile.remissionThreshold}
                    stroke="#10B981"
                    strokeDasharray="4 4"
                    label={{
                      value: `Corte de Remissão (≤ ${profile.remissionThreshold} pts)`,
                      position: 'insideBottomRight',
                      fill: '#059669',
                      fontSize: 10,
                    }}
                  />
                )}
                {profile.moderateThreshold !== undefined && (
                  <ReferenceLine
                    y={profile.moderateThreshold}
                    stroke="#F59E0B"
                    strokeDasharray="4 4"
                    label={{
                      value: `Ponto de Corte Relevante (≥ ${profile.moderateThreshold} pts)`,
                      position: 'insideBottomRight',
                      fill: '#D97706',
                      fontSize: 10,
                    }}
                  />
                )}
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#0A3B74"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#scoreGradient)"
                  dot={{ r: 5, fill: '#0A3B74', stroke: '#FFFFFF', strokeWidth: 2 }}
                  activeDot={{ r: 7, fill: '#38BDF8' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="w-full h-84 sm:h-96 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#CBD5E1" />
                <PolarAngleAxis
                  dataKey="domain"
                  tick={{ fill: '#1E293B', fontSize: 10, fontWeight: 600 }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, maxDomainMark]}
                  stroke="#94A3B8"
                  fontSize={10}
                />
                <Radar
                  name="Consulta Inicial (C1)"
                  dataKey="Consulta Inicial (C1)"
                  stroke="#EF4444"
                  fill="#EF4444"
                  fillOpacity={0.25}
                  strokeWidth={2}
                />
                <Radar
                  name="Consulta Atual (C5)"
                  dataKey="Consulta Atual (C5)"
                  stroke="#0D9488"
                  fill="#0D9488"
                  fillOpacity={0.35}
                  strokeWidth={2}
                />
                <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '11px', fontFamily: 'monospace' }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const itemPayload = payload[0]?.payload;
                      return (
                        <div className="bg-slate-900 text-white p-2.5 rounded text-xs shadow-lg space-y-1 font-sans max-w-xs">
                          <div className="font-bold text-amber-300">{itemPayload?.domain}</div>
                          {itemPayload?.description && (
                            <div className="text-[11px] text-slate-300 italic pb-1 border-b border-slate-700">
                              {itemPayload.description}
                            </div>
                          )}
                          {payload.map((p, idx) => (
                            <div key={idx} className="flex justify-between gap-3 text-slate-200 font-mono pt-0.5">
                              <span>{p.name}:</span>
                              <strong className="text-white">{p.value} / {itemPayload?.fullMark} pts</strong>
                            </div>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Safety & Methodological Governance Note */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded flex items-start gap-2 text-xs text-slate-600">
          <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-semibold text-slate-800">
              Alinhamento Metodológico: Escala ≠ Diagnóstico | Escore ≠ Conduta Automática
            </span>
            <p className="text-[11px] text-slate-500">
              O gráfico de teia de aranha (radar) reflete os domínios psicométricos específicos do instrumento selecionado ({profile.acronym}), permitindo identificar assimetrias de resposta clínica (ex.: melhora do humor com persistência de insônia). A interpretação e conduta permanecem sob julgamento médico.
            </p>
          </div>
        </div>

        {/* Action Button: Export to SOAP */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-slate-500">
            Acompanhe a curva de resposta para fundamentar decisões clínicas de acompanhamento e documentação.
          </span>

          {onImportToSoap && (
            <button
              onClick={handleExportChartSummary}
              className="px-4 py-2.5 bg-[#0A3B74] hover:bg-[#07284F] text-white font-mono font-bold text-xs uppercase tracking-wider rounded flex items-center gap-2 transition-colors cursor-pointer shrink-0 min-h-[40px]"
            >
              <FileCheck className="w-4 h-4 text-[#38BDF8]" />
              <span>Copiar Síntese Longitudinal para o SOAP</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

