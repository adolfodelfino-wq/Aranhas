import React, { useState, useEffect } from 'react';
import { ALL_SCALES } from '../data/scalesData';
import { ScaleDefinition, ScaleResult } from '../types';
import { ErrorBoundary } from './ErrorBoundary';
import { WhatsappShareModal } from './WhatsappShareModal';
import { PatientSelfFillModal } from './PatientSelfFillModal';
import { EvolutionChartsView } from './EvolutionChartsView';
import {
  ClipboardList,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  FileCheck,
  HelpCircle,
  AlertTriangle,
  Info,
  MessageSquare,
  Smartphone,
  Share2,
  Activity,
  Check,
  Copy,
  BookOpen,
  Sparkles,
  ShieldAlert,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  LayoutGrid,
  ListOrdered,
  TrendingUp,
} from 'lucide-react';

interface ScalesViewProps {
  onImportToSoap: (text: string, title: string) => void;
  onSaveScaleResult?: (result: ScaleResult) => void;
  onOpenEducationSuggestions?: () => void;
  patientName?: string;
  scaleHistory?: ScaleResult[];
  initialScaleId?: string;
  onSelectScaleId?: (scaleId: string) => void;
  onLoadDemoHistory?: () => void;
}

export const ScalesView: React.FC<ScalesViewProps> = ({
  onImportToSoap,
  onSaveScaleResult,
  onOpenEducationSuggestions,
  patientName = 'Maria da Silva',
  scaleHistory = [],
  initialScaleId = 'phq-9',
  onSelectScaleId,
  onLoadDemoHistory,
}) => {
  const [selectedScaleId, setSelectedScaleId] = useState<string>(initialScaleId);
  const [activeTab, setActiveTab] = useState<'calculator' | 'charts' | 'next_steps' | 'evidence' | 'creator'>('calculator');
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [copied, setCopied] = useState<boolean>(false);
  const [imported, setImported] = useState<boolean>(false);

  // Sync state when initialScaleId changes from URL / routing
  useEffect(() => {
    if (initialScaleId && initialScaleId !== selectedScaleId) {
      setSelectedScaleId(initialScaleId);
    }
  }, [initialScaleId]);

  // WhatsApp and Self-Fill Modals State
  const [showWhatsappModal, setShowWhatsappModal] = useState<boolean>(false);
  const [showSelfFillModal, setShowSelfFillModal] = useState<boolean>(false);

  const scale: ScaleDefinition =
    ALL_SCALES.find((s) => s.id === selectedScaleId) || ALL_SCALES[0];

  // Reset or initialize answers when switching scales
  useEffect(() => {
    // Check if there is a recent result in scaleHistory for this scale
    const prevResult = scaleHistory.find((r) => r.scaleId === scale.id);
    if (prevResult && prevResult.answersArray && prevResult.answersArray.length > 0) {
      const initAnswers: Record<string, number> = {};
      scale.questions.forEach((q, idx) => {
        if (prevResult.answersArray && prevResult.answersArray[idx] !== undefined) {
          initAnswers[q.id] = prevResult.answersArray[idx];
        }
      });
      setAnswers(initAnswers);
    } else {
      // Do not pre-fill with 0: start with clean, unselected state so options are not biased or pre-marked
      setAnswers({});
    }
    setCurrentStepIndex(0);
    setImported(false);
    setCopied(false);
  }, [selectedScaleId, scale]);

  // Compute result in real time
  const computedResult: ScaleResult = React.useMemo(() => {
    const computed = scale.calculateResult(answers);
    const answersSummary = scale.questions.map((q) => {
      const val = answers[q.id];
      const matchedOpt = val !== undefined ? q.options.find((o) => o.value === val) : undefined;
      return {
        questionText: q.text,
        answerLabel: matchedOpt ? matchedOpt.label : 'Não respondido',
        value: val ?? 0,
      };
    });
    const answersArray = scale.questions.map((q) => answers[q.id] ?? 0);
    const soapText = computed.soapText || `${scale.acronym}: ${computed.totalScore}/${computed.maxScore} pts (${computed.classification}) | Itens: [${answersArray.join(', ')}]`;

    return {
      ...computed,
      scaleId: scale.id,
      scaleTitle: scale.title,
      answersSummary,
      answersArray,
      soapText,
      date: new Date().toLocaleDateString('pt-BR'),
    };
  }, [scale, answers]);

  const handleSelectOption = (questionId: string, value: number) => {
    const updated = { ...answers, [questionId]: value };
    setAnswers(updated);
    setImported(false);

    if (currentStepIndex < scale.questions.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }

    if (onSaveScaleResult) {
      const computed = scale.calculateResult(updated);
      const answersArray = scale.questions.map((q) => updated[q.id] ?? 0);
      const soapText = computed.soapText || `${scale.acronym}: ${computed.totalScore}/${computed.maxScore} pts (${computed.classification}) | Itens: [${answersArray.join(', ')}]`;
      onSaveScaleResult({
        ...computed,
        scaleId: scale.id,
        scaleTitle: scale.title,
        answersArray,
        soapText,
        date: new Date().toLocaleDateString('pt-BR'),
      });
    }
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentStepIndex(0);
    setImported(false);
  };

  const handleCopyResult = () => {
    navigator.clipboard.writeText(computedResult.soapText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportToSoap = () => {
    onImportToSoap(computedResult.soapText, computedResult.scaleTitle);
    setImported(true);
    if (onSaveScaleResult) {
      onSaveScaleResult(computedResult);
    }
    setTimeout(() => setImported(false), 3000);
  };

  // Check for critical items (e.g., PHQ-9 Q9 suicidal ideation)
  const hasCriticalItem =
    scale.id === 'phq-9' && answers['q9'] !== undefined && answers['q9'] > 0;

  // Severity color mapping
  const getSeverityBadgeClass = (severity: string) => {
    switch (severity) {
      case 'severe':
      case 'high':
        return 'bg-red-50 text-red-700 border-red-300';
      case 'moderate':
        return 'bg-amber-50 text-amber-800 border-amber-300';
      case 'low':
      default:
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
    }
  };

  return (
    <div className="w-full min-w-0 max-w-7xl mx-auto space-y-4 sm:space-y-6 py-1 font-sans">
      {/* Top Scale Selector & Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-4">
        {/* Dropdown Selector Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <label className="text-xs font-mono font-bold uppercase text-slate-500">
              Escala Selecionada:
            </label>
            <select
              value={selectedScaleId}
              onChange={(e) => {
                const newId = e.target.value;
                setSelectedScaleId(newId);
                if (onSelectScaleId) onSelectScaleId(newId);
              }}
              className="bg-slate-50 border border-slate-300 rounded px-3 py-1.5 text-xs font-bold text-[#0A3B74] focus:outline-none focus:border-blue-600 cursor-pointer"
            >
              {ALL_SCALES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.acronym} - {s.title} ({s.questions.length} itens)
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowWhatsappModal(true)}
              className="px-3 py-1.5 bg-white hover:bg-slate-50 text-emerald-700 border border-emerald-300 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Enviar WhatsApp</span>
            </button>

            <button
              onClick={() => setShowSelfFillModal(true)}
              className="px-3 py-1.5 bg-white hover:bg-slate-50 text-[#0A3B74] border border-blue-200 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Autoaplicação</span>
            </button>
          </div>
        </div>

        {/* Scale Title & Metadata Header */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono font-bold text-sm bg-blue-50 text-[#0A3B74] border border-blue-200 px-2.5 py-0.5 rounded">
              {scale.acronym}
            </span>
            <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
              {scale.questions.length} itens
            </span>
            <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
              ~{scale.estimatedMinutes || 2} min
            </span>
            <span className="text-xs font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded">
              Validação APS / SUS
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight">
            {scale.title}
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {scale.description}
          </p>
        </div>

        {/* Tabs Navigation */}
        <div className="flex border-b border-slate-200 pt-1 gap-2 text-xs font-semibold overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('calculator')}
            className={`py-3 px-3.5 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer shrink-0 min-h-[44px] ${
              activeTab === 'calculator'
                ? 'border-[#0A3B74] text-[#0A3B74] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            <span>Calculadora / Formulário</span>
          </button>

          <button
            onClick={() => setActiveTab('charts')}
            className={`py-3 px-3.5 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer shrink-0 min-h-[44px] ${
              activeTab === 'charts'
                ? 'border-[#0A3B74] text-[#0A3B74] font-bold bg-blue-50/50 rounded-t'
                : 'border-transparent text-blue-700 hover:text-blue-900 hover:bg-slate-50 rounded-t font-semibold'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span>📈 Gráficos & Evolução Longitudinal</span>
          </button>

          <button
            onClick={() => setActiveTab('next_steps')}
            className={`py-3 px-3.5 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer shrink-0 min-h-[44px] ${
              activeTab === 'next_steps'
                ? 'border-[#0A3B74] text-[#0A3B74] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Conduta & Próximos Passos</span>
          </button>

          <button
            onClick={() => setActiveTab('evidence')}
            className={`py-3 px-3.5 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer shrink-0 min-h-[44px] ${
              activeTab === 'evidence'
                ? 'border-[#0A3B74] text-[#0A3B74] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Evidência & Pérolas</span>
          </button>

          <button
            onClick={() => setActiveTab('creator')}
            className={`py-3 px-3.5 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer shrink-0 min-h-[44px] ${
              activeTab === 'creator'
                ? 'border-[#0A3B74] text-[#0A3B74] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Info className="w-4 h-4" />
            <span>Sobre o Criador</span>
          </button>
        </div>
      </div>

      {/* TAB: CHARTS & LONGITUDINAL EVOLUTION */}
      {activeTab === 'charts' && (
        <EvolutionChartsView
          patient={{ name: patientName, age: 0, prontuario: '', date: '' }}
          scaleHistory={scaleHistory}
          activeScaleId={scale.id}
          onImportToSoap={onImportToSoap}
          onLoadDemoHistory={onLoadDemoHistory}
        />
      )}

      {/* TAB 1: CALCULATOR (Automatic Step-by-Step for all scales) */}
      {activeTab === 'calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: Step-by-Step Question Interface (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Step Navigation Bar & Question Pills */}
            <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold uppercase text-[#0A3B74] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                    Item {currentStepIndex + 1} de {scale.questions.length}
                  </span>
                  <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                    {Math.round(((currentStepIndex + 1) / scale.questions.length) * 100)}% concluído
                  </span>
                </div>

                <button
                  onClick={handleReset}
                  className="text-slate-500 hover:text-slate-800 text-xs font-mono font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Limpar Respostas</span>
                </button>
              </div>

              {/* Smooth Progress Bar */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#0A3B74] h-full transition-all duration-300 rounded-full"
                  style={{
                    width: `${((currentStepIndex + 1) / scale.questions.length) * 100}%`,
                  }}
                />
              </div>

              {/* Clickable Question Number Quick-Jump Pills */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-100">
                <span className="text-[11px] font-mono text-slate-400 font-semibold mr-1">
                  Itens:
                </span>
                {scale.questions.map((q, idx) => {
                  const isCurrent = idx === currentStepIndex;
                  const isAnswered = answers[q.id] !== undefined;
                  const val = answers[q.id] ?? 0;

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentStepIndex(idx)}
                      title={`Ir para item ${idx + 1}: ${q.text.slice(0, 30)}...`}
                      className={`min-w-[28px] h-7 px-1.5 rounded text-xs font-mono font-bold transition-all flex items-center justify-center cursor-pointer border ${
                        isCurrent
                          ? 'bg-white text-teal-800 border-teal-600 shadow-xs ring-2 ring-teal-200'
                          : isAnswered && val > 0
                          ? 'bg-teal-50 text-teal-800 border-teal-200 hover:bg-teal-100'
                          : isAnswered
                          ? 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                          : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span>{idx + 1}</span>
                      {q.id === 'q9' && scale.id === 'phq-9' && answers['q9'] !== undefined && answers['q9'] > 0 && (
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 ml-0.5 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Current Question Step Card */}
            {scale.questions[currentStepIndex] && (
              <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 space-y-5 shadow-xs">
                {/* Question Text & Critical Alert */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-mono font-bold uppercase text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      Questão #{currentStepIndex + 1}
                    </span>
                    {scale.questions[currentStepIndex].id === 'q9' && scale.id === 'phq-9' && answers['q9'] !== undefined && answers['q9'] > 0 && (
                      <span className="bg-red-50 text-red-700 border border-red-200 text-[10px] font-mono font-bold px-2 py-0.5 rounded flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-red-600" />
                        <span>Item Crítico (Risco de Autoextermínio)</span>
                      </span>
                    )}
                  </div>

                  <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    {scale.questions[currentStepIndex].text}
                  </h2>

                  {scale.questions[currentStepIndex].instruction && (
                    <p className="text-xs text-slate-500 italic bg-slate-50 p-2.5 rounded border border-slate-200">
                      <strong>Orientação clínica:</strong> {scale.questions[currentStepIndex].instruction}
                    </p>
                  )}
                </div>

                {/* Response Options (Neutral multiple-choice layout without dark boxes or point badges) */}
                <div className="space-y-2.5">
                  {scale.questions[currentStepIndex].options.map((opt) => {
                    const isSelected = answers[scale.questions[currentStepIndex].id] === opt.value;

                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() =>
                          handleSelectOption(scale.questions[currentStepIndex].id, opt.value)
                        }
                        className={`w-full p-3.5 sm:p-4 rounded-lg border text-left transition-all flex items-center justify-between gap-3 cursor-pointer group ${
                          isSelected
                            ? 'bg-teal-50/70 border-teal-600 text-teal-950 font-medium shadow-xs ring-1 ring-teal-600/30'
                            : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                              isSelected
                                ? 'border-teal-600 bg-white'
                                : 'border-slate-300 bg-white group-hover:border-slate-400'
                            }`}
                          >
                            {isSelected && <div className="w-2 h-2 rounded-full bg-teal-600" />}
                          </div>
                          <span className={`text-xs sm:text-sm leading-tight ${isSelected ? 'text-teal-950 font-bold' : 'text-slate-800'}`}>
                            {opt.label}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Bottom Step Navigation Controls */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <button
                    onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
                    disabled={currentStepIndex === 0}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Anterior</span>
                  </button>

                  <div className="text-xs font-mono text-slate-400">
                    {currentStepIndex + 1} / {scale.questions.length}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentStepIndex((prev) =>
                        Math.min(scale.questions.length - 1, prev + 1)
                      )
                    }
                    disabled={currentStepIndex === scale.questions.length - 1}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white disabled:opacity-30 disabled:cursor-not-allowed rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <span>Próximo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Sticky Clinical Result Panel (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-20">
            {/* Real-time Clinical Result Box */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-md space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-500">
                  Resultado em Tempo Real
                </span>
                <span className="font-mono text-xs font-bold text-[#0A3B74] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                  {scale.acronym}
                </span>
              </div>

              {/* Big Score Card */}
              <div className="text-center space-y-1 py-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="font-mono text-4xl sm:text-5xl font-black text-[#0A3B74] tracking-tight">
                  {computedResult.totalScore}
                  <span className="text-xl sm:text-2xl text-slate-400 font-normal">
                    {' '}/ {computedResult.maxScore}
                  </span>
                </div>
                <div className="text-xs font-mono font-semibold text-slate-500">
                  Pontos Totais
                </div>
              </div>

              {/* Severity Banner */}
              <div
                className={`p-3.5 rounded-md border text-center font-bold text-xs sm:text-sm ${getSeverityBadgeClass(
                  computedResult.severityLevel
                )}`}
              >
                {computedResult.classification}
              </div>

              {/* MEEM Dimensions Breakdown */}
              {scale.id === 'meem' && (
                <div className="space-y-2 text-xs bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                  <span className="font-mono text-[11px] uppercase font-bold text-[#0A3B74] block">
                    Desempenho por Dimensão Cognitiva:
                  </span>
                  <div className="space-y-1.5 font-sans">
                    {(() => {
                      const orientacaoTemporal = (answers['q1_ano'] ?? 0) + (answers['q1_semestre'] ?? 0) + (answers['q1_mes'] ?? 0) + (answers['q1_diasemana'] ?? 0) + (answers['q1_diames'] ?? 0);
                      const orientacaoEspacial = (answers['q2_estado'] ?? 0) + (answers['q2_cidade'] ?? 0) + (answers['q2_bairro'] ?? 0) + (answers['q2_local'] ?? 0) + (answers['q2_andar'] ?? 0);
                      const memoriaImediata = answers['q3_memoria'] ?? 0;
                      const atencaoCalculo = answers['q4_atencao'] ?? 0;
                      const evocacaoTardia = answers['q5_evocacao'] ?? 0;
                      const linguagem = (answers['q6_nomeacao'] ?? 0) + (answers['q7_repeticao'] ?? 0) + (answers['q8_comando'] ?? 0) + (answers['q9_leitura'] ?? 0) + (answers['q10_frase'] ?? 0);
                      const praxiaConstrutiva = answers['q11_desenho'] ?? 0;

                      const dims = [
                        { name: 'Orientação Temporal', score: orientacaoTemporal, max: 5 },
                        { name: 'Orientação Espacial', score: orientacaoEspacial, max: 5 },
                        { name: 'Memória Imediata (Registro)', score: memoriaImediata, max: 3 },
                        { name: 'Atenção e Cálculo', score: atencaoCalculo, max: 5 },
                        { name: 'Evocação Tardia', score: evocacaoTardia, max: 3 },
                        { name: 'Linguagem', score: linguagem, max: 8 },
                        { name: 'Praxia Construtiva', score: praxiaConstrutiva, max: 1 },
                      ];

                      return (
                        <div className="grid grid-cols-1 gap-1.5 pt-1">
                          {dims.map((d, i) => {
                            const isFull = d.score === d.max;
                            return (
                              <div key={i} className="flex items-center justify-between text-[11px] bg-white px-2 py-1 rounded border border-slate-200">
                                <span className="text-slate-700 font-medium">{d.name}</span>
                                <span className={`font-mono font-bold ${isFull ? 'text-emerald-700' : 'text-[#0A3B74]'}`}>
                                  {d.score}/{d.max} pts
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}

              {/* Critical Item Alert (e.g. Suicidal Ideation in PHQ-9) */}
              {hasCriticalItem && (
                <div className="bg-red-50 border border-red-300 text-red-950 p-3.5 rounded-md space-y-1 text-xs">
                  <div className="font-bold text-red-900 flex items-center gap-1.5 uppercase font-mono text-[11px]">
                    <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
                    <span>Alerta Crítico: Item 9 Positivo</span>
                  </div>
                  <p className="text-red-900/90 leading-relaxed text-[11px]">
                    O paciente pontuou positivamente para pensamentos de autoextermínio. Realize anamnese ativa de segurança e risco imediato.
                  </p>
                </div>
              )}

              {/* Clinical Next Steps Summary Box */}
              <div className="space-y-2 text-xs">
                <span className="font-mono text-[11px] uppercase font-bold text-slate-700 block">
                  Conduta Sugerida na APS:
                </span>
                <ul className="space-y-1.5 text-slate-700 bg-slate-50 p-3 rounded border border-slate-200 leading-relaxed">
                  {computedResult.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons (Export to SOAP & Copy) */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <button
                  onClick={handleExportToSoap}
                  className="w-full py-3 bg-[#0A3B74] hover:bg-[#07284F] text-white font-mono font-bold uppercase tracking-wider rounded text-xs flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
                >
                  <FileCheck className="w-4 h-4 text-[#38BDF8]" />
                  <span>{imported ? 'Importado com Sucesso!' : 'Copiar para Prontuário (SOAP)'}</span>
                </button>

                <button
                  onClick={handleCopyResult}
                  className="w-full py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-mono font-semibold uppercase tracking-wider rounded text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copiado!' : 'Copiar Texto Resumo'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: NEXT STEPS (Conduta detalhada) */}
      {activeTab === 'next_steps' && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6 shadow-xs">
          <div className="space-y-1">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-teal-600" />
              <span>Conduta Clínica e Manejo Escalonado — {scale.acronym}</span>
            </h2>
            <p className="text-xs text-slate-600">
              Diretrizes de manejo e estratificação baseadas em evidências científicas e protocolos da Atenção Primária / SUS.
            </p>
          </div>

          {/* Conduct Steps */}
          {scale.clinicalConductSteps && scale.clinicalConductSteps.length > 0 ? (
            <div className="space-y-3">
              <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-700">
                1. Estratificação de Risco & Intervenções Escalonadas
              </h3>
              <div className="space-y-2.5">
                {scale.clinicalConductSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-md border text-xs leading-relaxed space-y-1.5 transition-colors ${
                      step.badgeType === 'danger'
                        ? 'bg-red-50/70 border-red-200 text-red-950'
                        : step.badgeType === 'warning'
                        ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                        : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-bold font-mono text-[11px] text-slate-900">
                        {step.title}
                      </span>
                      {step.badge && (
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                            step.badgeType === 'danger'
                              ? 'bg-red-200/70 text-red-800'
                              : step.badgeType === 'warning'
                              ? 'bg-amber-200/70 text-amber-900'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {step.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-slate-700">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-md text-xs text-slate-700">
              Consulte as recomendações gerais calculadas na aba Resumo para as condutas prioritárias.
            </div>
          )}

          {/* Monitoring Goals */}
          {scale.monitoringGoals && scale.monitoringGoals.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-700">
                2. Metas Terapêuticas & Monitoramento Longitudinal
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {scale.monitoringGoals.map((goal, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 p-3.5 rounded-md space-y-1">
                    <span className="font-bold text-slate-900 font-mono text-[11px] block">
                      • {goal.title}
                    </span>
                    <p className="text-slate-700 leading-relaxed">{goal.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: EVIDENCE & PEARLS (Pérolas Clínicas) */}
      {activeTab === 'evidence' && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6 shadow-xs">
          <div className="space-y-1">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-600" />
              <span>Evidências & Pérolas Clínicas — {scale.acronym}</span>
            </h2>
            <p className="text-xs text-slate-600">
              Dicas práticas de aplicação para aprimorar a precisão diagnóstica e evitar erros comuns na Atenção Primária.
            </p>
          </div>

          {scale.clinicalPearls && scale.clinicalPearls.length > 0 ? (
            <div className="space-y-3 text-xs">
              {scale.clinicalPearls.map((pearl, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-md border space-y-1.5 leading-relaxed ${
                    pearl.type === 'pitfall'
                      ? 'bg-amber-50 border-amber-200 text-amber-950'
                      : pearl.type === 'evidence'
                      ? 'bg-blue-50 border-blue-200 text-blue-950'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold font-mono text-[11px] uppercase">
                    {pearl.type === 'pitfall' && <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />}
                    {pearl.type === 'evidence' && <BookOpen className="w-4 h-4 text-blue-700 shrink-0" />}
                    {pearl.type === 'pearl' && <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />}
                    <span>{pearl.title}</span>
                  </div>
                  <p className="text-slate-800">{pearl.text}</p>
                  {pearl.reference && (
                    <div className="text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-200/60">
                      <strong>Referência:</strong> {pearl.reference}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3 text-xs">
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-md space-y-1 text-blue-950">
                <span className="font-bold font-mono text-[11px] uppercase text-[#0A3B74] block">
                  💡 Acurácia Diagnóstica
                </span>
                <p className="leading-relaxed text-blue-900/90">
                  {scale.validationInfo || 'Instrumento padronizado para rastreio clínico na Atenção Primária.'}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: CREATOR & REFERENCES */}
      {activeTab === 'creator' && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4 shadow-xs text-xs">
          <div className="space-y-1">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-teal-600" />
              <span>Autores & Evidências de Validação Científica</span>
            </h2>
            <p className="text-xs text-slate-600">
              Fontes bibliográficas originais e estudos de normatização da escala no Brasil.
            </p>
          </div>

          <div className="space-y-3 text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-md border border-slate-200">
            <div>
              <span className="font-bold font-mono text-slate-900 block text-[11px] uppercase mb-0.5">
                Referência Original:
              </span>
              <p className="text-slate-800">{scale.referenceCitation || 'Estudo clínico de validação original.'}</p>
            </div>
            <div className="pt-2 border-t border-slate-200">
              <span className="font-bold font-mono text-slate-900 block text-[11px] uppercase mb-0.5">
                Validação e Adaptação Transcultural no Brasil:
              </span>
              <p className="text-slate-800">{scale.validationInfo || 'Validado no Brasil para a Atenção Primária à Saúde.'}</p>
            </div>
            <div className="pt-2 border-t border-slate-200">
              <span className="font-bold font-mono text-slate-900 block text-[11px] uppercase mb-0.5">
                Pontos de Corte e Critérios Normativos:
              </span>
              <p className="text-slate-800">{scale.cutoffInfo || 'Consulte os intervalos de pontuação.'}</p>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Modal */}
      {showWhatsappModal && (
        <WhatsappShareModal
          patientName={patientName}
          onClose={() => setShowWhatsappModal(false)}
          onOpenPatientSelfFill={() => {
            setShowWhatsappModal(false);
            setShowSelfFillModal(true);
          }}
          onSaveScaleResult={onSaveScaleResult}
        />
      )}

      {/* Patient Self Fill Modal */}
      {showSelfFillModal && (
        <PatientSelfFillModal
          scaleId={scale.id}
          patientName={patientName}
          onClose={() => setShowSelfFillModal(false)}
          onSaveResult={onSaveScaleResult}
        />
      )}
      {/* Clinical Disclaimer Footer */}
      <footer className="pt-4 pb-2 text-center">
        <p className="text-xs text-slate-400 font-mono tracking-wide">
          Escala ≠ diagnóstico · Cálculo ≠ conduta · Decisão permanece médica
        </p>
      </footer>
    </div>
  );
};
