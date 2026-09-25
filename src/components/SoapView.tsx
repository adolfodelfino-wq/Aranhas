import React, { useState } from 'react';
import { SoapState, PatientSession } from '../types';
import {
  FileText,
  Copy,
  Check,
  Trash2,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

interface SoapViewProps {
  soapState: SoapState;
  patient: PatientSession;
  onUpdateSoap: (updated: SoapState) => void;
  onOpenEducationSuggestions?: () => void;
}

export const SoapView: React.FC<SoapViewProps> = ({
  soapState,
  patient,
  onUpdateSoap,
  onOpenEducationSuggestions,
}) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [copiedFull, setCopiedFull] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);

  const handleTextChange = (field: keyof SoapState, value: string) => {
    onUpdateSoap({
      ...soapState,
      [field]: value,
    });
  };

  const copyToClipboard = (text: string, sectionName: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionName);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const copyFullSoap = () => {
    const fullText = `REGISTRO CLÍNICO DE SAÚDE MENTAL - APS (MFC)
PACIENTE: ${patient.name} (${patient.age} anos, Prontuário: ${patient.prontuario})
DATA: ${patient.date}

[S - SUBJETIVO]
${soapState.subjective || 'Sem registros.'}

[O - OBJETIVO]
${soapState.objective || 'Sem registros.'}

[A - AVALIAÇÃO]
${soapState.assessment || 'Sem registros.'}

[P - PLANO]
${soapState.plan || 'Sem registros.'}`;

    navigator.clipboard.writeText(fullText);
    setCopiedFull(true);
    setTimeout(() => setCopiedFull(false), 2000);
  };

  const handleClearSoap = () => {
    onUpdateSoap({
      subjective: '',
      objective: '',
      assessment: '',
      plan: '',
      importedItems: [],
    });
    setShowClearModal(false);
  };

  return (
    <div className="w-full min-w-0 max-w-7xl mx-auto space-y-4 sm:space-y-6 py-1 font-sans">
      {/* Top Banner & Action Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded uppercase tracking-wider border border-teal-200">
                Prontuário Estruturado APS
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Método Clínico Centrado na Pessoa
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight flex items-center gap-2.5">
              <FileText className="w-6 h-6 text-teal-600" />
              <span>Registro Clínico SOAP</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              Registro orientado por problemas em 4 eixos semiológicos para a Atenção Primária à Saúde. Digite ou importe dados determinísticos de escalas e EEM com 1 clique.
            </p>
          </div>

          {/* Top Action Buttons Group */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Sugestões de Educação em Saúde */}
            {onOpenEducationSuggestions && (
              <button
                onClick={onOpenEducationSuggestions}
                className="px-3.5 py-2.5 bg-white hover:bg-slate-50 text-teal-700 border border-teal-200 rounded-md font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                title="Sugestões contextuais baseadas em Escalas e EEM com confirmação médica"
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>Sugestões</span>
              </button>
            )}

            {/* Copiar SOAP Completo */}
            <button
              onClick={copyFullSoap}
              className="px-4 py-2.5 bg-[#0A3B74] hover:bg-[#07284F] text-white rounded-md font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              {copiedFull ? (
                <Check className="w-3.5 h-3.5 text-[#38BDF8]" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-[#38BDF8]" />
              )}
              <span>{copiedFull ? 'Copiado!' : 'Copiar SOAP Completo'}</span>
            </button>

            {/* Limpar SOAP */}
            <button
              onClick={() => setShowClearModal(true)}
              className="p-2.5 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-700 rounded-md transition-colors border border-slate-300 cursor-pointer shadow-xs"
              title="Limpar todos os campos do SOAP"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Itens Importados Registrados */}
      {soapState.importedItems.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-lg p-3.5 sm:p-4 flex flex-wrap items-center gap-2 text-xs shadow-xs">
          <span className="font-mono text-[11px] text-slate-500 font-bold uppercase tracking-wider">Itens Inseridos:</span>
          {soapState.importedItems.map((item, idx) => (
            <span
              key={idx}
              className="bg-teal-50 text-teal-700 border border-teal-200 px-2.5 py-1 rounded-md font-mono text-xs flex items-center gap-1.5 font-medium shadow-2xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
              <span>
                [{item.targetSection}] {item.title}
              </span>
            </span>
          ))}
        </div>
      )}

      {/* Grid com os 4 Blocos SOAP */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* S - Subjetivo */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 space-y-3.5 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-all">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-md font-mono font-bold text-xs flex items-center justify-center bg-teal-50 text-teal-700 border border-teal-200">
                  S
                </span>
                <h2 className="font-bold text-slate-900 text-base sm:text-lg">Subjetivo</h2>
              </div>

              <button
                onClick={() => copyToClipboard(soapState.subjective, 'S')}
                className="font-mono text-xs text-slate-500 hover:text-teal-700 flex items-center gap-1 px-2 py-1 hover:bg-slate-50 rounded-md border border-transparent hover:border-slate-200 transition-colors cursor-pointer"
              >
                {copiedSection === 'S' ? (
                  <Check className="w-3.5 h-3.5 text-teal-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>{copiedSection === 'S' ? 'Copiado' : 'Copiar S'}</span>
              </button>
            </div>

            <textarea
              value={soapState.subjective}
              onChange={(e) => handleTextChange('subjective', e.target.value)}
              placeholder="Relato livre da pessoa, motivo da consulta, história da doença atual, contexto sociofamiliar, adesão terapêutica e expectativas..."
              rows={8}
              className="w-full bg-slate-50/70 border border-slate-200 rounded-lg p-3.5 text-xs sm:text-sm text-slate-800 font-sans leading-relaxed focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all resize-none placeholder:text-slate-400"
            />
          </div>

          <p className="font-mono text-[11px] text-slate-500">
            Registre a queixa principal, narrativa e contexto biopsicossocial do paciente.
          </p>
        </div>

        {/* O - Objetivo */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 space-y-3.5 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-all">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-md font-mono font-bold text-xs flex items-center justify-center bg-blue-50 text-blue-700 border border-blue-200">
                  O
                </span>
                <h2 className="font-bold text-slate-900 text-base sm:text-lg">Objetivo</h2>
              </div>

              <button
                onClick={() => copyToClipboard(soapState.objective, 'O')}
                className="font-mono text-xs text-slate-500 hover:text-teal-700 flex items-center gap-1 px-2 py-1 hover:bg-slate-50 rounded-md border border-transparent hover:border-slate-200 transition-colors cursor-pointer"
              >
                {copiedSection === 'O' ? (
                  <Check className="w-3.5 h-3.5 text-teal-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>{copiedSection === 'O' ? 'Copiado' : 'Copiar O'}</span>
              </button>
            </div>

            <textarea
              value={soapState.objective}
              onChange={(e) => handleTextChange('objective', e.target.value)}
              placeholder="Exame físico, achados do Exame do Estado Mental (EEM), escores de escalas psicométricas validadas (PHQ-9, GAD-7, ASRS) e dados laboratoriais..."
              rows={8}
              className="w-full bg-slate-50/70 border border-slate-200 rounded-lg p-3.5 text-xs sm:text-sm text-slate-800 font-sans leading-relaxed focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all resize-none placeholder:text-slate-400"
            />
          </div>

          <p className="font-mono text-[11px] text-slate-500">
            Escalas e síntese do EEM são inseridos automaticamente neste bloco.
          </p>
        </div>

        {/* A - Avaliação */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 space-y-3.5 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-all">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-md font-mono font-bold text-xs flex items-center justify-center bg-indigo-50 text-indigo-700 border border-indigo-200">
                  A
                </span>
                <h2 className="font-bold text-slate-900 text-base sm:text-lg">Avaliação</h2>
              </div>

              <button
                onClick={() => copyToClipboard(soapState.assessment, 'A')}
                className="font-mono text-xs text-slate-500 hover:text-teal-700 flex items-center gap-1 px-2 py-1 hover:bg-slate-50 rounded-md border border-transparent hover:border-slate-200 transition-colors cursor-pointer"
              >
                {copiedSection === 'A' ? (
                  <Check className="w-3.5 h-3.5 text-teal-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>{copiedSection === 'A' ? 'Copiado' : 'Copiar A'}</span>
              </button>
            </div>

            <textarea
              value={soapState.assessment}
              onChange={(e) => handleTextChange('assessment', e.target.value)}
              placeholder="Síntese diagnóstica e longitudinal em APS, estratificação de risco clínico e de segurança, hipóteses sindrômicas e estressores psicossociais vigentes..."
              rows={8}
              className="w-full bg-slate-50/70 border border-slate-200 rounded-lg p-3.5 text-xs sm:text-sm text-slate-800 font-sans leading-relaxed focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all resize-none placeholder:text-slate-400"
            />
          </div>

          <p className="font-mono text-[11px] text-slate-500">
            Foque na impressão diagnóstica longitudinal sob acompanhamento na UBS.
          </p>
        </div>

        {/* P - Plano */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 space-y-3.5 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-all">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-md font-mono font-bold text-xs flex items-center justify-center bg-teal-50 text-teal-700 border border-teal-200">
                  P
                </span>
                <h2 className="font-bold text-slate-900 text-base sm:text-lg">Plano Terapêutico</h2>
              </div>

              <button
                onClick={() => copyToClipboard(soapState.plan, 'P')}
                className="font-mono text-xs text-slate-500 hover:text-teal-700 flex items-center gap-1 px-2 py-1 hover:bg-slate-50 rounded-md border border-transparent hover:border-slate-200 transition-colors cursor-pointer"
              >
                {copiedSection === 'P' ? (
                  <Check className="w-3.5 h-3.5 text-teal-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>{copiedSection === 'P' ? 'Copiado' : 'Copiar P'}</span>
              </button>
            </div>

            <textarea
              value={soapState.plan}
              onChange={(e) => handleTextChange('plan', e.target.value)}
              placeholder="Condutas pactuadas, prescrição e posologia, cronograma de troca/desmame de antidepressivos, orientações de autocuidado, plano de segurança e retorno..."
              rows={8}
              className="w-full bg-slate-50/70 border border-slate-200 rounded-lg p-3.5 text-xs sm:text-sm text-slate-800 font-sans leading-relaxed focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all resize-none placeholder:text-slate-400"
            />
          </div>

          <p className="font-mono text-[11px] text-slate-500">
            Cronogramas de troca e desmame farmacológico são inseridos diretamente no Plano.
          </p>
        </div>
      </div>

      {/* Modal de Confirmação de Limpeza */}
      {showClearModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-xl p-6 w-full max-w-md shadow-2xl space-y-4 font-sans">
            <div className="flex items-center gap-3 text-amber-600">
              <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center border border-amber-200 shrink-0">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Confirmar Limpeza do SOAP
                </h3>
                <span className="text-xs text-slate-500">Ação irreversível</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Esta ação apagará todo o conteúdo digitado nos quatro blocos (Subjetivo, Objetivo, Avaliação e Plano). Deseja prosseguir?
            </p>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowClearModal(false)}
                className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-lg font-mono text-xs font-semibold uppercase tracking-wider border border-slate-200 transition-colors cursor-pointer shadow-xs"
              >
                Cancelar
              </button>
              <button
                onClick={handleClearSoap}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-mono text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
              >
                Sim, Limpar Campos
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
