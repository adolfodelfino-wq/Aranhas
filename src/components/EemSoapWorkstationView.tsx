import React, { useState, useEffect, useRef } from 'react';
import { EEM_DOMAINS } from '../data/eemData';
import { EemState, SoapState, PatientSession, ScaleResult } from '../types';
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
} from 'lucide-react';

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
  const [collapsedDomains, setCollapsedDomains] = useState<Record<string, boolean>>({});
  const [eemCopied, setEemCopied] = useState(false);
  const [insertedScaleId, setInsertedScaleId] = useState<string | null>(null);
  const [eemInserted, setEemInserted] = useState(false);

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

  // Direct focus to the clinical Subjective input
  const handleFocusSubjective = () => {
    if (subjectiveInputRef.current) {
      subjectiveInputRef.current.focus();
      subjectiveInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Toggle domain accordion
  const toggleDomainCollapse = (domainId: string) => {
    setCollapsedDomains((prev) => ({ ...prev, [domainId]: !prev[domainId] }));
  };

  // EEM mutual exclusions and option toggle
  const toggleEemOption = (key: keyof EemState, optionId: string) => {
    const currentList = Array.isArray(eemState[key]) ? (eemState[key] as string[]) : [];
    const exists = currentList.includes(optionId);
    let newList: string[];

    if (exists) {
      newList = currentList.filter((id) => id !== optionId);
    } else {
      newList = [...currentList, optionId];

      // Mutually exclusive clinical options
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
          if (optionId === 'fala_lentificada') newList = newList.filter((id) => id !== 'fala_acelerada');
          if (optionId === 'fala_acelerada') newList = newList.filter((id) => id !== 'fala_lentificada');
        }
      }

      if (key === 'humor') {
        const altered = ['distimico', 'ansioso', 'euforico', 'disforico', 'apatico'];
        if (optionId === 'eutimico') {
          newList = newList.filter((id) => !altered.includes(id));
        } else if (altered.includes(optionId)) {
          newList = newList.filter((id) => id !== 'eutimico');
        }
      }

      if (key === 'afeto') {
        const altered = ['embotado', 'labil', 'incongruente', 'hipomodulado'];
        if (optionId === 'normoemotivo') {
          newList = newList.filter((id) => !altered.includes(id));
        } else if (altered.includes(optionId)) {
          newList = newList.filter((id) => id !== 'normoemotivo');
        }
      }

      if (key === 'pensamentoCurso') {
        const altered = ['curso_bradipsiquico', 'curso_taquipsiquico', 'curso_bloqueio'];
        if (optionId === 'curso_normopsiquico') {
          newList = newList.filter((id) => !altered.includes(id));
        } else if (altered.includes(optionId)) {
          newList = newList.filter((id) => id !== 'curso_normopsiquico');
          if (optionId === 'curso_bradipsiquico') newList = newList.filter((id) => id !== 'curso_taquipsiquico');
          if (optionId === 'curso_taquipsiquico') newList = newList.filter((id) => id !== 'curso_bradipsiquico');
        }
      }

      if (key === 'pensamentoForma') {
        const altered = ['forma_circunstancial', 'forma_tangencial', 'forma_fuga_ideias', 'forma_frouxidao'];
        if (optionId === 'forma_coerente') {
          newList = newList.filter((id) => !altered.includes(id));
        } else if (altered.includes(optionId)) {
          newList = newList.filter((id) => id !== 'forma_coerente');
        }
      }

      if (key === 'pensamentoConteudo') {
        const altered = [
          'conteudo_ruminacoes',
          'conteudo_ideias_obsessivas',
          'conteudo_ideacao_suicida',
          'conteudo_delirio_perseguitorio',
          'conteudo_delirio_grandeza',
          'conteudo_delirio_ruina',
        ];
        if (optionId === 'conteudo_sem_alteracoes') {
          newList = newList.filter((id) => !altered.includes(id));
        } else if (altered.includes(optionId)) {
          newList = newList.filter((id) => id !== 'conteudo_sem_alteracoes');
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
        if (optionId === 'atencao_normoprosexica') newList = newList.filter((id) => id !== 'hipoprosexico');
        if (optionId === 'hipoprosexico') newList = newList.filter((id) => id !== 'atencao_normoprosexica');
        if (optionId === 'memoria_preservada') newList = newList.filter((id) => id !== 'deficit_memoria_recente' && id !== 'deficit_memoria_remota');
        if (optionId === 'deficit_memoria_recente' || optionId === 'deficit_memoria_remota') {
          newList = newList.filter((id) => id !== 'memoria_preservada');
        }
      }

      if (key === 'insight') {
        if (optionId === 'insight_preservado') newList = [optionId];
        if (optionId === 'insight_parcial' || optionId === 'insight_ausente') newList = [optionId];
      }

      if (key === 'julgamento') {
        if (optionId === 'julgamento_preservado') newList = [optionId];
        if (optionId === 'julgamento_prejudicado') newList = [optionId];
      }
    }

    onUpdateEem({
      ...eemState,
      [key]: newList,
    });
  };

  // Helper to get compact summary of current findings for a domain
  const getDomainSummary = (domainId: string): string => {
    const domain = EEM_DOMAINS.find((d) => d.id === domainId);
    const key = domainId as keyof EemState;
    const values = Array.isArray(eemState[key]) ? (eemState[key] as string[]) : [];
    if (!domain || values.length === 0) return 'Não registrado';
    const labels = values
      .map((id) => domain.options.find((o) => o.id === id)?.label)
      .filter(Boolean) as string[];
    return labels.join(', ');
  };

  // Generate technical EEM narrative
  const generateEemNarrative = (): string => {
    const parts: string[] = [];

    const getLabels = (domainId: string, list?: string[]) => {
      const domain = EEM_DOMAINS.find((d) => d.id === domainId);
      if (!domain || !Array.isArray(list)) return [];
      return list
        .map((id) => domain.options.find((o) => o.id === id)?.label)
        .filter(Boolean) as string[];
    };

    const aparencia = getLabels('aparencia', eemState.aparencia);
    if (aparencia.length > 0) parts.push(`Aparência: ${aparencia.join(', ').toLowerCase()}`);

    const atitude = getLabels('atitude', eemState.atitude);
    if (atitude.length > 0) parts.push(`Atitude: ${atitude.join(', ').toLowerCase()}`);

    const fala = getLabels('fala', eemState.fala);
    if (fala.length > 0) parts.push(`Fala: ${fala.join(', ').toLowerCase()}`);

    const humor = getLabels('humor', eemState.humor);
    if (humor.length > 0) parts.push(`Humor: ${humor.join(', ').toLowerCase()}`);

    const afeto = getLabels('afeto', eemState.afeto);
    if (afeto.length > 0) parts.push(`Afeto: ${afeto.join(', ').toLowerCase()}`);

    const pCurso = getLabels('pensamentoCurso', eemState.pensamentoCurso);
    const pForma = getLabels('pensamentoForma', eemState.pensamentoForma);
    const pConteudo = getLabels('pensamentoConteudo', eemState.pensamentoConteudo);
    const pensParts = [...pCurso, ...pForma, ...pConteudo];
    if (pensParts.length > 0) parts.push(`Pensamento: ${pensParts.join(', ').toLowerCase()}`);

    const senso = getLabels('sensopercepcao', eemState.sensopercepcao);
    if (senso.length > 0) parts.push(`Sensopercepção: ${senso.join(', ').toLowerCase()}`);

    const orient = getLabels('orientacao', eemState.orientacao);
    if (orient.length > 0) parts.push(`Orientação: ${orient.join(', ').toLowerCase()}`);

    const atencaoMem = getLabels('atencaoMemoria', eemState.atencaoMemoria);
    if (atencaoMem.length > 0) parts.push(`Atenção/Memória: ${atencaoMem.join(', ').toLowerCase()}`);

    const insight = getLabels('insight', eemState.insight);
    if (insight.length > 0) parts.push(`Insight: ${insight.join(', ').toLowerCase()}`);

    const julgamento = getLabels('julgamento', eemState.julgamento);
    if (julgamento.length > 0) parts.push(`Julgamento: ${julgamento.join(', ').toLowerCase()}`);

    if (parts.length === 0) return 'Exame do Estado Mental sem achados registrados.';
    return `EEM: ${parts.join('; ')}.`;
  };

  const currentEemNarrative = generateEemNarrative();

  // Insert EEM into SOAP Objective
  const handleInsertEemToSoap = () => {
    const separator = soapState.objective.trim() ? '\n\n' : '';
    // Avoid duplicate EEM header if already there
    const updatedObjective = soapState.objective.includes('EEM:')
      ? soapState.objective.replace(/EEM:[\s\S]*?\./, currentEemNarrative)
      : `${soapState.objective}${separator}${currentEemNarrative}`;

    onUpdateSoap({
      ...soapState,
      objective: updatedObjective,
      importedItems: [
        ...soapState.importedItems.filter((i) => i.title !== 'Exame do Estado Mental'),
        {
          title: 'Exame do Estado Mental',
          content: currentEemNarrative,
          targetSection: 'O',
        },
      ],
    });

    setEemInserted(true);
    setTimeout(() => setEemInserted(false), 2000);
  };

  // Insert Scale result into SOAP Objective
  const handleInsertScaleToSoap = (result: ScaleResult) => {
    const textToInsert = result.soapText || `${result.scaleTitle}: ${result.totalScore}/${result.maxScore} (${result.classification})`;
    const separator = soapState.objective.trim() ? '\n\n' : '';

    onUpdateSoap({
      ...soapState,
      objective: `${soapState.objective}${separator}${textToInsert}`,
      importedItems: [
        ...soapState.importedItems.filter((i) => i.title !== result.scaleTitle),
        {
          title: result.scaleTitle,
          content: textToInsert,
          targetSection: 'O',
        },
      ],
    });

    setInsertedScaleId(result.id || result.scaleId);
    setTimeout(() => setInsertedScaleId(null), 2000);
  };

  // Text changes in SOAP fields
  const handleSoapChange = (field: keyof SoapState, val: string) => {
    onUpdateSoap({
      ...soapState,
      [field]: val,
    });
  };

  // Copy individual section
  const handleCopySection = (text: string, sec: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedSection(sec);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  // Copy Full SOAP
  const handleCopyFullSoap = () => {
    const full = `REGISTRO CLÍNICO SOAP - APS / MEDICINA DE FAMÍLIA
PACIENTE: ${patient.name} (${patient.age} anos, Prontuário: ${patient.prontuario})
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

  // Export consultation summary for referral / summary note
  const handleExportConsultationSummary = () => {
    const summary = `RESUMO DE ATENDIMENTO CLÍNICO - APS
Paciente: ${patient.name} | Idade: ${patient.age} anos | Prontuário: ${patient.prontuario}
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

  // Severity color helper
  const getSeverityBadgeClass = (severity?: string) => {
    switch (severity) {
      case 'severe':
      case 'high':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'moderate':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'low':
      default:
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    }
  };

  return (
    <div className="w-full min-w-0 max-w-7xl mx-auto space-y-5 py-2 font-sans">
      {/* HEADER DA ESTAÇÃO DE TRABALHO */}
      <header aria-label="Estação de trabalho EEM e SOAP" className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded uppercase tracking-wider border border-teal-200">
                Workstation Clínica Unificada
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {patient.name} • {patient.age} anos • {patient.prontuario}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0A2540] tracking-tight flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-teal-600" />
              <span>EEM & Prontuário SOAP</span>
            </h1>
            <p className="text-xs text-slate-600 max-w-2xl">
              Integração semiológica entre o Exame do Estado Mental, instrumentos aplicados na consulta e registro estruturado em quatro eixos.
            </p>
          </div>

          {/* Botões de Ação no Topo */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={handleExportConsultationSummary}
              className="px-3.5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs min-h-[40px]"
              title="Exportar resumo formatado do atendimento para encaminhamento ou contrarreferência"
            >
              {copiedSummary ? <Check className="w-3.5 h-3.5 text-teal-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedSummary ? 'Resumo Copiado!' : 'Exportar resumo do atendimento'}</span>
            </button>

            <button
              onClick={handleCopyFullSoap}
              className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-xs min-h-[40px]"
              title="Copiar SOAP estruturado completo para a área de transferência"
            >
              {copiedFull ? <Check className="w-3.5 h-3.5 text-teal-200" /> : <Copy className="w-3.5 h-3.5 text-teal-200" />}
              <span>{copiedFull ? 'SOAP Copiado!' : 'Copiar SOAP completo'}</span>
            </button>

            <button
              onClick={() => setShowClearModal(true)}
              className="p-2.5 bg-white hover:bg-red-50 text-slate-400 hover:text-red-600 border border-slate-200 rounded-lg transition-colors cursor-pointer min-h-[40px]"
              title="Limpar toda a consulta e reiniciar"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* WORKSTATION GRID: 3 REGIÕES FUNCIONAIS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ==================================================================== */}
        {/* REGIÃO ESQUERDA / CENTRAL: ÁREA CLÍNICA PRINCIPAL (lg:col-span-5) */}
        {/* ==================================================================== */}
        <div className="lg:col-span-5 space-y-5">
          {/* TOPO: S — SUBJETIVO (NARRATIVA CLÍNICA LIVRE) */}
          <section
            aria-labelledby="bloco-subjetivo-title"
            className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-teal-50 text-teal-800 border border-teal-200 font-mono text-xs flex items-center justify-center font-bold">
                  S
                </span>
                <div>
                  <h2 id="bloco-subjetivo-title" className="text-sm font-bold text-[#0A2540] flex items-center gap-2">
                    <span>S — Subjetivo</span>
                    <span className="text-[10px] font-mono uppercase bg-teal-50 text-teal-700 border border-teal-200 px-1.5 py-0.5 rounded font-semibold">
                      Narrativa clínica livre
                    </span>
                  </h2>
                </div>
              </div>

              {soapState.subjective.trim() && (
                <button
                  type="button"
                  onClick={() => handleSoapChange('subjective', '')}
                  className="text-[10px] font-mono text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                  title="Limpar campo subjetivo"
                >
                  Limpar
                </button>
              )}
            </div>

            {/* Campo amplo e completamente livre para narrativa clínica */}
            <div className="space-y-1.5">
              <textarea
                ref={subjectiveInputRef}
                id="clinical-subjective-input"
                value={soapState.subjective}
                onChange={(e) => handleSoapChange('subjective', e.target.value)}
                placeholder="Narrativa clínica livre: queixa principal, história da doença atual (HDA), relato espontâneo do paciente, contexto psicossocial e familiar, história pregressa relevante, expectativas..."
                rows={7}
                className="w-full bg-slate-50 focus:bg-white text-slate-800 text-xs sm:text-sm p-3.5 rounded-lg border border-slate-200 focus:border-teal-600 outline-none leading-relaxed resize-y transition-all placeholder:text-slate-400 font-sans"
              />
              <p className="text-[11px] text-slate-500 font-sans leading-snug">
                Narrativa clínica livre. O relato espontâneo do paciente e a escuta clínica orientam a consulta. Instrumentos e exames são acionados sob demanda.
              </p>
            </div>
          </section>

          {/* ABAIXO DO SUBJETIVO: EXAME DO ESTADO MENTAL (EEM) */}
          <section
            aria-labelledby="bloco-eem-title"
            className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-slate-100 text-[#0A2540] rounded-md">
                  <Stethoscope className="w-4 h-4 text-teal-700" />
                </span>
                <div>
                  <h2 id="bloco-eem-title" className="text-sm font-bold text-[#0A2540]">
                    Exame do Estado Mental (EEM)
                  </h2>
                  <span className="text-[11px] text-slate-500">Linhas semiológicas compactas com achados</span>
                </div>
              </div>

              <button
                onClick={() => {
                  onUpdateEem({
                    aparencia: ['higienizado', 'vestuario_adequado', 'aparente_idade'],
                    aparenciaOutros: '',
                    atitude: ['cooperativo'],
                    atitudeOutros: '',
                    fala: ['fala_normal'],
                    falaOutros: '',
                    humor: ['eutimico'],
                    humorOutros: '',
                    afeto: ['normoemotivo'],
                    afetoOutros: '',
                    pensamentoCurso: ['curso_normopsiquico'],
                    pensamentoForma: ['forma_coerente'],
                    pensamentoConteudo: ['conteudo_sem_alteracoes'],
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
                className="text-[11px] font-mono font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer transition-colors px-2 py-1 rounded bg-slate-50 hover:bg-slate-100 border border-slate-200"
                title="Restaurar exame padrão eutímico"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Eutímico</span>
              </button>
            </div>

            {/* Linhas / Accordions compactos de cada domínio do EEM */}
            <div className="space-y-2 max-h-[440px] overflow-y-auto pr-1">
              {EEM_DOMAINS.map((domain) => {
                const isCollapsed = collapsedDomains[domain.id];
                const stateKey = domain.id as keyof EemState;
                const selectedValues = Array.isArray(eemState[stateKey]) ? (eemState[stateKey] as string[]) : [];
                const currentFindingSummary = getDomainSummary(domain.id);
                const hasFindings = selectedValues.length > 0;

                return (
                  <div key={domain.id} className="border border-slate-200 rounded-lg overflow-hidden text-xs">
                    <button
                      type="button"
                      onClick={() => toggleDomainCollapse(domain.id)}
                      className="w-full flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100/70 text-left transition-colors cursor-pointer gap-2"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-semibold text-slate-800 shrink-0">{domain.title}</span>
                        <span className="text-[11px] text-slate-500 truncate font-sans">
                          • {currentFindingSummary}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {hasFindings && (
                          <span className="text-[10px] font-mono font-bold bg-teal-50 text-teal-700 border border-teal-200 px-1.5 py-0.2 rounded">
                            {selectedValues.length}
                          </span>
                        )}
                        {isCollapsed ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronUp className="w-3.5 h-3.5 text-slate-400" />}
                      </div>
                    </button>

                    {!isCollapsed && (
                      <div className="p-2.5 bg-white flex flex-wrap gap-1.5 border-t border-slate-100">
                        {domain.options.map((opt) => {
                          const isSelected = selectedValues.includes(opt.id);
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => toggleEemOption(stateKey, opt.id)}
                              className={`px-2 py-1 rounded text-[11px] font-medium transition-all cursor-pointer border ${
                                isSelected
                                  ? 'bg-teal-50 text-teal-900 border-teal-600 font-semibold shadow-xs'
                                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
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

            {/* Texto Narrativo em Tempo Real */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                  Narrativa Semiológica Gerada:
                </span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(currentEemNarrative);
                    setEemCopied(true);
                    setTimeout(() => setEemCopied(false), 2000);
                  }}
                  className="text-[11px] font-mono text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                >
                  {eemCopied ? <Check className="w-3 h-3 text-teal-600" /> : <Copy className="w-3 h-3" />}
                  <span>{eemCopied ? 'Copiado' : 'Copiar EEM'}</span>
                </button>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 leading-relaxed font-sans min-h-[65px]">
                {currentEemNarrative}
              </div>

              <button
                type="button"
                onClick={handleInsertEemToSoap}
                className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                <FileCheck className="w-3.5 h-3.5 text-teal-200" />
                <span>{eemInserted ? 'Inserido no Objetivo!' : 'Inserir EEM no Objetivo (O)'}</span>
              </button>
            </div>
          </section>
        </div>

        {/* ==================================================================== */}
        {/* REGIÃO INTERMEDIÁRIA: RESULTADOS DA CONSULTA (lg:col-span-3) */}
        {/* ==================================================================== */}
        <section
          aria-labelledby="bloco-resultados-title"
          className="lg:col-span-3 bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-4"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-slate-100 text-[#0A2540] rounded-md">
                <ClipboardList className="w-4 h-4 text-teal-700" />
              </span>
              <div>
                <h2 id="bloco-resultados-title" className="text-sm font-bold text-[#0A2540]">
                  Resultados da consulta
                </h2>
                <span className="text-[11px] text-slate-500">Utilizados nesta sessão</span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('scales')}
              className="text-[11px] font-mono font-bold text-teal-700 hover:text-teal-800 flex items-center gap-0.5 cursor-pointer"
              title="Abrir catálogo de escalas"
            >
              <Plus className="w-3 h-3" />
              <span>Nova</span>
            </button>
          </div>

          {scaleHistory.length === 0 ? (
            <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-lg text-center space-y-2.5">
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                Nenhum instrumento aplicado nesta sessão.
              </p>
              <p className="text-[11px] text-slate-500 leading-snug">
                Instrumentos e calculadoras são recursos sob demanda. Use os atalhos abaixo se houver indicação clínica:
              </p>
              <div className="flex flex-col gap-1.5 pt-1">
                <button
                  onClick={() => onNavigate('scales', { scaleId: 'phq-9' })}
                  className="px-2.5 py-1.5 bg-white border border-slate-200 hover:border-teal-600 rounded text-xs font-medium text-slate-700 hover:text-slate-900 transition-colors text-left flex items-center justify-between"
                >
                  <span>• PHQ-9 (Depressão)</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                </button>
                <button
                  onClick={() => onNavigate('scales', { scaleId: 'gad-7' })}
                  className="px-2.5 py-1.5 bg-white border border-slate-200 hover:border-teal-600 rounded text-xs font-medium text-slate-700 hover:text-slate-900 transition-colors text-left flex items-center justify-between"
                >
                  <span>• GAD-7 (Ansiedade)</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                </button>
                <button
                  onClick={() => onNavigate('calculators', { calcTab: 'egfr' })}
                  className="px-2.5 py-1.5 bg-white border border-slate-200 hover:border-teal-600 rounded text-xs font-medium text-slate-700 hover:text-slate-900 transition-colors text-left flex items-center justify-between"
                >
                  <span>• CKD-EPI 2021 (eGFR)</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                </button>
                <button
                  onClick={() => onNavigate('calculators', { calcTab: 'antidepressant' })}
                  className="px-2.5 py-1.5 bg-white border border-slate-200 hover:border-teal-600 rounded text-xs font-medium text-slate-700 hover:text-slate-900 transition-colors text-left flex items-center justify-between"
                >
                  <span>• Troca Antidepressivos</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
              {scaleHistory.map((res, idx) => {
                const isJustInserted = insertedScaleId === (res.id || res.scaleId);
                const hasItem9Alert =
                  res.scaleId === 'phq-9' &&
                  ((res.answersArray && res.answersArray[8] > 0) ||
                    res.recommendations?.some((r) => r.includes('pergunta 9') || r.includes('autolesão')));

                return (
                  <div
                    key={res.id || idx}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2.5 text-left"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#0A2540]">
                        {res.scaleTitle}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">
                        {res.date}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-black font-mono text-[#0A2540]">
                        {res.totalScore}
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        / {res.maxScore} pts
                      </span>
                    </div>

                    <div className={`p-1.5 rounded text-[11px] font-semibold border ${getSeverityBadgeClass(res.severityLevel)}`}>
                      {res.classification}
                    </div>

                    {/* ALERTA CRÍTICO SE ITEM 9 FOR POSITIVO */}
                    {hasItem9Alert && (
                      <div className="p-2.5 rounded-md bg-red-50 border border-red-300 text-xs text-red-900 space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-red-700">
                          <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                          <span>Atenção Clínica (Item 9)</span>
                        </div>
                        <p className="text-[11px] text-red-800 leading-snug">
                          Resposta positiva relacionada a morte/autoagressão. Realizar avaliação clínica direta.
                        </p>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => handleInsertScaleToSoap(res)}
                      className="w-full py-1.5 bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-300 rounded text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    >
                      <FileCheck className="w-3 h-3 text-teal-600" />
                      <span>{isJustInserted ? 'Inserido no Objetivo!' : 'Inserir no Objetivo (O)'}</span>
                    </button>
                  </div>
                );
              })}

              <div className="pt-2 text-center">
                <span className="text-[10px] text-slate-400 font-mono block leading-tight">
                  Alimentam exclusivamente o campo Objetivo do SOAP.
                </span>
              </div>
            </div>
          )}
        </section>

        {/* ==================================================================== */}
        {/* REGIÃO DIREITA: PRONTUÁRIO SOAP (lg:col-span-4) */}
        {/* ==================================================================== */}
        <section
          aria-labelledby="bloco-soap-title"
          className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-3.5"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-slate-100 text-[#0A2540] rounded-md">
                <FileText className="w-4 h-4 text-teal-700" />
              </span>
              <div>
                <h2 id="bloco-soap-title" className="text-sm font-bold text-[#0A2540]">
                  3. Prontuário SOAP
                </h2>
                <span className="text-[11px] text-slate-500">Documentação estruturada em 4 eixos</span>
              </div>
            </div>
          </div>

          {/* S — Subjetivo (Preview Sincronizado - Única fonte editável na área clínica) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded bg-teal-50 text-teal-700 border border-teal-200 font-mono text-[10px] flex items-center justify-center font-bold">
                  S
                </span>
                <span className="text-xs font-bold text-slate-800">Subjetivo</span>
                <span className="text-[9px] font-mono bg-slate-100 text-slate-500 px-1 py-0.2 rounded">
                  Preview sincronizado
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleFocusSubjective}
                  className="text-[10px] font-mono text-teal-700 hover:text-teal-900 flex items-center gap-0.5 cursor-pointer"
                  title="Editar no campo de narrativa clínica"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Editar narrativa</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleCopySection(soapState.subjective, 'S')}
                  className="text-[10px] font-mono text-slate-400 hover:text-slate-700 flex items-center gap-0.5 cursor-pointer ml-1"
                >
                  {copiedSection === 'S' ? <Check className="w-3 h-3 text-teal-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedSection === 'S' ? 'Copiado' : 'Copiar'}</span>
                </button>
              </div>
            </div>

            {/* Read-only synchronized preview */}
            <div
              onClick={handleFocusSubjective}
              className="w-full bg-slate-50 hover:bg-slate-100/60 transition-colors text-slate-800 text-xs p-2.5 rounded-lg border border-slate-200 cursor-pointer min-h-[64px] max-h-36 overflow-y-auto leading-relaxed group"
              title="Clique para editar o Subjetivo no campo principal"
            >
              {soapState.subjective.trim() ? (
                <p className="whitespace-pre-wrap">{soapState.subjective}</p>
              ) : (
                <p className="italic text-slate-400">
                  Narrativa livre ainda em branco. Clique aqui para preencher o Subjetivo no campo principal...
                </p>
              )}
            </div>
          </div>

          {/* O — Objetivo */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label htmlFor="soap-o" className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-mono text-[10px] flex items-center justify-center font-bold">
                  O
                </span>
                <span>Objetivo (EEM e Escalas)</span>
              </label>
              <button
                type="button"
                onClick={() => handleCopySection(soapState.objective, 'O')}
                className="text-[10px] font-mono text-slate-400 hover:text-slate-700 flex items-center gap-0.5 cursor-pointer"
              >
                {copiedSection === 'O' ? <Check className="w-3 h-3 text-teal-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSection === 'O' ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>
            <textarea
              id="soap-o"
              value={soapState.objective}
              onChange={(e) => handleSoapChange('objective', e.target.value)}
              placeholder="Achados do Exame do Estado Mental (EEM), escores de escalas, medidas e exame clínico..."
              rows={4}
              className="w-full bg-slate-50 focus:bg-white text-slate-800 text-xs p-2.5 rounded-lg border border-slate-200 focus:border-teal-600 outline-none leading-relaxed resize-y transition-all placeholder:text-slate-400 font-sans"
            />
          </div>

          {/* A — Avaliação (Autoria Médica) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label htmlFor="soap-a" className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono text-[10px] flex items-center justify-center font-bold">
                  A
                </span>
                <span>Avaliação</span>
                <span className="text-[9px] font-mono text-slate-400">(autoria médica)</span>
              </label>
              <button
                type="button"
                onClick={() => handleCopySection(soapState.assessment, 'A')}
                className="text-[10px] font-mono text-slate-400 hover:text-slate-700 flex items-center gap-0.5 cursor-pointer"
              >
                {copiedSection === 'A' ? <Check className="w-3 h-3 text-teal-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSection === 'A' ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>
            <textarea
              id="soap-a"
              value={soapState.assessment}
              onChange={(e) => handleSoapChange('assessment', e.target.value)}
              placeholder="Impressão diagnóstica longitudinal, raciocínio clínico, diagnósticos sindrômicos/etiológicos e estratificação sob julgamento médico..."
              rows={3}
              className="w-full bg-slate-50 focus:bg-white text-slate-800 text-xs p-2.5 rounded-lg border border-slate-200 focus:border-teal-600 outline-none leading-relaxed resize-y transition-all placeholder:text-slate-400 font-sans"
            />
          </div>

          {/* P — Plano (Autoria Médica) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label htmlFor="soap-p" className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded bg-teal-50 text-teal-700 border border-teal-200 font-mono text-[10px] flex items-center justify-center font-bold">
                  P
                </span>
                <span>Plano Terapêutico</span>
                <span className="text-[9px] font-mono text-slate-400">(autoria médica)</span>
              </label>
              <button
                type="button"
                onClick={() => handleCopySection(soapState.plan, 'P')}
                className="text-[10px] font-mono text-slate-400 hover:text-slate-700 flex items-center gap-0.5 cursor-pointer"
              >
                {copiedSection === 'P' ? <Check className="w-3 h-3 text-teal-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSection === 'P' ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>
            <textarea
              id="soap-p"
              value={soapState.plan}
              onChange={(e) => handleSoapChange('plan', e.target.value)}
              placeholder="Conduta medicamentosa pactuada, cronograma de desmame/troca, plano de segurança e metas de retorno..."
              rows={4}
              className="w-full bg-slate-50 focus:bg-white text-slate-800 text-xs p-2.5 rounded-lg border border-slate-200 focus:border-teal-600 outline-none leading-relaxed resize-y transition-all placeholder:text-slate-400 font-sans"
            />
          </div>

          {/* Ações na parte inferior do SOAP */}
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={handleCopyFullSoap}
              className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs min-h-[40px]"
              title="Copiar SOAP estruturado completo"
            >
              {copiedFull ? <Check className="w-3.5 h-3.5 text-teal-200" /> : <Copy className="w-3.5 h-3.5 text-teal-200" />}
              <span>{copiedFull ? 'SOAP Copiado!' : 'Copiar SOAP completo'}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowClearModal(true)}
                className="flex-1 py-2 bg-white hover:bg-red-50 text-slate-600 hover:text-red-600 border border-slate-200 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                title="Limpar sessão"
              >
                <Trash2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Limpar sessão</span>
              </button>

              <button
                onClick={() => {
                  if (onOpenEvidence) onOpenEvidence();
                }}
                className="flex-1 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                title="Ver evidências científicas"
              >
                <BookOpen className="w-3.5 h-3.5 text-teal-700" />
                <span>Ver evidências</span>
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* RODAPÉ CLÍNICO MANDATÓRIO */}
      <footer className="pt-3 pb-4 text-center">
        <p className="text-xs text-slate-400 font-mono tracking-wide">
          Escala ≠ diagnóstico · Cálculo ≠ conduta · Decisão permanece médica
        </p>
      </footer>

      {/* MODAL DE CONFIRMAÇÃO DE LIMPEZA */}
      {showClearModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-xl p-6 w-full max-w-md shadow-2xl space-y-4 font-sans">
            <div className="flex items-center gap-3 text-amber-600">
              <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center border border-amber-200 shrink-0">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Limpar Toda a Consulta?
                </h3>
                <span className="text-xs text-slate-500">Reinicia EEM, Escalas e SOAP</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Esta ação apagará todo o registro SOAP, redefinirá o Exame do Estado Mental e as escalas desta consulta.
            </p>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowClearModal(false)}
                className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold border border-slate-200 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onResetConsultation();
                  setShowClearModal(false);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                Sim, Limpar Consulta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
