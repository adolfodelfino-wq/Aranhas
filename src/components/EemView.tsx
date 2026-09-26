import React, { useState, useEffect } from 'react';
import { EEM_DOMAINS } from '../data/eemData';
import { EemState } from '../types';
import { generateEemSummary } from '../utils/eemFormatter';
import {
  Stethoscope,
  CheckCircle,
  FileCheck,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Copy,
  Check,
} from 'lucide-react';

interface EemViewProps {
  onImportToSoap: (text: string, title: string) => void;
  eemState?: EemState;
  onUpdateEem?: (newState: EemState) => void;
  onOpenEducationSuggestions?: () => void;
}

const getInitialEemState = (): EemState => ({
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

export const EemView: React.FC<EemViewProps> = ({
  onImportToSoap,
  eemState,
  onUpdateEem,
  onOpenEducationSuggestions,
}) => {
  const sanitizeEemState = (state?: EemState): EemState => {
    const base = getInitialEemState();
    if (!state) return base;
    return {
      ...base,
      ...state,
      aparencia: Array.isArray(state.aparencia) ? state.aparencia : base.aparencia,
      atitude: Array.isArray(state.atitude) ? state.atitude : base.atitude,
      fala: Array.isArray(state.fala) ? state.fala : base.fala,
      humor: Array.isArray(state.humor) ? state.humor : base.humor,
      afeto: Array.isArray(state.afeto) ? state.afeto : base.afeto,
      pensamentoCurso: Array.isArray(state.pensamentoCurso) ? state.pensamentoCurso : base.pensamentoCurso,
      pensamentoForma: Array.isArray(state.pensamentoForma) ? state.pensamentoForma : base.pensamentoForma,
      pensamentoConteudo: Array.isArray(state.pensamentoConteudo) ? state.pensamentoConteudo : base.pensamentoConteudo,
      sensopercepcao: Array.isArray(state.sensopercepcao) ? state.sensopercepcao : base.sensopercepcao,
      orientacao: Array.isArray(state.orientacao) ? state.orientacao : base.orientacao,
      atencaoMemoria: Array.isArray(state.atencaoMemoria) ? state.atencaoMemoria : base.atencaoMemoria,
      insight: Array.isArray(state.insight) ? state.insight : base.insight,
      julgamento: Array.isArray(state.julgamento) ? state.julgamento : base.julgamento,
    };
  };

  const [eem, setEem] = useState<EemState>(() => sanitizeEemState(eemState));
  const [imported, setImported] = useState(false);
  const [collapsedDomains, setCollapsedDomains] = useState<Record<string, boolean>>({});
  const [resetFeedback, setResetFeedback] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (eemState) {
      setEem(sanitizeEemState(eemState));
    }
  }, [eemState]);

  const updateState = (updated: EemState) => {
    setEem(updated);
    if (onUpdateEem) {
      onUpdateEem(updated);
    }
  };

  const toggleOption = (key: keyof EemState, optionId: string) => {
    const currentList = Array.isArray(eem[key]) ? (eem[key] as string[]) : [];
    const exists = currentList.includes(optionId);
    let newList: string[];

    if (exists) {
      newList = currentList.filter((id) => id !== optionId);
    } else {
      newList = [...currentList, optionId];

      // Automatic mutual exclusion rules when selecting an option
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
        if (optionId === 'orientado_global') {
          newList = ['orientado_global'];
        } else {
          newList = newList.filter((id) => id !== 'orientado_global');
          if (optionId === 'orientado_autopsiquica') {
            newList = newList.filter((id) => id !== 'desorientado_autopsiquica');
          }
          if (optionId === 'desorientado_autopsiquica') {
            newList = newList.filter((id) => id !== 'orientado_autopsiquica');
          }
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

    const updatedState = { ...eem, [key]: newList };
    updateState(updatedState);
    setImported(false);
  };

  const handleTextChange = (key: keyof EemState, text: string) => {
    const updatedState = { ...eem, [key]: text };
    updateState(updatedState);
    setImported(false);
  };

  const toggleDomainCollapse = (domainId: string) => {
    setCollapsedDomains((prev) => ({ ...prev, [domainId]: !prev[domainId] }));
  };

  // Construct humanized natural Portuguese text for EEM in SOAP Objective (sequential lines)
  const eemSummaryText = generateEemSummary(eem);

  const handleCopyEem = () => {
    navigator.clipboard.writeText(eemSummaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportToSoap = () => {
    onImportToSoap(eemSummaryText, 'Exame do Estado Mental');
    setImported(true);
  };

  const handleResetToStandard = () => {
    setEem(getInitialEemState());
    setImported(false);
    setCollapsedDomains({});
    setResetFeedback(true);
    setTimeout(() => {
      setResetFeedback(false);
    }, 2000);
  };

  return (
    <div className="w-full min-w-0 max-w-7xl mx-auto space-y-4 sm:space-y-6 py-1 font-sans">
      {/* Top Banner & Action Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded uppercase tracking-wider border border-teal-200">
                Semiologia Psiquiátrica APS
              </span>
              <span className="text-xs text-slate-500 font-medium">
                11 Domínios Semiológicos Estruturados
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight flex items-center gap-2.5">
              <Stethoscope className="w-6 h-6 text-teal-600" />
              <span>Exame do Estado Mental (EEM)</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              Avaliação semiológica estruturada baseada no <em>Compêndio de Psiquiatria (Kaplan & Sadock)</em>, <em>Dalgalarrondo</em> e <em>StatPearls/NCBI</em>. Selecione os achados clínicos por função psíquica para gerar a síntese textual e exportar para o SOAP (Objetivo).
            </p>
          </div>

          <button
            type="button"
            onClick={handleResetToStandard}
            className={`self-start md:self-auto px-4 py-2 rounded-lg font-mono text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all border cursor-pointer shadow-xs shrink-0 ${
              resetFeedback
                ? 'bg-teal-600 text-white border-teal-600'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            {resetFeedback ? (
              <>
                <CheckCircle className="w-3.5 h-3.5 text-white" />
                <span>Padrão Eutímico Restaurado</span>
              </>
            ) : (
              <>
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>Restaurar Padrão Eutímico</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Grid de Domínios do EEM */}
      <div className="space-y-3.5">
        {EEM_DOMAINS.map((domain) => {
          const isCollapsed = collapsedDomains[domain.id];

          const stateKey: keyof EemState = domain.id as keyof EemState;

          const selectedValues = Array.isArray(eem[stateKey]) ? (eem[stateKey] as string[]) : [];

          return (
            <div
              key={domain.id}
              className="bg-white border border-slate-200 rounded-lg overflow-hidden transition-all shadow-xs hover:border-slate-300"
            >
              {/* Domain Header */}
              <button
                type="button"
                onClick={() => toggleDomainCollapse(domain.id)}
                className="w-full flex items-center justify-between p-4 sm:p-4.5 bg-white hover:bg-slate-50/80 text-left transition-colors cursor-pointer border-b border-slate-100"
              >
                <div>
                  <h2 className="font-bold text-slate-900 text-base sm:text-lg flex items-center gap-2.5">
                    <span>{domain.title}</span>
                    <span className="font-mono text-[11px] bg-teal-50 text-teal-700 border border-teal-200 px-2 py-0.5 rounded font-bold">
                      {selectedValues.length} selecionado{selectedValues.length > 1 ? 's' : ''}
                    </span>
                  </h2>
                  {domain.instructions && (
                    <p className="text-xs text-slate-500 mt-0.5">
                      {domain.instructions}
                    </p>
                  )}
                </div>

                <div className="text-slate-400 hover:text-slate-600 transition-colors">
                  {isCollapsed ? (
                    <ChevronDown className="w-5 h-5" />
                  ) : (
                    <ChevronUp className="w-5 h-5" />
                  )}
                </div>
              </button>

              {/* Options Grid */}
              {!isCollapsed && (
                <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 bg-slate-50/50">
                  {domain.options.map((opt) => {
                    const isChecked = selectedValues.includes(opt.id);

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => toggleOption(stateKey, opt.id)}
                        className={`text-left p-3 rounded-lg border text-xs font-medium transition-all flex items-start gap-2.5 cursor-pointer ${
                          isChecked
                            ? 'bg-teal-50 border-teal-600 text-teal-950 font-semibold shadow-xs'
                            : 'bg-white hover:bg-slate-100/80 border-slate-200 text-slate-800 shadow-xs'
                        }`}
                      >
                        <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                          isChecked
                            ? 'bg-teal-600 border-teal-600 text-white'
                            : 'border-slate-300 bg-white'
                        }`}>
                          {isChecked && <CheckCircle className="w-3 h-3 fill-current" />}
                        </span>
                        <span className={`text-xs sm:text-[13px] leading-snug ${isChecked ? 'text-teal-950 font-semibold' : 'text-slate-800'}`}>{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* Descritores Livres e Observações Complementares */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 space-y-3 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded uppercase tracking-wider border border-teal-200">
              Campo Livre
            </span>
            <h2 className="text-sm font-bold text-slate-800">
              12. Observações Complementares e Descritores Livres
            </h2>
          </div>
          <textarea
            value={eem.observacoesLivres}
            onChange={(e) => handleTextChange('observacoesLivres', e.target.value)}
            placeholder="Ex: Paciente manteve bom contato visual durante todo o atendimento; nega ideação ou sintomas psicóticos atuais; cooperativo com o plano terapêutico..."
            rows={3}
            className="w-full bg-slate-50/70 border border-slate-200 rounded-lg p-3.5 text-xs sm:text-sm text-slate-800 font-sans focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all resize-none placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Painel de Exportação para o SOAP */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <FileCheck className="w-5 h-5 text-teal-600" />
            <div>
              <h2 className="font-bold text-slate-900 text-lg sm:text-xl">
                Síntese do Exame do Estado Mental Gerado
              </h2>
              <span className="text-xs text-slate-500 font-medium">
                Estruturado para inserção no eixo Objetivo (O) do prontuário
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {onOpenEducationSuggestions && (
              <button
                type="button"
                onClick={onOpenEducationSuggestions}
                className="px-3.5 py-2.5 bg-white hover:bg-slate-50 text-teal-700 border border-teal-200 rounded-md font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>Sugestões Clínicas</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleCopyEem}
              className="px-3.5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-md font-mono text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado!' : 'Copiar Síntese'}</span>
            </button>

            <button
              type="button"
              onClick={handleExportToSoap}
              className="px-4 py-2.5 bg-[#0A3B74] hover:bg-[#07284F] text-white font-mono font-bold uppercase tracking-wider rounded-md text-xs flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
            >
              <FileCheck className="w-4 h-4 text-[#38BDF8]" />
              <span>{imported ? 'Inserido no SOAP!' : 'Inserir EEM no SOAP (O)'}</span>
            </button>
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <p className="text-xs text-slate-800 font-mono leading-relaxed whitespace-pre-wrap">
            {eemSummaryText}
          </p>
        </div>
      </div>
    </div>
  );
};
