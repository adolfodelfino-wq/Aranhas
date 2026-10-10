import React, { useState, useEffect } from 'react';
import { ScaleResult, EemState, EducationSuggestion } from '../types';
import {
  generateHealthEducationSuggestions,
  formatConfirmedEducationToPlan,
} from '../utils/healthEducationEngine';
import {
  Sparkles,
  CheckCircle,
  X,
  Info,
  Edit3,
  ArrowLeft,
  FileCheck,
  Check,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
} from 'lucide-react';

interface ContextualEducationModalProps {
  scaleResults: ScaleResult[];
  eemState: EemState;
  onClose: () => void;
  onConfirmToPlan: (formattedText: string, titlesSummary: string) => void;
}

export const ContextualEducationModal: React.FC<ContextualEducationModalProps> = ({
  scaleResults,
  eemState,
  onClose,
  onConfirmToPlan,
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [suggestions, setSuggestions] = useState<EducationSuggestion[]>([]);
  const [hasHighRiskWarning, setHasHighRiskWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState<string | undefined>();
  const [expandedReasonId, setExpandedReasonId] = useState<string | null>(null);

  useEffect(() => {
    const res = generateHealthEducationSuggestions(scaleResults, eemState);
    setSuggestions(res.suggestions);
    setHasHighRiskWarning(res.hasHighRiskWarning);
    setWarningMessage(res.warningMessage);
  }, [scaleResults, eemState]);

  const toggleSelect = (id: string) => {
    setSuggestions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, selected: !s.selected } : s))
    );
  };

  const toggleEditing = (id: string) => {
    setSuggestions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isEditing: !s.isEditing } : s))
    );
  };

  const handlePhraseChange = (id: string, newPhrase: string) => {
    setSuggestions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, soapPhrase: newPhrase } : s))
    );
  };

  const selectedCount = suggestions.filter((s) => s.selected).length;
  const formattedPlanText = formatConfirmedEducationToPlan(suggestions);

  const handleFinalConfirm = () => {
    const selectedTitles = suggestions
      .filter((s) => s.selected)
      .map((s) => s.title)
      .join(', ');

    onConfirmToPlan(formattedPlanText, selectedTitles || 'Educação em Saúde');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 text-slate-800 rounded-xl p-6 w-full max-w-2xl shadow-2xl space-y-5 max-h-[90vh] flex flex-col font-sans">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-teal-600 p-2.5 rounded-lg text-white shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-lg sm:text-xl">
                Sugestões de Educação em Saúde Contextual
              </h2>
              <p className="text-xs text-slate-500">
                {step === 1
                  ? 'Revisão e seleção médica de orientações baseadas em Escalas e EEM.'
                  : 'Confirmação final do texto a ser registrado no Plano (P) do SOAP.'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Banner de Risco Clínico Prioritário (Se houver) */}
        {hasHighRiskWarning && (
          <div className="bg-amber-50 border border-amber-200 text-amber-950 p-3.5 rounded-lg text-xs flex items-start gap-3 shrink-0">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-bold text-amber-900 font-mono text-[11px] uppercase tracking-wider">Prioridade de Risco Clínico</p>
              <p className="text-amber-800 leading-relaxed text-xs">
                {warningMessage ||
                  'Avaliação clínica e manejo de segurança têm prioridade antes das orientações educativas.'}
              </p>
            </div>
          </div>
        )}

        {/* PASSO 1: SELEÇÃO E EDIÇÃO DAS SUGESTÕES */}
        {step === 1 && (
          <div className="space-y-4 overflow-y-auto pr-1 flex-1">
            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-lg text-xs text-slate-700 flex items-center justify-between">
              <span>
                Selecione ou edite as orientações potencialmente pertinentes para o caso.
              </span>
              <span className="font-mono font-bold text-teal-700 text-[11px] bg-white px-2.5 py-0.5 rounded border border-teal-200">
                {suggestions.length} sugestões
              </span>
            </div>

            {/* Lista de Sugestões */}
            <div className="space-y-3">
              {suggestions.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-lg border text-xs transition-all space-y-3 ${
                    item.selected
                      ? 'bg-white border-teal-600 shadow-xs'
                      : 'bg-slate-50 hover:bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={item.selected}
                        onChange={() => toggleSelect(item.id)}
                        className="mt-1 h-4 w-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300 cursor-pointer"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center flex-wrap gap-2">
                          <span className="font-bold text-slate-900 text-base">
                            {item.title}
                          </span>
                          {item.isComboMatch && (
                            <span className="bg-teal-50 text-teal-700 border border-teal-200 text-[10px] font-mono font-bold px-2 py-0.5 rounded flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-teal-600" />
                              <span>Escala + EEM</span>
                            </span>
                          )}
                        </div>

                        <p className="text-slate-600 leading-relaxed text-xs">
                          {item.shortDescription}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleEditing(item.id)}
                      className={`px-2.5 py-1 rounded font-mono text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1 transition-colors shrink-0 cursor-pointer shadow-xs ${
                        item.isEditing
                          ? 'bg-teal-600 text-white'
                          : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
                      }`}
                      title="Editar redação"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>{item.isEditing ? 'Pronto' : 'Editar'}</span>
                    </button>
                  </div>

                  {/* Área de Edição da Frase do SOAP */}
                  {item.isEditing && (
                    <div className="bg-slate-50 p-3 rounded-lg border border-teal-300 space-y-1.5">
                      <label className="font-mono text-[11px] uppercase font-bold text-teal-700 flex items-center gap-1">
                        <span>Texto para o Plano (P):</span>
                      </label>
                      <textarea
                        value={item.soapPhrase}
                        onChange={(e) => handlePhraseChange(item.id, e.target.value)}
                        rows={2}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-600 font-sans"
                      />
                    </div>
                  )}

                  {/* Informação Discreta: "Por que apareceu?" */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <button
                      onClick={() =>
                        setExpandedReasonId(
                          expandedReasonId === item.id ? null : item.id
                        )
                      }
                      className="text-slate-500 hover:text-teal-700 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Info className="w-3.5 h-3.5 text-teal-600" />
                      <span>Por que esta sugestão apareceu?</span>
                      {expandedReasonId === item.id ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      )}
                    </button>

                    {item.matchedSources.length > 0 && (
                      <div className="flex items-center gap-1 text-slate-500 font-mono text-[10px]">
                        {item.matchedSources.map((src, i) => (
                          <span
                            key={`src-${item.id}-${i}`}
                            className="bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-slate-700"
                          >
                            {src}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {expandedReasonId === item.id && (
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-700 space-y-1">
                      <p className="font-semibold text-slate-900">{item.reasonText}</p>
                      <p className="text-[11px] text-slate-500 font-mono">
                        Fontes: {item.matchedSources.join(' + ') || 'Diretrizes APS'}.
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PASSO 2: CONFIRMAÇÃO DO PLANO */}
        {step === 2 && (
          <div className="space-y-4 overflow-y-auto pr-1 flex-1">
            <div className="bg-teal-50 border border-teal-200 p-4 rounded-lg text-xs text-slate-800 space-y-1">
              <p className="font-bold flex items-center gap-1.5 text-teal-800 font-mono text-[11px] uppercase">
                <CheckCircle className="w-4 h-4 text-teal-600" />
                <span>Resumo das orientações selecionadas</span>
              </p>
              <p className="text-slate-700 text-xs leading-relaxed">
                Revise abaixo o texto fluido que será inserido no bloco do **Plano (P)** do registro SOAP.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg space-y-2">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-500 border-b border-slate-200 pb-2 uppercase">
                <span>Texto Gerado para o Plano (P):</span>
                <span className="text-teal-700">
                  {selectedCount} de {suggestions.length} confirmadas
                </span>
              </div>

              {formattedPlanText ? (
                <p className="text-xs text-slate-800 font-sans leading-relaxed pt-1 whitespace-pre-wrap">
                  {formattedPlanText}
                </p>
              ) : (
                <p className="text-xs text-slate-400 italic pt-1">
                  Nenhuma orientação selecionada.
                </p>
              )}
            </div>

            <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg text-[11px] text-slate-600 space-y-1">
              <p className="font-semibold text-slate-900">Confirmação Médica:</p>
              <p>
                O conteúdo é registrado no SOAP apenas após o clique de confirmação.
              </p>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3.5 border-t border-slate-100 shrink-0">
          {step === 1 ? (
            <>
              <span className="font-mono text-xs text-slate-500">
                {selectedCount} de {suggestions.length} selecionadas
              </span>

              <div className="flex gap-2.5">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg font-mono text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
                >
                  Ignorar todas
                </button>

                <button
                  onClick={() => setStep(2)}
                  disabled={selectedCount === 0}
                  className={`px-4 py-2 rounded-lg font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer ${
                    selectedCount > 0
                      ? 'bg-teal-600 hover:bg-teal-700 text-white'
                      : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                  }`}
                >
                  <span>Confirmar orientações</span>
                  <FileCheck className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg font-mono text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar</span>
              </button>

              <button
                onClick={handleFinalConfirm}
                disabled={!formattedPlanText}
                className={`px-5 py-2.5 rounded-lg font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-xs cursor-pointer ${
                  formattedPlanText
                    ? 'bg-teal-600 hover:bg-teal-700 text-white'
                    : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                }`}
              >
                <Check className="w-4 h-4 text-white" />
                <span>Confirmar e registrar no Plano</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
