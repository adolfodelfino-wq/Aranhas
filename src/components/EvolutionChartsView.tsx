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
import { getRadarProfile, RADAR_PROFILES } from '../data/radarDomainsData';
import {
  calculateScoreVariation,
  sortLongitudinalRecords,
} from '../utils/longitudinalAnalysis';
import {
  TrendingDown,
  Activity,
  Layers,
  ShieldCheck,
  FileCheck,
  AlertTriangle,
  Info,
  Clock,
  Eye,
  EyeOff,
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
}) => {
  const [selectedScale, setSelectedScale] = useState<string>(activeScaleId);
  const [chartType, setChartType] = useState<'line' | 'radar'>('line');
  const [showSyntheticDemo, setShowSyntheticDemo] = useState<boolean>(false);

  // Retrieve scale-specific radar & longitudinal profile
  const profile = getRadarProfile(selectedScale);

  // Filter patient real history for selected scale
  const patientHistoryForScale = Array.isArray(scaleHistory)
    ? scaleHistory.filter(
        (h) =>
          h?.scaleId === selectedScale ||
          (selectedScale === 'phq-9' && (h?.scaleId || '').includes('phq'))
      )
    : [];

  const hasRealHistory = patientHistoryForScale.length > 0;

  // Real data sorted chronologically by date and time
  const sortedRealHistory = hasRealHistory
    ? sortLongitudinalRecords(patientHistoryForScale)
    : [];

  // If user explicitly activated academic synthetic demo
  const syntheticDemoData: ScaleResult[] = showSyntheticDemo
    ? [
        {
          id: `${selectedScale}-demo-c1`,
          scaleId: selectedScale,
          scaleTitle: profile.scaleTitle,
          date: '15/04/2026 09:00',
          consultationNumber: 1,
          totalScore: profile.demoInitialAnswers.reduce((a, b) => a + b, 0),
          maxScore: profile.maxScore,
          classification: 'Linha de Base Demonstrativa (Sintética)',
          severityLevel: 'high',
          interpretation: 'Dado sintético para demonstração visual da curva de resposta.',
          recommendations: ['Registro demonstrativo acadêmico'],
          soapText: `${profile.acronym}: Demonstrativo sintético C1`,
          answersArray: profile.demoInitialAnswers,
        },
        {
          id: `${selectedScale}-demo-c2`,
          scaleId: selectedScale,
          scaleTitle: profile.scaleTitle,
          date: '15/05/2026 09:30',
          consultationNumber: 2,
          totalScore: Math.round(profile.demoInitialAnswers.reduce((a, b) => a + b, 0) * 0.8),
          maxScore: profile.maxScore,
          classification: 'Evolução Intermediária (Sintética)',
          severityLevel: 'moderate',
          interpretation: 'Dado sintético para demonstração visual da curva de resposta.',
          recommendations: ['Registro demonstrativo acadêmico'],
          soapText: `${profile.acronym}: Demonstrativo sintético C2`,
          answersArray: profile.demoInitialAnswers.map((v) => Math.max(0, Math.round(v * 0.8))),
        },
        {
          id: `${selectedScale}-demo-c3`,
          scaleId: selectedScale,
          scaleTitle: profile.scaleTitle,
          date: '15/06/2026 10:00',
          consultationNumber: 3,
          totalScore: Math.round(profile.demoInitialAnswers.reduce((a, b) => a + b, 0) * 0.6),
          maxScore: profile.maxScore,
          classification: 'Resposta em Curso (Sintética)',
          severityLevel: 'moderate',
          interpretation: 'Dado sintético para demonstração visual da curva de resposta.',
          recommendations: ['Registro demonstrativo acadêmico'],
          soapText: `${profile.acronym}: Demonstrativo sintético C3`,
          answersArray: profile.demoInitialAnswers.map((v) => Math.max(0, Math.round(v * 0.6))),
        },
        {
          id: `${selectedScale}-demo-c4`,
          scaleId: selectedScale,
          scaleTitle: profile.scaleTitle,
          date: '15/07/2026 09:15',
          consultationNumber: 4,
          totalScore: Math.round(profile.demoInitialAnswers.reduce((a, b) => a + b, 0) * 0.45),
          maxScore: profile.maxScore,
          classification: 'Melhora Sustentada (Sintética)',
          severityLevel: 'low',
          interpretation: 'Dado sintético para demonstração visual da curva de resposta.',
          recommendations: ['Registro demonstrativo acadêmico'],
          soapText: `${profile.acronym}: Demonstrativo sintético C4`,
          answersArray: profile.demoInitialAnswers.map((v) => Math.max(0, Math.round(v * 0.45))),
        },
        {
          id: `${selectedScale}-demo-c5`,
          scaleId: selectedScale,
          scaleTitle: profile.scaleTitle,
          date: '12/08/2026 11:00',
          consultationNumber: 5,
          totalScore: profile.demoCurrentAnswers.reduce((a, b) => a + b, 0),
          maxScore: profile.maxScore,
          classification: 'Sintomas Mínimos (Sintética)',
          severityLevel: 'low',
          interpretation: 'Dado sintético para demonstração visual da curva de resposta.',
          recommendations: ['Registro demonstrativo acadêmico'],
          soapText: `${profile.acronym}: Demonstrativo sintético C5`,
          answersArray: profile.demoCurrentAnswers,
        },
      ]
    : [];

  const effectiveData: ScaleResult[] = hasRealHistory
    ? sortedRealHistory
    : syntheticDemoData;

  const isDisplayingSynthetic = !hasRealHistory && showSyntheticDemo;

  // Prepare line chart data
  const lineChartData = effectiveData.map((item, idx) => ({
    name: `Consulta ${item.consultationNumber || idx + 1}`,
    data: item.date || `Aplicação #${idx + 1}`,
    score: item.totalScore,
    maxScore: item.maxScore || profile.maxScore,
    classification: item.classification,
    severity: item.severityLevel,
  }));

  // Reference consults
  const firstConsult = effectiveData[0];
  const lastConsult = effectiveData[effectiveData.length - 1];
  const previousConsult = effectiveData.length > 1 ? effectiveData[effectiveData.length - 2] : null;

  const baselineScore = firstConsult ? firstConsult.totalScore : 0;
  const currentScore = lastConsult ? lastConsult.totalScore : 0;
  const previousScore = previousConsult ? previousConsult.totalScore : null;
  const diffFromPrevious = previousScore !== null ? currentScore - previousScore : null;

  // Longitudinal variation calculation based on strict clinical logic
  const variation = calculateScoreVariation({
    scaleId: profile.scaleId,
    baselineScore,
    currentScore,
    baselineDate: firstConsult?.date,
    currentDate: lastConsult?.date,
  });

  // Prepare Radar / Spider Chart data
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
      'Linha de Base': valBaseline,
      'Avaliação Recente': valCurrent,
      fullMark: item.fullMark,
    };
  });

  const handleExportChartSummary = () => {
    if (!onImportToSoap) return;
    if (isDisplayingSynthetic) {
      // Safety shielding: synthetic demo data cannot be exported to SOAP
      return;
    }

    const summaryText = `[EVOLUÇÃO LONGITUDINAL - ${profile.acronym}]
• Instrumento: ${profile.scaleTitle}
${variation.formattedSummary}
• Aplicações Registradas no Prontuário: ${effectiveData.length} sessões
• Linha de Base: ${firstConsult?.date || 'Não datada'} | Avaliação Recente: ${lastConsult?.date || 'Não datada'}
• Nota de Segurança Clínica: A mensuração dimensional psicométrica apoia a decisão terapêutica e não substitui a reavaliação médica presencial nem o julgamento clínico longitudinal.`;

    onImportToSoap(summaryText, `Evolução Longitudinal (${profile.acronym})`);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-teal-50 text-teal-800 rounded border border-teal-200">
                <Activity className="w-5 h-5 text-teal-700" />
              </span>
              <h2 className="text-base sm:text-lg font-semibold text-slate-900">
                Evolução Clínica Longitudinal & Gráficos Psicométricos
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Acompanhamento temporal da evolução e visualização multidimensional adaptada às dimensões do instrumento.
            </p>
          </div>

          {/* Scale & Chart Type Switchers */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
              <button
                type="button"
                onClick={() => setChartType('line')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  chartType === 'line'
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tendência (Linha)
              </button>
              <button
                type="button"
                onClick={() => setChartType('radar')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  chartType === 'radar'
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Dimensões (Radar)
              </button>
            </div>

            <select
              aria-label="Selecionar instrumento clínico para visualização psicométrica"
              value={selectedScale}
              onChange={(e) => {
                setSelectedScale(e.target.value);
                setShowSyntheticDemo(false);
              }}
              className="text-xs font-sans font-medium bg-white border border-slate-200 rounded-md px-3 py-1.5 text-slate-800 focus:outline-none focus:border-teal-700 shadow-2xs"
            >
              {Object.values(RADAR_PROFILES)
                .filter((p) => ['phq-9', 'gad-7', 'audit', 'epds', 'meem', 'asrs-18', 'snap-iv'].includes(p.scaleId))
                .map((p) => (
                <option key={p.scaleId} value={p.scaleId}>
                  {p.acronym} — {p.scaleTitle.replace(/\(.*?\)/, '').trim()}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Empty State when no real records exist and demo is NOT enabled */}
        {!hasRealHistory && !showSyntheticDemo && (
          <div className="mt-6 p-8 bg-slate-50 border border-slate-200 rounded-lg text-center space-y-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto border border-slate-200 text-slate-400">
              <Clock className="w-6 h-6" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="text-sm font-bold text-slate-800">
                Nenhum Histórico Registrado para {profile.acronym}
              </h3>
              <p className="text-xs text-slate-500">
                O paciente <strong>{patient.name}</strong> ainda não possui aplicações salvas da escala {profile.acronym}. Os dados longitudinais reais serão gerados à medida que novas consultas forem registradas.
              </p>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowSyntheticDemo(true)}
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded text-xs font-mono font-semibold transition-colors cursor-pointer shadow-2xs"
              >
                <Eye className="w-4 h-4 text-blue-600" />
                <span>Visualizar Demonstração Acadêmica (Dados Sintéticos)</span>
              </button>
            </div>
          </div>
        )}

        {/* Warning Banner when synthetic demo is active */}
        {isDisplayingSynthetic && (
          <div className="mt-4 p-3.5 bg-amber-50 border border-amber-300 rounded-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-start sm:items-center gap-2 text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5 sm:mt-0" />
              <div>
                <strong>MODO DE DEMONSTRAÇÃO ACADÊMICA (DADOS SINTÉTICOS):</strong> Estes registros são puramente ilustrativos para verificação do modelo de gráfico. Eles <strong>NÃO</strong> pertencem a este paciente e <strong>NÃO</strong> podem ser exportados para o prontuário SOAP.
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowSyntheticDemo(false)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 rounded text-xs font-mono font-bold shrink-0 cursor-pointer"
            >
              <EyeOff className="w-3.5 h-3.5" />
              <span>Ocultar Demonstração</span>
            </button>
          </div>
        )}

        {/* Key Metrics Cards (Hierarquia: Instrumento, Escore Atual, Alteração vs Anterior, Trajetória) */}
        {(hasRealHistory || showSyntheticDemo) && (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-4">
            {/* 1. Instrumento & Datas */}
            <div className="bg-slate-50/80 border border-slate-200/80 p-3.5 rounded-lg space-y-1">
              <span className="font-sans text-[11px] uppercase font-semibold text-slate-500 block">
                Instrumento & Período
              </span>
              <div className="text-sm font-bold text-slate-900 truncate" title={profile.scaleTitle}>
                {profile.acronym}
              </div>
              <span className="text-[11px] text-slate-500 block leading-tight">
                {firstConsult?.date || 'Início'} → {lastConsult?.date || 'Recente'} ({effectiveData.length} {effectiveData.length === 1 ? 'sessão' : 'sessões'})
              </span>
            </div>

            {/* 2. Escore Atual */}
            <div className="bg-slate-50/80 border border-slate-200/80 p-3.5 rounded-lg space-y-1">
              <span className="font-sans text-[11px] uppercase font-semibold text-slate-500 block">
                Escore Atual {isDisplayingSynthetic ? '(Sintético)' : ''}
              </span>
              <div className="text-xl font-bold font-mono text-slate-900">
                {currentScore}{' '}
                <span className="text-xs text-slate-400 font-normal">/ {profile.maxScore} pts</span>
              </div>
              <span className="text-[11px] text-slate-600 font-medium truncate block">
                {lastConsult?.classification || 'Avaliação recente'}
              </span>
            </div>

            {/* 3. Alteração Absoluta em relação à aplicação anterior */}
            <div className="bg-slate-50/80 border border-slate-200/80 p-3.5 rounded-lg space-y-1">
              <span className="font-sans text-[11px] uppercase font-semibold text-slate-500 block">
                Alteração vs. Anterior
              </span>
              <div className="text-xl font-bold font-mono text-slate-900">
                {diffFromPrevious !== null
                  ? `${diffFromPrevious > 0 ? `+${diffFromPrevious}` : diffFromPrevious} pts`
                  : '0 pts (Inicial)'}
              </div>
              <span className="text-[11px] text-slate-500 truncate block">
                {variation.absoluteDifference !== 0
                  ? `${variation.absoluteDifference > 0 ? `+${variation.absoluteDifference}` : variation.absoluteDifference} pts desde início ${variation.relativeVariationText ? `(${variation.relativeVariationText})` : ''}`
                  : 'Linha de base de referência'}
              </span>
            </div>

            {/* 4. Trajetória Observada */}
            <div
              className={`p-3.5 rounded-lg border space-y-1 ${
                variation.clinicalMeaning === 'favorable'
                  ? 'bg-emerald-50/70 border-emerald-200/80 text-emerald-950'
                  : variation.clinicalMeaning === 'unfavorable'
                  ? 'bg-amber-50/70 border-amber-200/80 text-amber-950'
                  : 'bg-slate-50/80 border-slate-200/80 text-slate-800'
              }`}
            >
              <span className="font-sans text-[11px] uppercase font-semibold block opacity-75">
                Trajetória Observada
              </span>
              <div className="text-xs font-bold truncate flex items-center gap-1.5 mt-0.5">
                <ShieldCheck className="w-4 h-4 shrink-0 text-teal-700" />
                <span className="truncate">{variation.clinicalMeaningText}</span>
              </div>
              <span className="text-[11px] opacity-80 block truncate">
                {variation.scoreDirectionText}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Chart Canvas Area (Only rendered if real data or synthetic demo active) */}
      {(hasRealHistory || showSyntheticDemo) && (
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="font-sans font-semibold text-sm text-slate-900 flex items-center gap-2">
              {chartType === 'line' ? (
                <>
                  <TrendingDown className="w-4 h-4 text-teal-700" />
                  <span>
                    Curva de Evolução Longitudinal — {profile.scaleTitle}{' '}
                    {isDisplayingSynthetic ? '(Demonstração Sintética)' : ''}
                  </span>
                </>
              ) : (
                <>
                  <Layers className="w-4 h-4 text-teal-700" />
                  <span>
                    Perfil Multidimensional (Radar) — {profile.acronym}{' '}
                    {isDisplayingSynthetic ? '(Demonstração Sintética)' : ''}
                  </span>
                </>
              )}
            </h3>

            <span className="text-xs text-slate-500 font-normal">
              {chartType === 'line'
                ? `Eixo Y: ${profile.scoreLabel}`
                : `${profile.radialAxisLabel} (${profile.domains.length} dimensões)`}
            </span>
          </div>

          {chartType === 'line' ? (
            <div className="w-full h-72 sm:h-80 pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={lineChartData} margin={{ top: 12, right: 24, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="scoreGradientEditorial" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0D9488" stopOpacity={0.09} />
                      <stop offset="100%" stopColor="#0D9488" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="#94A3B8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#E2E8F0' }}
                  />
                  <YAxis
                    stroke="#94A3B8"
                    fontSize={11}
                    domain={[0, profile.maxScore]}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white border border-slate-200/90 shadow-sm p-3 rounded-lg text-xs font-sans space-y-1 min-w-[160px]">
                            <div className="text-[11px] font-medium text-slate-500">
                              {data.name} · {data.data}
                            </div>
                            <div className="text-sm font-semibold text-slate-900 font-mono">
                              {data.score} <span className="text-xs font-normal text-slate-400">/ {data.maxScore} pts</span>
                            </div>
                            <div className="text-[11px] font-medium text-teal-800 bg-teal-50 border border-teal-200/70 px-2 py-0.5 rounded inline-block">
                              {data.classification}
                            </div>
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
                      strokeDasharray="3 3"
                      strokeOpacity={0.65}
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
                      strokeDasharray="3 3"
                      strokeOpacity={0.65}
                      label={{
                        value: `Ponto de Corte (≥ ${profile.moderateThreshold} pts)`,
                        position: 'insideBottomRight',
                        fill: '#D97706',
                        fontSize: 10,
                      }}
                    />
                  )}
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#0D9488"
                    strokeWidth={2.2}
                    fillOpacity={1}
                    fill="url(#scoreGradientEditorial)"
                    dot={{ r: 3.5, fill: '#0D9488', stroke: '#FFFFFF', strokeWidth: 1.5 }}
                    activeDot={{ r: 5, fill: '#0F766E', stroke: '#FFFFFF', strokeWidth: 2 }}
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
                    name="Linha de Base"
                    dataKey="Linha de Base"
                    stroke="#EF4444"
                    fill="#EF4444"
                    fillOpacity={0.25}
                    strokeWidth={2}
                  />
                  <Radar
                    name="Avaliação Recente"
                    dataKey="Avaliação Recente"
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
                              <div key={`payload-${p.name || idx}-${idx}`} className="flex justify-between gap-3 text-slate-200 font-mono pt-0.5">
                                <span>{p.name}:</span>
                                <strong className="text-white">
                                  {p.value} / {itemPayload?.fullMark} pts
                                </strong>
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
                A evolução psicométrica reflete a trajetória dimensional de sintomas no tempo, auxiliando na avaliação da resposta terapêutica. A interpretação clínica deve ponderar tolerabilidade farmacológica, fatores psicossociais e funcionalidade global do paciente.
              </p>
            </div>
          </div>

          {/* Action Button: Export to SOAP */}
          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-slate-500">
              {isDisplayingSynthetic
                ? 'Exportação para o prontuário SOAP bloqueada para dados sintéticos.'
                : 'A síntese longitudinal calcula a variação absoluta e percentual com base nos registros do paciente.'}
            </span>

            {onImportToSoap && (
              <button
                type="button"
                disabled={isDisplayingSynthetic || !hasRealHistory}
                onClick={handleExportChartSummary}
                className={`px-4 py-2 font-sans font-medium text-xs rounded-lg flex items-center gap-2 transition-colors shrink-0 min-h-[38px] ${
                  isDisplayingSynthetic || !hasRealHistory
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                    : 'bg-teal-700 hover:bg-teal-800 text-white cursor-pointer shadow-xs'
                }`}
                title={
                  isDisplayingSynthetic
                    ? 'Dados sintéticos demonstrativos não podem ser copiados para o prontuário.'
                    : !hasRealHistory
                    ? 'Sem registros para exportação.'
                    : 'Copiar síntese longitudinal calculada para o SOAP'
                }
              >
                <FileCheck className="w-4 h-4 text-teal-200" />
                <span>Copiar Síntese Longitudinal para o SOAP</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
