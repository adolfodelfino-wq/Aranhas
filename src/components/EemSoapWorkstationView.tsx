import React, { useState, useEffect, useRef } from 'react';
import { EEM_DOMAINS } from '../data/eemData';
import { EemState, SoapState, PatientSession, ScaleResult } from '../types';
import { generateEemSummary, formatEemIntoObjective } from '../utils/eemFormatter';
import {
  Stethoscope,
  FileText,
  Copy,
  Check,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ClipboardList,
  AlertTriangle,
  FileCheck,
  Trash2,
  Plus,
  Share2,
  Edit3,
  BookOpen,
  Building2,
} from 'lucide-react';
import { PecExportModal } from './PecExportModal';

interface EemSoapWorkstationViewProps {
  soapState: SoapState;
  patient: PatientSession;
  eemState: EemState;
  scaleHistory: ScaleResult[];
  onUpdateSoap: (updated: SoapState) => void;
  onUpdateEem: (updated: EemState) => void;
  onNavigate: (view: any, options?: any) => void;
  onResetConsultation: () => void;
  onOpenEvidence?: () => void;
  focusSubjectiveTrigger?: number;
}

export const EemSoapWorkstationView: React.FC<EemSoapWorkstationViewProps> = ({
  soapState,
  patient,
  eemState,
  scaleHistory,
  onUpdateSoap,
  onUpdateEem,
  onNavigate,
  onResetConsultation,
  onOpenEvidence,
  focusSubjectiveTrigger,
}) => {
  // Ref for the single editable Subjective textarea
  const subjectiveInputRef = useRef<HTMLTextAreaElement>(null);

  // Local state for UI feedback
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [copiedFull, setCopiedFull] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [showPecModal, setShowPecModal] = useState(false);
  // Domains start collapsed by default
  const [collapsedDomains, setCollapsedDomains] = useState<Record<string, boolean>>({});
  const [eemCopied, setEemCopied] = useState(false);
  const [insertedScaleId, setInsertedScaleId] = useState<string | null>(null);
  const [eemInserted, setEemInserted] = useState(false);
  // Mobile responsive view switcher
  const [activeMobileView, setActiveMobileView] = useState<'consulta' | 'soap'>('consulta');

  // Auto-focus Subjective when triggered by "Iniciar nova consulta"
  useEffect(() => {
    if (focusSubjectiveTrigger) {
      const timer = setTimeout(() => {
        if (subjectiveInputRef.current) {
          subjectiveInputRef.current.focus();
          subjectiveInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [focusSubjectiveTrigger]);

  const handleFocusSubjective = () => {
    if (subjectiveInputRef.current) {
      subjectiveInputRef.current.focus();
      subjectiveInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const toggleDomainCollapse = (domainId: string) => {
    setCollapsedDomains((prev) => {
      const isCurrentlyOpen = prev[domainId] === true;
      return { ...prev, [domainId]: !isCurrentlyOpen };
    });
  };

  const toggleEemOption = (key: keyof EemState, optionId: string) => {
    const currentList = Array.isArray(eemState[key]) ? (eemState[key] as string[]) : [];
    const exists = currentList.includes(optionId);
    let newList: string[];

    if (exists) {
      newList = currentList.filter((id) => id !== optionId);
    } else {
      newList = [...currentList, optionId];

      if (key === 'aparencia') {
        if (optionId === 'higienizado') newList = newList.filter((id) => id !== 'desleixado');
        if (optionId === 'desleixado') newList = newList.filter((id) => id !== 'higienizado');
        if (optionId === 'vestuario_adequado') newList = newList.filter((id) => id !== 'vestuario_extravagante');
        if (optionId === 'vestuario_extravagante') newList = newList.filter((id) => id !== 'vestuario_adequado');
        if (optionId === 'aparente_idade') newList = newList.filter((id) => id !== 'aparente_envelhecido');
        if (optionId === 'aparente_envelhecido') newList = newList.filter((id) => id !== 'aparente_idade');
      }

      if (key === 'atitude') {
        const altered = ['desconfiado', 'hostil', 'inhibido', 'agita_psicomotora', 'seductor_teatral'];
        if (optionId === 'cooperativo') {
          newList = newList.filter((id) => !altered.includes(id));
        } else if (altered.includes(optionId)) {
          newList = newList.filter((id) => id !== 'cooperativo');
        }
      }

      if (key === 'fala') {
        const altered = ['fala_lentificada', 'fala_acelerada', 'fala_baixo_volume', 'fala_disartrica', 'mutismo'];
        if (optionId === 'fala_normal') {
          newList = newList.filter((id) => !altered.includes(id));
        } else if (altered.includes(optionId)) {
          newList = newList.filter((id) => id !== 'fala_normal');
        }
      }

      if (key === 'humor') {
        const altered = ['humor_deprimido', 'humor_ansioso', 'humor_irritavel', 'humor_expansivo', 'humor_embotado'];
        if (optionId === 'humor_eutimico') {
          newList = newList.filter((id) => !altered.includes(id));
        } else if (altered.includes(optionId)) {
          newList = newList.filter((id) => id !== 'humor_eutimico');
        }
      }

      if (key === 'afeto') {
        const altered = ['afeto_embotado', 'afeto_incongruente', 'afeto_labil', 'afeto_hipomodulado'];
        if (optionId === 'afeto_modulado') {
          newList = newList.filter((id) => !altered.includes(id));
        } else if (altered.includes(optionId)) {
          newList = newList.filter((id) => id !== 'afeto_modulado');
        }
      }

      if (key === 'sensopercepcao') {
        const altered = [
          'senso_alucinacao_auditiva',
          'senso_alucinacao_visual',
          'senso_ilusoes',
          'senso_despersonalizacao',
        ];
        if (optionId === 'senso_sem_alteracoes') {
          newList = newList.filter((id) => !altered.includes(id));
        } else if (altered.includes(optionId)) {
          newList = newList.filter((id) => id !== 'senso_sem_alteracoes');
        }
      }

      if (key === 'orientacao') {
        const altered = ['desorientado_tempo', 'desorientado_espaco', 'desorientado_auto'];
        if (optionId === 'orientado_global') {
          newList = newList.filter((id) => !altered.includes(id));
        } else if (altered.includes(optionId)) {
          newList = newList.filter((id) => id !== 'orientado_global');
        }
      }

      if (key === 'atencaoMemoria') {
        if (optionId === 'atencao_normoprosexica') {
          newList = newList.filter((id) => id !== 'atencao_hipoprosexia' && id !== 'atencao_hiperprosexia');
        }
        if (optionId === 'atencao_hipoprosexia' || optionId === 'atencao_hiperprosexia') {
          newList = newList.filter((id) => id !== 'atencao_normoprosexica');
        }
        if (optionId === 'memoria_preservada') {
          newList = newList.filter((id) => id !== 'memoria_hipomnesia_fixacao' && id !== 'memoria_hipomnesia_evocacao');
        }
        if (optionId === 'memoria_hipomnesia_fixacao' || optionId === 'memoria_hipomnesia_evocacao') {
          newList = newList.filter((id) => id !== 'memoria_preservada');
        }
      }

      if (key === 'insight') {
        newList = [optionId];
      }

      if (key === 'julgamento') {
        newList = [optionId];
      }
    }

    onUpdateEem({
      ...eemState,
      [key]: newList,
    });
  };

  const getDomainSummary = (domainId: string): string => {
    const domain = EEM_DOMAINS.find((d) => d.id === domainId);
    const key = domainId as keyof EemState;
    const values = Array.isArray(eemState[key]) ? (eemState[key] as string[]) : [];
    if (!domain || values.length === 0) return 'Não observado';
    const labels = values
      .map((valId) => domain.options.find((o) => o.id === valId)?.label)
      .filter(Boolean);
    return labels.join(', ');
  };

  const currentEemNarrative = generateEemSummary(eemState);

  const handleInsertEemToSoap = () => {
    const updatedObjective = formatEemIntoObjective(soapState.objective, currentEemNarrative);

    onUpdateSoap({
      ...soapState,
      objective: updatedObjective,
    });

    setEemInserted(true);
    setTimeout(() => setEemInserted(false), 2500);
  };

  const handleInsertScaleToSoap = (scaleRes: ScaleResult) => {
    const currentObjective = soapState.objective ? soapState.objective.trim() : '';
    const scaleLine = `• ${scaleRes.scaleTitle} (${scaleRes.date || 'Hoje'}): ${scaleRes.totalScore}/${scaleRes.maxScore} pts — ${scaleRes.classification}.`;

    if (currentObjective.includes(scaleRes.scaleTitle)) {
      setInsertedScaleId(scaleRes.id || scaleRes.scaleId);
      setTimeout(() => setInsertedScaleId(null), 2000);
      return;
    }

    const updatedObjective = currentObjective ? `${currentObjective}\n${scaleLine}` : scaleLine;

    onUpdateSoap({
      ...soapState,
      objective: updatedObjective,
    });

    setInsertedScaleId(scaleRes.id || scaleRes.scaleId);
    setTimeout(() => setInsertedScaleId(null), 2500);
  };

  const handleSoapChange = (field: keyof SoapState, value: string) => {
    onUpdateSoap({
      ...soapState,
      [field]: value,
    });
  };

  const handleCopySection = (text: string, sec: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedSection(sec);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleCopyFullSoap = () => {
    const full = `REGISTRO CLÍNICO SOAP - APS / MEDICINA DE FAMÍLIA
PACIENTE: ${patient.name} (${patient.age} anos, Prontuário: ${patient.prontuario || 'S/N'})
DATA: ${patient.date}

[S - SUBJETIVO]
${soapState.subjective || 'Sem anotações.'}

[O - OBJETIVO]
${soapState.objective || 'Sem anotações.'}

[A - AVALIAÇÃO]
${soapState.assessment || 'Sem anotações.'}

[P - PLANO]
${soapState.plan || 'Sem anotações.'}`;

    navigator.clipboard.writeText(full);
    setCopiedFull(true);
    setTimeout(() => setCopiedFull(false), 2500);
  };

  const handleExportConsultationSummary = () => {
    const summary = `RESUMO DE ATENDIMENTO CLÍNICO - APS
Paciente: ${patient.name} | Idade: ${patient.age} anos | Prontuário: ${patient.prontuario || 'S/N'}
Data: ${patient.date}

1. SÍNTESE CLÍNICA (SUBJETIVO):
${soapState.subjective || 'Sem anotações.'}

2. ACHADOS OBJETIVOS & ESCALAS:
${soapState.objective || 'Sem anotações.'}

3. IMPRESSÃO DIAGNÓSTICA & RISCO:
${soapState.assessment || 'Sem anotações.'}

4. PLANO TERAPÊUTICO & PACTUAÇÃO:
${soapState.plan || 'Sem anotações.'}

Nexus Clínico · Escala ≠ diagnóstico · Cálculo ≠ conduta · Decisão permanece médica`;

    navigator.clipboard.writeText(summary);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  const getSeverityBadgeClass = (severity?: string) => {
    switch (severity) {
      case 'severe':
      case 'high':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'moderate':
        return 'text-amber-800 bg-amber-50 border-amber-200';
      case 'low':
      default:
        return 'text-emerald-800 bg-emerald-50 border-emerald-200';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-6 px-4 space-y-6">
      {/* 1. CABEÇALHO CLÍNICO DISCRETO */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
            Consulta Clínica
          </h1>
          <p className="text-xs text-slate-500 font-normal mt-0.5">
            {patient.name} {patient.age ? `· ${patient.age} anos` : ''} {patient.prontuario ? `· Prontuário: ${patient.prontuario}` : ''}
          </p>
        </div>

        {/* Grupo de Ações Primárias e Secundárias */}
        <div className="flex items-center gap-2">
          {/* Assistente PEC (Secundário) */}
          <button
            type="button"
            onClick={() => setShowPecModal(true)}
            className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Assistente de cópia estruturada para o Prontuário Eletrônico do Cidadão (PEC / e-SUS APS)"
          >
            <Building2 className="w-3.5 h-3.5 text-teal-700" />
            <span>Assistente PEC</span>
          </button>

          {/* Copiar SOAP (Primário) */}
          <button
            type="button"
            onClick={handleCopyFullSoap}
            className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            title="Copiar SOAP estruturado completo"
          >
            {copiedFull ? <Check className="w-3.5 h-3.5 text-teal-200" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedFull ? 'SOAP Copiado' : 'Copiar SOAP'}</span>
          </button>

          {/* Limpar Consulta (Discreto) */}
          <button
            type="button"
            onClick={() => setShowClearModal(true)}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            title="Reiniciar consulta"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* SELETOR MOBILE: [ Consulta | SOAP ] (visível apenas em telas pequenas) */}
      <div className="lg:hidden flex border-b border-slate-200 gap-2">
        <button
          type="button"
          onClick={() => setActiveMobileView('consulta')}
          className={`flex-1 py-2 text-xs font-semibold text-center border-b-2 transition-colors ${
            activeMobileView === 'consulta'
              ? 'border-teal-700 text-teal-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Consulta (Subjetivo + EEM)
        </button>
        <button
          type="button"
          onClick={() => setActiveMobileView('soap')}
          className={`flex-1 py-2 text-xs font-semibold text-center border-b-2 transition-colors ${
            activeMobileView === 'soap'
              ? 'border-teal-700 text-teal-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Registro SOAP
        </button>
      </div>

      {/* 2. GRID PRINCIPAL: 2 REGIÕES (ESQUERDA ~58%, DIREITA ~42%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ==================================================================== */}
        {/* REGIÃO ESQUERDA: CONSULTA (lg:col-span-7) */}
        {/* ==================================================================== */}
        <div
          className={`lg:col-span-7 space-y-7 ${
            activeMobileView === 'soap' ? 'hidden lg:block' : 'block'
          }`}
        >
          {/* SUBJETIVO: PRIMEIRO ELEMENTO FOCAL */}
          <section className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="clinical-subjective-input"
                className="text-xs font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-1.5"
              >
                <span className="w-5 h-5 rounded bg-teal-100 text-teal-800 font-bold font-mono text-xs flex items-center justify-center shrink-0">S</span>
                <span>Subjetivo · Relato Espontâneo & Demanda</span>
              </label>
              {soapState.subjective.trim() && (
                <button
                  type="button"
                  onClick={() => handleSoapChange('subjective', '')}
                  className="text-xs text-slate-500 hover:text-red-600 transition-colors cursor-pointer px-2 py-0.5"
                >
                  Limpar
                </button>
              )}
            </div>

            <textarea
              ref={subjectiveInputRef}
              id="clinical-subjective-input"
              value={soapState.subjective}
              onChange={(e) => handleSoapChange('subjective', e.target.value)}
              placeholder="Descreva o motivo do contato, queixa principal, história clínica, relato espontâneo e expectativas do paciente..."
              rows={7}
              className="w-full bg-white text-slate-900 text-sm p-4 rounded-xl border border-slate-200/90 focus:border-teal-700 focus:outline-hidden leading-relaxed resize-y placeholder:text-slate-400 font-sans shadow-xs"
            />
          </section>

          {/* EXAME DO ESTADO MENTAL (EEM) */}
          <section className="space-y-4 pt-3 border-t border-slate-200/60">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Exame do Estado Mental (EEM)
                </h2>
                <span className="text-xs text-slate-500">
                  Abra apenas os domínios pertinentes para documentação
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  onUpdateEem({
                    aparencia: ['higienizado', 'vestuario_adequado', 'aparente_idade'],
                    aparenciaOutros: '',
                    atitude: ['cooperativo'],
                    atitudeOutros: '',
                    fala: ['fala_normal'],
                    falaOutros: '',
                    humor: ['humor_eutimico'],
                    humorOutros: '',
                    afeto: ['afeto_modulado'],
                    afetoOutros: '',
                    pensamentoCurso: ['curso_normal'],
                    pensamentoForma: ['forma_logico'],
                    pensamentoConteudo: [],
                    pensamentoOutros: '',
                    sensopercepcao: ['senso_sem_alteracoes'],
                    sensopercepcaoOutros: '',
                    orientacao: ['orientado_global'],
                    orientacaoOutros: '',
                    atencaoMemoria: ['atencao_normoprosexica', 'memoria_preservada'],
                    atencaoMemoriaOutros: '',
                    insight: ['insight_preservado'],
                    insightOutros: '',
                    julgamento: ['julgamento_preservado'],
                    julgamentoOutros: '',
                    observacoesLivres: '',
                  });
                }}
                className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer transition-colors px-3 py-1.5 rounded-md bg-white border border-slate-200/90 shadow-2xs font-medium"
                title="Preencher padrão eutímico"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                <span>Padrão Eutímico</span>
              </button>
            </div>

            {/* Domínios do EEM recolhidos por padrão com espaçamento aprimorado */}
            <div className="space-y-2">
              {EEM_DOMAINS.map((domain) => {
                const isExpanded = collapsedDomains[domain.id] === true;
                const stateKey = domain.id as keyof EemState;
                const selectedValues = Array.isArray(eemState[stateKey]) ? (eemState[stateKey] as string[]) : [];
                const currentFindingSummary = getDomainSummary(domain.id);
                const hasFindings = selectedValues.length > 0;

                return (
                  <div key={domain.id} className="border border-slate-200/80 rounded-lg overflow-hidden bg-white text-xs shadow-2xs">
                    <button
                      type="button"
                      onClick={() => toggleDomainCollapse(domain.id)}
                      className="w-full flex items-center justify-between p-3 hover:bg-slate-50/80 text-left transition-colors cursor-pointer gap-2"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-semibold text-slate-800 shrink-0 text-xs sm:text-sm">{domain.title}</span>
                        <span className="text-xs text-slate-500 truncate">
                          · {currentFindingSummary}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {hasFindings && (
                          <span className="text-[11px] font-mono font-medium bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded">
                            {selectedValues.length}
                          </span>
                        )}
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="p-3.5 bg-slate-50/60 flex flex-wrap gap-2 border-t border-slate-100">
                        {domain.options.map((opt) => {
                          const isSelected = selectedValues.includes(opt.id);
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => toggleEemOption(stateKey, opt.id)}
                              className={`px-3 py-1.5 rounded-md text-xs transition-colors cursor-pointer border ${
                                isSelected
                                  ? 'bg-teal-700 text-white border-teal-700 font-medium shadow-2xs'
                                  : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200/90'
                              }`}
                            >
                              {opt.label}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Narrativa Semiológica Gerada */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">
                  Síntese semiológica gerada
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(currentEemNarrative);
                      setEemCopied(true);
                      setTimeout(() => setEemCopied(false), 2000);
                    }}
                    className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 px-2.5 py-1 rounded bg-white border border-slate-200/80 cursor-pointer"
                  >
                    {eemCopied ? <Check className="w-3.5 h-3.5 text-teal-700" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                    <span>{eemCopied ? 'Copiado' : 'Copiar'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleInsertEemToSoap}
                    className="text-xs text-teal-800 hover:text-teal-950 font-medium flex items-center gap-1 px-2.5 py-1 rounded bg-teal-50 border border-teal-200/70 cursor-pointer"
                  >
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>{eemInserted ? 'Inserido no Objetivo!' : 'Inserir no Objetivo'}</span>
                  </button>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50/80 border border-slate-200/80 rounded-xl text-xs sm:text-sm text-slate-800 leading-relaxed font-sans whitespace-pre-wrap max-h-36 overflow-y-auto">
                {currentEemNarrative}
              </div>
            </div>
          </section>

          {/* INSTRUMENTOS APLICADOS NA CONSULTA */}
          <section className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Instrumentos da Consulta
              </h2>
              <button
                type="button"
                onClick={() => onNavigate('scales')}
                className="text-xs text-teal-700 hover:text-teal-900 font-medium flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Aplicar novo instrumento</span>
              </button>
            </div>

            {scaleHistory.length === 0 ? (
              <div className="p-3 bg-slate-50/70 border border-dashed border-slate-200 rounded-lg text-xs text-slate-500 flex items-center justify-between">
                <span>Nenhum instrumento aplicado nesta sessão.</span>
                <button
                  type="button"
                  onClick={() => onNavigate('scales', { scaleId: 'phq-9' })}
                  className="text-teal-700 font-medium hover:underline cursor-pointer"
                >
                  Abrir PHQ-9
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {scaleHistory.map((res, idx) => {
                  const isJustInserted = insertedScaleId === (res.id || res.scaleId);
                  const hasItem9Alert =
                    res.scaleId === 'phq-9' &&
                    ((res.answersArray && res.answersArray[8] > 0) ||
                      res.recommendations?.some((r) => r.includes('pergunta 9') || r.includes('autolesão')));

                  return (
                    <div
                      key={res.id ? `hist-${res.id}` : `hist-${res.scaleId}-${idx}`}
                      className="p-3 bg-white border border-slate-200/80 rounded-lg text-xs space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900">{res.scaleTitle}</span>
                          <span className="font-mono text-slate-500">
                            {res.totalScore}/{res.maxScore} pts
                          </span>
                        </div>
                        <span className={`px-2 py-0.5 rounded border text-[11px] font-medium ${getSeverityBadgeClass(res.severityLevel)}`}>
                          {res.classification}
                        </span>
                      </div>

                      {hasItem9Alert && (
                        <div className="p-2 rounded bg-red-50 border border-red-200 text-red-900 flex items-center gap-2">
                          <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                          <span>Item 9 positivo (risco de autoagressão). Realizar avaliação clínica direta.</span>
                        </div>
                      )}

                      <div className="flex justify-end pt-1">
                        <button
                          type="button"
                          onClick={() => handleInsertScaleToSoap(res)}
                          className="text-xs text-teal-700 hover:text-teal-900 font-medium flex items-center gap-1 cursor-pointer"
                        >
                          <FileCheck className="w-3.5 h-3.5" />
                          <span>{isJustInserted ? 'Inserido no Objetivo!' : 'Inserir no Objetivo'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* ==================================================================== */}
        {/* REGIÃO DIREITA: PRONTUÁRIO SOAP (lg:col-span-5) */}
        {/* ==================================================================== */}
        {/* ==================================================================== */}
        {/* REGIÃO DIREITA: PRONTUÁRIO SOAP (lg:col-span-5) */}
        {/* ==================================================================== */}
        <div
          className={`lg:col-span-5 bg-white border border-slate-200/90 rounded-xl p-5 sm:p-6 shadow-xs space-y-5 lg:sticky lg:top-20 ${
            activeMobileView === 'consulta' ? 'hidden lg:block' : 'block'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm sm:text-base font-semibold text-slate-900">
                Registro SOAP
              </h2>
              <span className="text-xs text-slate-500">
                Prontuário orientado por problemas
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleCopyFullSoap}
                className="text-xs text-teal-800 hover:text-teal-950 font-medium px-3 py-1.5 rounded-md bg-teal-50 border border-teal-200/70 flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                {copiedFull ? <Check className="w-3.5 h-3.5 text-teal-700" /> : <Copy className="w-3.5 h-3.5 text-teal-700" />}
                <span>{copiedFull ? 'Copiado' : 'Copiar SOAP'}</span>
              </button>
            </div>
          </div>

          {/* S — Subjetivo */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-semibold text-slate-800 flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-teal-100 text-teal-900 font-bold font-mono text-xs flex items-center justify-center shrink-0">
                  S
                </span>
                <span>Subjetivo</span>
              </span>
              <button
                type="button"
                onClick={() => handleCopySection(soapState.subjective, 'S')}
                className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer px-2 py-0.5"
              >
                {copiedSection === 'S' ? 'Copiado' : 'Copiar'}
              </button>
            </div>

            <div
              onClick={handleFocusSubjective}
              className="w-full bg-slate-50/70 hover:bg-slate-100/60 transition-colors text-slate-800 text-xs sm:text-sm p-3.5 rounded-lg border border-slate-200/80 cursor-pointer min-h-[64px] max-h-36 overflow-y-auto leading-relaxed"
              title="Clique para editar o Subjetivo no campo principal"
            >
              {soapState.subjective.trim() ? (
                <p className="whitespace-pre-wrap">{soapState.subjective}</p>
              ) : (
                <p className="italic text-slate-400">
                  Anotações da queixa e relato clínico espontâneo...
                </p>
              )}
            </div>
          </div>

          {/* O — Objetivo */}
          <div className="space-y-1.5 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label htmlFor="soap-o-input" className="text-xs sm:text-sm font-semibold text-slate-800 flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-sky-100 text-sky-900 font-bold font-mono text-xs flex items-center justify-center shrink-0">
                  O
                </span>
                <span>Objetivo (EEM & Escalas)</span>
              </label>
              <button
                type="button"
                onClick={() => handleCopySection(soapState.objective, 'O')}
                className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer px-2 py-0.5"
              >
                {copiedSection === 'O' ? 'Copiado' : 'Copiar'}
              </button>
            </div>
            <textarea
              id="soap-o-input"
              value={soapState.objective}
              onChange={(e) => handleSoapChange('objective', e.target.value)}
              placeholder="Achados do exame físico, EEM, escores numéricos..."
              rows={4}
              className="w-full bg-slate-50/50 focus:bg-white text-slate-900 text-xs sm:text-sm p-3.5 rounded-lg border border-slate-200/80 focus:border-teal-700 focus:outline-hidden leading-relaxed resize-y font-sans shadow-2xs"
            />
          </div>

          {/* A — Avaliação */}
          <div className="space-y-1.5 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label htmlFor="soap-a-input" className="text-xs sm:text-sm font-semibold text-slate-800 flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-amber-100 text-amber-950 font-bold font-mono text-xs flex items-center justify-center shrink-0">
                  A
                </span>
                <span>Avaliação & Diagnósticos</span>
              </label>
              <button
                type="button"
                onClick={() => handleCopySection(soapState.assessment, 'A')}
                className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer px-2 py-0.5"
              >
                {copiedSection === 'A' ? 'Copiado' : 'Copiar'}
              </button>
            </div>
            <textarea
              id="soap-a-input"
              value={soapState.assessment}
              onChange={(e) => handleSoapChange('assessment', e.target.value)}
              placeholder="Impressão diagnóstica, estratificação de gravidade e hipóteses sob julgamento médico..."
              rows={3}
              className="w-full bg-slate-50/50 focus:bg-white text-slate-900 text-xs sm:text-sm p-3.5 rounded-lg border border-slate-200/80 focus:border-teal-700 focus:outline-hidden leading-relaxed resize-y font-sans shadow-2xs"
            />
          </div>

          {/* P — Plano */}
          <div className="space-y-1.5 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label htmlFor="soap-p-input" className="text-xs sm:text-sm font-semibold text-slate-800 flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-950 font-bold font-mono text-xs flex items-center justify-center shrink-0">
                  P
                </span>
                <span>Plano & Conduta</span>
              </label>
              <button
                type="button"
                onClick={() => handleCopySection(soapState.plan, 'P')}
                className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer px-2 py-0.5"
              >
                {copiedSection === 'P' ? 'Copiado' : 'Copiar'}
              </button>
            </div>
            <textarea
              id="soap-p-input"
              value={soapState.plan}
              onChange={(e) => handleSoapChange('plan', e.target.value)}
              placeholder="Conduta clínica, plano de desmame/ajuste, orientações não farmacológicas e retorno..."
              rows={4}
              className="w-full bg-slate-50/50 focus:bg-white text-slate-900 text-xs sm:text-sm p-3.5 rounded-lg border border-slate-200/80 focus:border-teal-700 focus:outline-hidden leading-relaxed resize-y font-sans shadow-2xs"
            />
          </div>

          <div className="pt-2 text-center border-t border-slate-100">
            <span className="text-[11px] text-slate-500 leading-tight">
              Nexus Clínico · Escala ≠ diagnóstico · Decisão permanece médica
            </span>
          </div>
        </div>
      </div>

      {/* MODAL DE CONFIRMAÇÃO DE LIMPEZA */}
      {showClearModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-xl p-6 w-full max-w-sm shadow-xl space-y-4">
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-slate-900">
                Limpar toda a consulta?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Esta ação redefinirá o Subjetivo, o Exame do Estado Mental e os campos do SOAP desta sessão.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowClearModal(false)}
                className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 rounded-md text-xs font-medium border border-slate-200 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  onResetConsultation();
                  setShowClearModal(false);
                }}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs font-medium transition-colors cursor-pointer"
              >
                Limpar consulta
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assistente de cópia para PEC (e-SUS APS) */}
      <PecExportModal
        isOpen={showPecModal}
        onClose={() => setShowPecModal(false)}
        soapState={soapState}
        patient={patient}
      />
    </div>
  );
};
