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
  X,
} from 'lucide-react';

/**
 * Cleans score annotations (e.g. '(0)', '(1 pt)', '(3 pontos)') from option labels
 * to prevent inducing/biasing the patient during scale administration.
 */
export const cleanOptionLabel = (label: string): string => {
  if (!label) return '';
  return label.replace(/\s*\(\d+\s*(?:pts?|pontos?)?\)$/i, '').trim();
};

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
  const [patientAutoAppliedNotification, setPatientAutoAppliedNotification] = useState<{
    scaleAcronym: string;
    score: number;
    maxScore: number;
    classification: string;
    timestamp: string;
  } | null>(null);

  const handlePatientSelfFillComplete = (res: ScaleResult, rawAnswers?: Record<string, number>) => {
    if (rawAnswers && Object.keys(rawAnswers).length > 0) {
      setAnswers(rawAnswers);
    } else if (res.answersArray && res.answersArray.length > 0) {
      const recoveredAnswers: Record<string, number> = {};
      scale.questions.forEach((q, idx) => {
        if (res.answersArray && res.answersArray[idx] !== undefined) {
          recoveredAnswers[q.id] = res.answersArray[idx];
        }
      });
      setAnswers(recoveredAnswers);
    }

    const enrichedResult: ScaleResult = {
      ...res,
      scaleId: scale.id,
      scaleTitle: scale.title,
      isSelfAdministered: true,
      soapText: res.soapText || `${scale.acronym}: ${res.totalScore}/${res.maxScore} pts (${res.classification}) [Autoaplicação no PC/Tablet]`,
    };

    if (onSaveScaleResult) {
      onSaveScaleResult(enrichedResult);
    }

    const answersArr = enrichedResult.answersArray || scale.questions.map((q) => (rawAnswers ? rawAnswers[q.id] : 0) ?? 0);
    const soapEntry = `[Autoaplicação pelo Paciente no PC/Tablet - ${scale.acronym}] ${scale.title}: ${res.totalScore}/${res.maxScore} pts (${res.classification}) | Itens: [${answersArr.join(', ')}] | Registro eletrônico às ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    onImportToSoap(soapEntry, `Autoaplicação: ${scale.acronym}`);

    setPatientAutoAppliedNotification({
      scaleAcronym: scale.acronym,
      score: res.totalScore,
      maxScore: res.maxScore,
      classification: res.classification,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    });

    setShowSelfFillModal(false);
  };

  const scale: ScaleDefinition =
    ALL_SCALES.find((s) => s.id === selectedScaleId) || ALL_SCALES[0];

  // Reset answers when switching scales or when patient is reset
  useEffect(() => {
    setAnswers({});
    setCurrentStepIndex(0);
    setImported(false);
    setCopied(false);
  }, [selectedScaleId, patientName]);

  // Compute result in real time
  const computedResult: ScaleResult = React.useMemo(() => {
    const computed = scale.calculateResult(answers);
    const answersSummary = scale.questions.map((q) => {
      const val = answers[q.id];
      const matchedOpt = val !== undefined ? q.options.find((o) => o.value === val) : undefined;
      return {
        questionText: q.text,
        answerLabel: matchedOpt ? cleanOptionLabel(matchedOpt.label) : 'Não respondido',
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

    // Only save to clinical history when all questions are answered
    const isComplete = scale.questions.every((q) => updated[q.id] !== undefined);
    if (onSaveScaleResult && isComplete) {
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
      {/* Top Scale Selector & Header Editorial */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
        {/* Selector Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-600">
              Instrumento Clínico:
            </label>
            <select
              value={selectedScaleId}
              onChange={(e) => {
                const newId = e.target.value;
                setSelectedScaleId(newId);
                if (onSelectScaleId) onSelectScaleId(newId);
              }}
              className="bg-slate-50/80 border border-slate-200 rounded-md px-3 py-1.5 text-xs font-medium text-slate-800 focus:outline-hidden focus:border-teal-700 cursor-pointer"
            >
              {ALL_SCALES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.acronym} — {s.title} ({s.questions.length} itens)
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowWhatsappModal(true)}
              className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
              <span>Enviar WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={() => setShowSelfFillModal(true)}
              className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Abrir escala para o paciente responder neste computador ou tablet"
            >
              <Smartphone className="w-3.5 h-3.5 text-slate-500" />
              <span>Autoaplicação (PC / Tablet)</span>
            </button>
          </div>
        </div>

        {/* Scale Title & Editorial Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 pt-1">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
                {scale.acronym}
              </h1>
              {(scaleHistory.some((r) => r.scaleId === scale.id && r.isSelfAdministered) ||
                patientAutoAppliedNotification?.scaleAcronym === scale.acronym) && (
                <span className="text-emerald-700 text-xs font-medium flex items-center gap-1 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  <Check className="w-3 h-3" />
                  Autoaplicação registrada
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-slate-600 font-normal">
              {(() => {
                const map: Record<string, string> = {
                  'phq-9': 'Sintomas depressivos · 9 questões · Últimas 2 semanas',
                  'gad-7': 'Sintomas ansiosos · 7 questões · Últimas 2 semanas',
                  'audit': 'Padrão de uso de álcool · 10 questões · Últimos 12 meses',
                  'audit-c': 'Rastreio rápido de álcool · 3 questões · Últimos 12 meses',
                  'c-ssrs': 'Risco de suicídio · 6 questões · Triagem clínica',
                  'meem': 'Rastreio cognitivo · 11 tarefas · Avaliação no momento',
                  'mdq': 'Espectro bipolar · 15 itens · Histórico de vida',
                  'epds': 'Depressão pós-parto e gestacional · 10 questões · Últimos 7 dias',
                  'pc-ptsd-5': 'Estresse pós-traumático · 5 itens · Último mês',
                  'isi': 'Gravidade da insônia · 7 questões · Últimas 2 semanas',
                  'asrs': 'Rastreio de TDAH em adultos · 6 questões · Últimos 6 meses',
                  'gds-15': 'Depressão geriátrica · 15 questões · Última semana',
                  'cage': 'Rastreio de uso nocivo de álcool · 4 questões · Histórico',
                  'hama': 'Gravidade da ansiedade · 14 itens · Avaliação atual',
                  'hamd': 'Gravidade da depressão · 17 itens · Última semana',
                  'panss-6': 'Sintomas psicóticos breves · 6 itens · Última semana',
                  'ymrs': 'Sintomas de mania · 11 itens · Últimas 48 horas',
                };
                return map[scale.id] || `${scale.title} · ${scale.questions.length} itens · ~${scale.estimatedMinutes || 2} min`;
              })()}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('evidence')}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-teal-700 cursor-pointer transition-colors self-start sm:self-auto"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Ver evidências e validação</span>
          </button>
        </div>

        {/* Patient Autoapplied Clinical Banner */}
        {patientAutoAppliedNotification && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-950 p-4 rounded-xl flex items-start justify-between gap-3 shadow-xs animate-in fade-in duration-200">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-emerald-100 border border-emerald-200 rounded-lg text-emerald-800 shrink-0 mt-0.5">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-sm text-emerald-900">
                    Autoaplicação no PC/Tablet registrada no sistema com sucesso!
                  </span>
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-mono px-2 py-0.5 rounded">
                    {patientAutoAppliedNotification.timestamp}
                  </span>
                </div>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  O paciente preencheu a escala no dispositivo ({patientAutoAppliedNotification.scaleAcronym}: {patientAutoAppliedNotification.score}/{patientAutoAppliedNotification.maxScore} pts · {patientAutoAppliedNotification.classification}). As respostas foram carregadas automaticamente na tela e o registro foi incorporado ao prontuário SOAP da consulta.
                </p>
              </div>
            </div>
            <button
              onClick={() => setPatientAutoAppliedNotification(null)}
              className="text-emerald-700 hover:text-emerald-900 p-1.5 rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer shrink-0"
              title="Fechar aviso"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Tabs Navigation */}
        <div className="flex border-b border-slate-200 pt-1 gap-2 text-xs font-medium overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('calculator')}
            className={`py-3 px-3.5 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer shrink-0 min-h-[44px] ${
              activeTab === 'calculator'
                ? 'border-teal-700 text-teal-800 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            <span>Formulário</span>
          </button>

          <button
            onClick={() => setActiveTab('charts')}
            className={`py-3 px-3.5 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer shrink-0 min-h-[44px] ${
              activeTab === 'charts'
                ? 'border-teal-700 text-teal-800 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-teal-600" />
            <span>Evolução longitudinal</span>
          </button>

          <button
            onClick={() => setActiveTab('next_steps')}
            className={`py-3 px-3.5 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer shrink-0 min-h-[44px] ${
              activeTab === 'next_steps'
                ? 'border-teal-700 text-teal-800 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Orientações clínicas</span>
          </button>

          <button
            onClick={() => setActiveTab('evidence')}
            className={`py-3 px-3.5 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer shrink-0 min-h-[44px] ${
              activeTab === 'evidence'
                ? 'border-teal-700 text-teal-800 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Evidências</span>
          </button>

          <button
            onClick={() => setActiveTab('creator')}
            className={`py-3 px-3.5 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer shrink-0 min-h-[44px] ${
              activeTab === 'creator'
                ? 'border-teal-700 text-teal-800 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Info className="w-4 h-4" />
            <span>Autores & Referências</span>
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
                  <span className="font-mono text-xs font-medium text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                    Item {currentStepIndex + 1} de {scale.questions.length}
                  </span>
                  <span className="text-xs text-slate-500 font-normal hidden sm:inline">
                    {Math.round(((currentStepIndex + 1) / scale.questions.length) * 100)}% concluído
                  </span>
                </div>

                <button
                  onClick={handleReset}
                  className="text-slate-500 hover:text-slate-800 text-xs font-sans font-medium flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Limpar Respostas</span>
                </button>
              </div>

              {/* Smooth Progress Bar */}
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-teal-700 h-full transition-all duration-300 rounded-full"
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
                    <span className="text-xs font-semibold text-slate-600">
                      Questão {currentStepIndex + 1}
                    </span>
                    {scale.questions[currentStepIndex].id === 'q9' && scale.id === 'phq-9' && answers['q9'] !== undefined && answers['q9'] > 0 && (
                      <span className="bg-red-50 text-red-700 border border-red-200 text-xs font-medium px-2 py-0.5 rounded flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
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
                  {scale.questions[currentStepIndex].options.map((opt, optIdx) => {
                    const isSelected = answers[scale.questions[currentStepIndex].id] === opt.value;

                    return (
                      <button
                        key={`opt-${scale.questions[currentStepIndex].id}-${optIdx}-${opt.value}`}
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
                            {cleanOptionLabel(opt.label)}
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
            <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="font-sans text-xs font-semibold text-slate-700">
                  Resultado
                </span>
                <span className="text-xs font-medium text-teal-800 bg-teal-50 border border-teal-200/80 px-2 py-0.5 rounded">
                  {scale.acronym}
                </span>
              </div>

              {/* Score Display Card */}
              <div className="text-center space-y-1 py-4 bg-slate-50/80 rounded-lg border border-slate-200/80">
                {scale.questions.filter((q) => answers[q.id] !== undefined).length === 0 ? (
                  <>
                    <div className="font-mono text-3xl sm:text-4xl font-normal text-slate-400 tracking-tight">
                      —{' '}
                      <span className="text-sm font-normal text-slate-400">
                        / {computedResult.maxScore} pts
                      </span>
                    </div>
                    <div className="text-xs font-sans text-slate-500">
                      Aguardando início do preenchimento
                    </div>
                  </>
                ) : !scale.questions.every((q) => answers[q.id] !== undefined) ? (
                  <>
                    <div className="font-mono text-3xl sm:text-4xl font-semibold text-slate-700 tracking-tight">
                      {computedResult.totalScore}
                      <span className="text-sm text-slate-400 font-normal"> pts (provisório)</span>
                    </div>
                    <div className="text-xs font-sans text-slate-500">
                      Pontuação parcial · {scale.questions.filter((q) => answers[q.id] !== undefined).length} de {scale.questions.length} respondidas
                    </div>
                  </>
                ) : (
                  <>
                    <div className="font-mono text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight">
                      {computedResult.totalScore}
                      <span className="text-xl sm:text-2xl text-slate-400 font-normal">
                        {' '}
                        / {computedResult.maxScore} pts
                      </span>
                    </div>
                    <div className="text-xs font-sans font-medium text-slate-500">
                      Escore clínico total
                    </div>
                  </>
                )}
              </div>

              {/* Severity / Completion Status Banner */}
              {scale.questions.filter((q) => answers[q.id] !== undefined).length === 0 ? (
                <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 text-center text-xs space-y-0.5">
                  <span className="font-semibold text-slate-700 block">Ainda não respondido</span>
                  <span className="text-slate-500 block text-[11px]">
                    Selecione as opções dos itens para iniciar a avaliação.
                  </span>
                </div>
              ) : !scale.questions.every((q) => answers[q.id] !== undefined) ? (
                <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 text-center text-xs space-y-1">
                  <span className="font-semibold text-slate-700 block">Preenchimento em andamento</span>
                  <span className="text-[11px] text-slate-500 block leading-relaxed">
                    Pontuação e classificação definitiva retidas. Faltam {scale.questions.length - scale.questions.filter((q) => answers[q.id] !== undefined).length} {scale.questions.length - scale.questions.filter((q) => answers[q.id] !== undefined).length === 1 ? 'questão' : 'questões'} para o resultado final.
                  </span>
                </div>
              ) : (
                <div
                  className={`p-3.5 rounded-lg border text-center font-semibold text-xs sm:text-sm ${getSeverityBadgeClass(
                    computedResult.severityLevel
                  )}`}
                >
                  {computedResult.classification}
                </div>
              )}

              {/* MEEM Dimensions Breakdown */}
              {scale.id === 'meem' && (
                <div className="space-y-2 text-xs bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                  <span className="font-sans text-xs font-semibold text-slate-700 block">
                    Desempenho por dimensão cognitiva:
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
                              <div key={`dim-${i}`} className="flex items-center justify-between text-[11px] bg-white px-2 py-1 rounded border border-slate-200">
                                <span className="text-slate-700 font-medium">{d.name}</span>
                                <span className={`font-mono font-semibold ${isFull ? 'text-emerald-700' : 'text-slate-800'}`}>
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
                <div className="bg-red-50 border border-red-300 text-red-950 p-3.5 rounded-lg space-y-1 text-xs">
                  <div className="font-semibold text-red-900 flex items-center gap-1.5 text-xs">
                    <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
                    <span>Alerta Crítico: Item 9 Positivo</span>
                  </div>
                  <p className="text-red-900/90 leading-relaxed text-xs">
                    O paciente pontuou positivamente para pensamentos de autoextermínio. Realize anamnese ativa de segurança e risco imediato.
                  </p>
                </div>
              )}

              {/* Clinical Next Steps Summary Box */}
              <div className="space-y-2 text-xs">
                <span className="font-sans text-xs font-semibold text-slate-700 block">
                  Orientações clínicas
                </span>
                {scale.questions.every((q) => answers[q.id] !== undefined) ? (
                  <ul className="space-y-1.5 text-slate-700 bg-slate-50/80 p-3 rounded-lg border border-slate-200/80 leading-relaxed">
                    {computedResult.recommendations.map((rec, idx) => (
                      <li key={`rec-${idx}`} className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-teal-700 shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-3 bg-slate-50/70 border border-slate-200/70 rounded-lg text-slate-500 text-xs leading-relaxed">
                    {scale.questions.filter((q) => answers[q.id] !== undefined).length === 0
                      ? 'As orientações clínicas serão ativadas após a conclusão de todos os itens da escala.'
                      : `Aguardando conclusão de ${scale.questions.length - scale.questions.filter((q) => answers[q.id] !== undefined).length} ${scale.questions.length - scale.questions.filter((q) => answers[q.id] !== undefined).length === 1 ? 'item restante' : 'itens restantes'} para orientações clínicas.`}
                  </div>
                )}
              </div>

              {/* Action Buttons (Export to SOAP & Copy) */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleExportToSoap}
                  disabled={scale.questions.filter((q) => answers[q.id] !== undefined).length === 0}
                  className={`w-full py-2.5 font-sans font-medium rounded-lg text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                    scale.questions.every((q) => answers[q.id] !== undefined)
                      ? 'bg-teal-700 hover:bg-teal-800 text-white shadow-xs'
                      : scale.questions.filter((q) => answers[q.id] !== undefined).length > 0
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                      : 'bg-slate-50 text-slate-400 border border-slate-200 cursor-not-allowed opacity-60'
                  }`}
                  title={
                    scale.questions.every((q) => answers[q.id] !== undefined)
                      ? 'Copiar escala completa para o prontuário SOAP'
                      : 'Copiar registro parcial com aviso de incompletude para o prontuário SOAP'
                  }
                >
                  <FileCheck className={`w-4 h-4 ${scale.questions.every((q) => answers[q.id] !== undefined) ? 'text-teal-200' : 'text-slate-400'}`} />
                  <span>
                    {imported
                      ? 'Importado para o SOAP!'
                      : scale.questions.every((q) => answers[q.id] !== undefined)
                      ? 'Copiar para Prontuário (SOAP)'
                      : scale.questions.filter((q) => answers[q.id] !== undefined).length > 0
                      ? 'Copiar Registro Parcial para SOAP'
                      : 'Aguardando Respostas'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyResult}
                  disabled={scale.questions.filter((q) => answers[q.id] !== undefined).length === 0}
                  className="w-full py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-sans font-medium rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  <span>
                    {copied
                      ? 'Copiado!'
                      : scale.questions.every((q) => answers[q.id] !== undefined)
                      ? 'Copiar Texto Simples'
                      : 'Copiar Texto Parcial'}
                  </span>
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
              <span>Orientações clínicas e manejo — {scale.acronym}</span>
            </h2>
            <p className="text-xs text-slate-600">
              Diretrizes de manejo e estratificação baseadas em evidências científicas e protocolos da Atenção Primária / SUS.
            </p>
          </div>

          {/* Conduct Steps */}
          {scale.clinicalConductSteps && scale.clinicalConductSteps.length > 0 ? (
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-slate-700">
                1. Estratificação de risco e intervenções
              </h3>
              <div className="space-y-2.5">
                {scale.clinicalConductSteps.map((step, idx) => (
                  <div
                    key={`conduct-${idx}`}
                    className={`p-3.5 rounded-md border text-xs leading-relaxed space-y-1.5 transition-colors ${
                      step.badgeType === 'danger'
                        ? 'bg-red-50/70 border-red-200 text-red-950'
                        : step.badgeType === 'warning'
                        ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                        : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-semibold text-xs text-slate-900">
                        {step.title}
                      </span>
                      {step.badge && (
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-medium ${
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
              <h3 className="text-xs font-semibold text-slate-700">
                2. Metas terapêuticas e acompanhamento longitudinal
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {scale.monitoringGoals.map((goal, idx) => (
                  <div key={`goal-${idx}`} className="bg-slate-50 border border-slate-200 p-3.5 rounded-md space-y-1">
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
              <span>Evidências e validação — {scale.acronym}</span>
            </h2>
            <p className="text-xs text-slate-600">
              Metodologia, validação científica no Brasil e pontos de corte clínicos.
            </p>
          </div>

          {/* Scientific Overview & Validation */}
          <div className="bg-slate-50 border border-slate-200/90 rounded-lg p-4 space-y-2 text-xs">
            <div className="font-semibold text-slate-800 text-sm">
              {scale.title}
            </div>
            <p className="text-slate-600 leading-relaxed">
              {scale.description}
            </p>
            {scale.validationInfo && (
              <div className="pt-2 border-t border-slate-200/60 text-slate-600">
                <strong className="text-slate-700">Validação e acurácia:</strong> {scale.validationInfo}
              </div>
            )}
            {scale.cutoffInfo && (
              <div className="text-slate-600">
                <strong className="text-slate-700">Pontos de corte:</strong> {scale.cutoffInfo}
              </div>
            )}
          </div>

          {scale.clinicalPearls && scale.clinicalPearls.length > 0 ? (
            <div className="space-y-3 text-xs">
              {scale.clinicalPearls.map((pearl, idx) => (
                <div
                  key={`pearl-${idx}`}
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
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-md space-y-1 text-slate-800">
                <span className="font-semibold text-xs text-slate-800 block">
                  Acurácia Diagnóstica
                </span>
                <p className="leading-relaxed text-slate-600 text-xs">
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
          onSaveResult={handlePatientSelfFillComplete}
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
